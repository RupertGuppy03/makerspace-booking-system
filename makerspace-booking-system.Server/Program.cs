using makerspace_booking_system.Server.Models;

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

app.MapGet("/weatherforecast", async () =>
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

})
.WithName("GetWeatherForecast")
.WithOpenApi();







app.MapFallbackToFile("/index.html");

app.Run();

internal record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
