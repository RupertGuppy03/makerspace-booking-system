# Models/

Entity classes — the C# shape of our database tables. One file per entity.

| File | Represents |
|---|---|
| `Tool.cs` | A bookable item in the makerspace (3D printer, laser cutter…) |
| `Reservation.cs` | A booking of one tool by one user for a time window |
| `User.cs` | A user profile, keyed to the Supabase Auth user id |

## Conventions

- `PascalCase` properties; EF Core maps them to `snake_case` columns via configuration in `Data/`.
- `Guid` primary keys named `Id`, matching the `uuid` columns in `database/schema.sql`.
- `DateTimeOffset` for timestamps, never `DateTime` — bookings have time zones.
- Nullable reference types are on: mark optional properties `?` and mean it.

DTOs (what controllers actually return) can live here in a `Dtos/` subfolder, or next to their
controller. Either way, don't return entities straight out of the API.

Keep these in sync with `frontend/src/types/` and `database/schema.sql` — all three describe the
same thing.
