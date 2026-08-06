# ToolBooking.Api.Tests/

xUnit tests for the API.

```bash
dotnet test
```

## Layout

Mirror the structure of the project under test:

```
Services/ReservationServiceTests.cs
Controllers/ToolsControllerTests.cs
```

## Conventions

- Test names say what they check: `Book_WhenSlotAlreadyTaken_ThrowsConflict`.
- Arrange / Act / Assert, with a blank line between each.
- Test the `Services/` layer first — that's where the rules that can actually be wrong live.
- For DbContext tests use the EF Core in-memory provider or a test container; don't touch the real
  Supabase database.
- One behaviour per test. If you need three asserts to describe it, it's probably two tests.

Every non-trivial rule (double bookings, permissions, cancellation windows) should have a test —
this is an SQA project, the tests are part of the mark.
