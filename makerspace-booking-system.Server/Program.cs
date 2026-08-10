using makerspace_booking_system.Server.Models;
using Supabase.Gotrue;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ####################
// ## Supabase Setup ##
// ####################

var url = Environment.GetEnvironmentVariable("SUPABASE_URL");
var key = builder.Configuration["SUPABASE_KEY:ServiceApiKey"];

var options = new Supabase.SupabaseOptions
{
    AutoConnectRealtime = true
};
var supabase = new Supabase.Client(url, key, options);
await supabase.InitializeAsync();




// ################################
// ## Minimal API endpoints here ##
// ################################

app.MapGet("/api/tools", async () =>
{
    var result = await supabase.From<Tool>().Get();
    var supaTools = result.Models;

    // Project to simple object so it can be serialized and read by React
    var tools = supaTools.Select(t => new
    {
        t.Id,
        t.CreatedAt,
        t.Name,
        t.IsTakenOut,
        t.MaintenancePeriod,
        t.LastMaintained
    });
    return tools;

});

app.MapGet("/api/user", async () =>
{
    //This really needs to be improved to use proper https 
    var session = supabase.Auth.CurrentSession;
    if (session == null) return Results.Ok(new {Email = "No active session" });
    var user = session.User;
    if (user == null) return Results.Ok(new {Email = "No session user" });
    var email = user.Email;
    return Results.Ok(new {Email = email });

});

// TODO: make the login/signup use the JWT from the client instead of being server-side logged in
// For both Get and Post apis above and below

app.MapPost("/api/signup", async (AuthDetails authDetails) =>
{
    //var options = new SignUpOptions { RedirectTo = "https://example.com/welcome" };
    var options = new SignUpOptions { };
    var session = await supabase.Auth.SignUp(authDetails.Email, authDetails.Password, options);
    return "good";
});

app.MapPost("/api/login", async (AuthDetails authDetails) =>
{
    //var options = new SignInOptions { RedirectTo = "https://example.com/welcome" };
    var options = new SignInOptions { };
    var session = await supabase.Auth.SignIn(authDetails.Email, authDetails.Password);
    return "good";
});







app.MapFallbackToFile("/index.html");

app.Run();
