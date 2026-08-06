# Makerspace Booking System

A web app for booking tools in a university makerspace.

> **Status: skeleton only.** This commit is the folder structure and documentation. There is no
> code yet — nothing builds or runs. See [What's next](#whats-next).

## Stack

| Layer | Choice |
|---|---|
| Frontend | React + TypeScript (Vite), React Router, TanStack Query, MUI, Recharts |
| Backend | C# ASP.NET Core Web API (.NET 8), EF Core, Npgsql |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth — JWTs issued by Supabase, validated by the backend |
| Testing | Vitest + React Testing Library (frontend), xUnit (backend), Playwright for E2E later |
| CI | GitHub Actions |

## Who owns what

We work on separate pages so we don't collide in git.

| Page | Route | Owner |
|---|---|---|
| Management | `/management` | Rupert |
| User | `/user` | Bailey |
| Admin | `/admin` | Jayden |
| Login | `/login` | unassigned |

Rule of thumb: **stay inside your own page file.** If you need to change something shared
(`main.tsx`, routing, theme, shared components), say so in the group chat first — those are the
files that cause merge conflicts.

## Folder map

```
frontend/    React app (see frontend/README.md)
backend/     ASP.NET Core Web API (see backend/README.md)
```

Every folder has a `README.md` explaining what belongs in it. Read it before adding files there.

### Deliberately not here yet

We cut `docs/`, `database/`, `.github/workflows/` (CI) and `e2e/` (Playwright) to keep the repo
small while we're only building pages. They're all in the first commit, so add any of them back
with:

```bash
git checkout 3f586f5 -- docs database .github
```

## Getting set up

You need:

- **Node 20+** (we're on 24) — for the frontend
- **.NET 8 SDK** — for the backend. Note .NET 9 is *not* a substitute; the project targets `net8.0`.
- **git**

Nothing to install yet — there's no `package.json` or `.csproj` in this commit.

## Running it

Not yet possible. Once the frontend is scaffolded:

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

And once the backend exists:

```bash
cd backend/src/ToolBooking.Api
dotnet run
```

## Testing

```bash
cd frontend && npm run test   # Vitest unit tests
cd backend && dotnet test     # xUnit
```

## Secrets

Never commit real keys. Each half has a `.env.example` listing the variables it needs — copy it to
`.env` locally and fill in the values. `.env` is gitignored.

## What's next

1. **Frontend scaffold** — `npm create vite`, install dependencies, add the four page stubs and the
   router so everyone has a URL that renders their own file.
2. Build the pages.
3. Backend scaffold — `dotnet new webapi` + xUnit test project.
4. Supabase project + schema (bring `database/` back).
5. CI workflows (bring `.github/` back).
