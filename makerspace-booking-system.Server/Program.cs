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

// --- Get list of all tools
app.MapGet("/api/tools", async (SupabaseDbContext db) =>
{
    return await db.Tools.ToListAsync();

});

// --- Create a new tool
app.MapPost("/api/tool", async (Tool tool, SupabaseDbContext db) =>
{
    db.Tools.Add(tool); 
    await db.SaveChangesAsync();

    return Results.Ok("Tool successfully created");
});

// --- Delete a tool
app.MapDelete("/api/tool/{id}", async (int id, SupabaseDbContext db) =>
{
    if (await db.Tools.FindAsync(id) is Tool tool)
    {
        db.Tools.Remove(tool);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }

    return Results.NotFound();
});


//TODO Apparently it would be better to use a DTO to pass information through the JSON body than to use [FromBody], so multiple variables could be passed (e.g. a ToolDto with all attributes nullable)
//But this works for now since its just one variable
// --- update LastMaintained on a tool 
app.MapPatch("/api/tool/{id}/maintain", async (int id, [FromBody] DateTime date, SupabaseDbContext db) =>
{   
    var tool = await db.Tools.FindAsync(id);
    if (tool is null) return Results.NotFound();

    tool.LastMaintained = date;

    await db.SaveChangesAsync();

    return Results.Ok("Last date maintained has been updated.");


});



// --- Get list of all reservations related to the user of the given uuid
app.MapGet("/api/user/{uuid}/reservations", async (string uuid, SupabaseDbContext db) =>
{
    return await db.Reservations
    .Where(r => r.UserId.ToString() == uuid)
    .Include(r => r.Tool)
    .ToListAsync();

});

// --- Create new reservation
app.MapPost("/api/reservation", async (Reservation reservation, SupabaseDbContext db) =>
{
    db.Reservations.Add(reservation); //TODO there may still be merit to having a DTO for POSTing a whole new entry
    await db.SaveChangesAsync();

    return Results.Ok("Reservation successfully added");
});

/*
 * For admin page where they can update the tool details (name, maintenance, cost) - Jayden
 */
app.MapPatch("/api/tool/{id}", async (int id, [FromBody]ToolUpdateDto update, SupabaseDbContext db) => {
    var tool = await db.Tools.FindAsync(id);
    if (tool is null) return Results.NotFound();

    // Update the tool properties with the values from the DTO
    if (update.Name is not null) tool.Name = update.Name;
    if (update.IsTakenOut is not null) tool.IsTakenOut = update.IsTakenOut.Value;
    if (update.MaintenancePeriod is not null) tool.MaintenancePeriod = update.MaintenancePeriod.Value;
    if (update.LastMaintained is not null) tool.LastMaintained = update.LastMaintained.Value;
    if (update.DailyRate is not null) tool.DailyRate = update.DailyRate.Value;
    await db.SaveChangesAsync();

    return Results.Ok($"{tool.Name} details updated successfully");
});


// --- Chnage reservation status to "cancelled" ---
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
