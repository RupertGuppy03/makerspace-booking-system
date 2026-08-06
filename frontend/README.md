# frontend/

React + TypeScript single-page app, built with Vite.

> **Not scaffolded yet.** There is no `package.json` here — this commit is folders only. The
> scaffold is the next commit.

## Scaffolding it (next commit)

```bash
cd frontend
npm create vite@latest . -- --template react-ts

npm install react-router-dom @tanstack/react-query \
            @mui/material @mui/icons-material @emotion/react @emotion/styled \
            recharts @supabase/supabase-js

npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @playwright/test
```

## Running it (once scaffolded)

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
npm run test       # Vitest
npx playwright test
```

## Folder layout

| Folder | What goes in it |
|---|---|
| `src/pages/` | One component per route. **One file per person** — see its README |
| `src/components/` | Reusable UI shared across pages |
| `src/api/` | TanStack Query hooks that call the backend |
| `src/types/` | Shared TypeScript types mirroring the backend models |
| `src/lib/` | Supabase client, helpers, formatting utils |
| `src/tests/` | Vitest + React Testing Library unit tests |
| `e2e/` | Playwright end-to-end tests |

## Environment

Copy `.env.example` → `.env` and fill in the Supabase values. Vite only exposes variables prefixed
`VITE_`. `.env` is gitignored — never commit it.

## Working together

Three of us are building pages in parallel:

| Page | Route | Owner |
|---|---|---|
| `ManagementPage.tsx` | `/management` | Rupert |
| `UserPage.tsx` | `/user` | Bailey |
| `AdminPage.tsx` | `/admin` | Jayden |
| `LoginPage.tsx` | `/login` | unassigned |

Shared files (`main.tsx`, `App.tsx`, routing, theme) are where merge conflicts come from. Flag it in
the group chat before changing one.
