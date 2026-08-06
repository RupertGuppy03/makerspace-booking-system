# src/lib/

Setup code and helpers that aren't React components.

Planned files:

| File | Purpose |
|---|---|
| `supabase.ts` | Creates the Supabase client from the `VITE_` env vars. Import it, don't re-create it |
| `apiClient.ts` | Thin `fetch` wrapper — sets the base URL and attaches the auth token |
| `format.ts` | Shared date/time formatting so reservations look the same everywhere |

## Rules

- One Supabase client for the whole app, created once and exported.
- Anything reading `import.meta.env` lives here, not scattered through pages.
- Pure functions — no JSX, no hooks.
- These files are shared by everyone. Add to them freely; think before changing existing behaviour.
