using makerspace_booking_system.Server.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
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
    //receive JWT
    //return data related to user
    //return Results.Ok(new {Email = email });

});

app.MapPost("/api/reservation", async (ReservationDto reservationDto) =>
{
    // test if Reservation can be pulled directly out instead of reservationDetails
    var reservation = new Reservation
    {
        StartDay = reservationDto.StartDay,
        EndDay = reservationDto.EndDay,
        ToolId = reservationDto.ToolId,
        UserId = reservationDto.UserId
    };

    await supabase.From<Reservation>().Insert(reservation);
    return "good"; //TODO not sure what to return here
});








app.MapFallbackToFile("/index.html");

app.Run();
