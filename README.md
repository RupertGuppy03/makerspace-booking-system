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


## Getting set up

You need:

- **Node 20+** (we're on 24) — for the frontend
- **.NET 8 SDK** — for the backend. Note .NET 9 is *not* a substitute; the project targets `net8.0`.
- **git**

Nothing to install yet — there's no `package.json` or `.csproj` in this commit.

