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

app.MapGet("/api/user/{uuid}/reservations", async (string uuid, SupabaseDbContext db) =>
{
    return await db.Reservations
    .Where(r => r.UserId.ToString() == uuid)
    .Include(r => r.Tool)
    .ToListAsync();

});

app.MapPost("/api/reservation", async (Reservation reservation, SupabaseDbContext db) =>
{
    db.Reservations.Add(reservation); //TODO there may still be merit to having a DTO for POSTing a whole new entry
    await db.SaveChangesAsync();

    return Results.Ok("Reservation successfully added");
});


app.MapPatch("/api/reservation/{id}/cancel", async (int id, SupabaseDbContext db) => 
{
    var reservation = await db.Reservations.FindAsync(id);
    if (reservation is null) return Results.NotFound();

    reservation.Status = "cancelled";
    //TODO have error happen if reservation is already cancelled, or in a state which it shouldnt be cancelled
    
    await db.SaveChangesAsync();

    return Results.Ok("cancelled");


});






app.MapFallbackToFile("/index.html");

app.Run();
