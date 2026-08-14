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
        t.LastMaintained,
        t.DailyRate
    });
    return tools;

});
// new api to get all reservations
app.MapGet("/api/reservations", async () =>
{
    var result = await supabase.From<Reservation>().Get();
    var supaReservations = result.Models;

    // Project to simple object so it can be serialized and read by React
    var reservations = supaReservations.Select(r => new
    {
        r.Id,
        r.StartDay,
        r.EndDay,
        r.ToolId,
        r.UserId,
        r.Status,
        r.CollectedAt,
        r.ReturnedAt,
        r.CancelledAt,
        r.AmountCharged
    });
    return reservations;
});
// new api to get all damage incidents, including those without a reservation id (i.e. found during maintenance)
app.MapGet("/api/damageincidents", async () =>
{
    var result = await supabase.From<DamageIncident>().Get();
    var supaDamageIncidents = result.Models;

    // Project to simple object so it can be serialized and read by React
    var damageIncidents = supaDamageIncidents.Select(d => new
    {
        d.Id,
        d.ToolId,
        d.ReservationId,
        d.Severity,
        d.RepairCost,
        d.ResolvedAt
    });
    return damageIncidents;
});


app.MapGet("/api/user", async () =>
{
    //receive JWT
    //return data related to user
    //return Results.Ok(new {Email = email });

});

app.MapPost("/api/reservation", async (ReservationDto reservationDto) =>
{
    var tool = await supabase.From<Tool>()
        .Where(t => t.Id == reservationDto.ToolId)
        .Single();
    // Check if the tool exists
    if (tool == null)
    {
        return Results.NotFound($"Tool with ID {reservationDto.ToolId} not found.");
    }
    var daysBooked = (reservationDto.EndDay - reservationDto.StartDay).Days + 1; // +1 to include the start day
    // test if Reservation can be pulled directly out instead of reservationDetails
    var reservation = new Reservation
    {
        StartDay = reservationDto.StartDay,
        EndDay = reservationDto.EndDay,
        ToolId = reservationDto.ToolId,
        UserId = reservationDto.UserId,
        Status = "Booked", // adding a default status for the reservation
        AmountCharged = tool.DailyRate * daysBooked // calculate the amount charged based on the tool's daily rate and the number of days booked
    };
        
    await supabase.From<Reservation>().Insert(reservation);
    // return "good"; //TODO not sure what to return here

    // here we return a JSON object with a message and the amount charged for the reservation

    return Results.Ok(new 
    {
        Message = "Reservation created successfully." ,
        amountCharged = reservation.AmountCharged,
        daysBooked
    });
});


app.MapFallbackToFile("/index.html");

app.Run();
