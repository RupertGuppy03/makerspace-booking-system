# database/

SQL for the Supabase Postgres database. Plain `.sql` files, run against the Supabase SQL editor or
via the Supabase CLI.

Planned files:

| File | Purpose |
|---|---|
| `schema.sql` | `CREATE TABLE` statements — tools, reservations, users |
| `seed.sql` | Sample data so we all develop against the same tools |

## Conventions

- `snake_case` for tables and columns.
- Table names plural: `tools`, `reservations`.
- Every table gets `id uuid primary key default gen_random_uuid()` and `created_at timestamptz
  default now()`.
- Schema changes are **additive** where possible — someone else's local data shouldn't break.

## Rules

- Don't edit tables by hand in the Supabase dashboard without putting the same change in `schema.sql`.
  If it isn't in git, it doesn't exist.
- No real user data in `seed.sql`. Make up tool names.

Explain the schema in prose in `docs/db-schema.md`.
