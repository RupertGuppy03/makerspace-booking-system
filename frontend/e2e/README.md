# e2e/

End-to-end tests — Playwright drives a real browser against the running app.

```bash
npx playwright install   # one-off, downloads browsers (~400MB)
npx playwright test
npx playwright test --ui # interactive debugging
```

## What belongs here

Whole user journeys that cross pages:

- log in → browse tools → book one → see it in your reservations
- admin adds a tool → it appears on the user page

Single components in isolation belong in `src/tests/` instead — these are slow, so keep the number
small and make each one count.

## Conventions

- One file per journey: `booking.spec.ts`, `login.spec.ts`.
- Assume the dev server is running (or let the Playwright config start it).
- Use test accounts and seeded tools from `database/seed.sql` — never real credentials.
