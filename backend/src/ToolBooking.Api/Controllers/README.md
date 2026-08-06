# Controllers/

HTTP endpoints. One controller per resource.

```
ToolsController.cs          → /api/tools
ReservationsController.cs   → /api/reservations
UsersController.cs          → /api/users
```

## Rules

- Controllers are **thin**: validate input, call a service, return a result. No business logic and
  no EF Core queries in here — those live in `Services/` and `Data/`.
- Return DTOs, not EF entities, so we don't leak database columns or serialise navigation loops.
- `[Authorize]` by default; `[AllowAnonymous]` only where we mean it.
- Return the right status codes — `200`, `201 Created`, `400`, `404`, not `200 { error: ... }`.

Document every endpoint you add in `docs/api.md`. The frontend team reads that file, not this code.
