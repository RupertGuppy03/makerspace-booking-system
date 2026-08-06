# Auth/

JWT validation. Supabase Auth issues the tokens; this API only verifies them — we never handle
passwords ourselves.

## How it works

1. The user logs in through Supabase in the browser.
2. Supabase returns a JWT.
3. The frontend sends it as `Authorization: Bearer <token>`.
4. This API validates the signature, issuer and expiry, then reads the user id and role from the
   claims.

## What goes here

| File | Purpose |
|---|---|
| `JwtConfiguration.cs` | Extension method wiring `AddAuthentication().AddJwtBearer(...)` in `Program.cs` |
| `CurrentUser.cs` | Helper to pull the Supabase user id / role out of `ClaimsPrincipal` |

## Notes

- The signing secret and issuer come from configuration (`Supabase__JwtSecret`, `Supabase__Url`) —
  never hard-coded, never committed.
- The Supabase user id is the `sub` claim.
- Roles (user / admin / management) drive `[Authorize(Roles = "...")]`. Decide where role lives —
  Supabase user metadata or our own `users` table — and write it down in `docs/auth.md`.
- Don't trust anything from the client except what's inside a validated token.
