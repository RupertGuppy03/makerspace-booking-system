# Services/

Business logic. This is where the actual rules of the system live.

```
ToolService.cs          / IToolService.cs
ReservationService.cs   / IReservationService.cs
```

Things that belong here, not in a controller:

- Is this tool free between these two times?
- Is the user allowed to book it (trained, not over their booking limit)?
- Cancelling a reservation and freeing the slot.

## Conventions

- Interface + implementation, registered in `Program.cs`
  (`builder.Services.AddScoped<IToolService, ToolService>()`).
- Services take `AppDbContext` by constructor injection.
- Services don't know about HTTP — no `IActionResult`, no status codes. Return data or throw a
  domain exception; the controller translates that into a response.

This is the layer worth unit testing — see `tests/ToolBooking.Api.Tests/`.
