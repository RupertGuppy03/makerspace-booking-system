using makerspace_booking_system.Server;
using makerspace_booking_system.Server.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Supabase.Gotrue;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<SupabaseDbContext>(opt => 
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Supabase"))
    );

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

app.MapGet("/api/tools", async (SupabaseDbContext db) =>
{
    return await db.Tools.ToListAsync();

});

app.MapGet("/api/user/{id}/reservations", async (string id, SupabaseDbContext db) =>
{
    return await db.Reservations
    .Where(r => r.UserId.ToString() == id)
    .Include(r => r.Tool)
    .ToListAsync();

});

app.MapPost("/api/reservation", async (ReservationDto reservationDto) =>
{
    var reservation = new ReservationSupa
    {
        StartDay = reservationDto.StartDay,
        EndDay = reservationDto.EndDay,
        ToolId = reservationDto.ToolId,
        UserId = reservationDto.UserId
    };

    await supabase.From<ReservationSupa>().Insert(reservation);
    return "good"; //TODO not sure what to return here
});








app.MapFallbackToFile("/index.html");

app.Run();
