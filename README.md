# Makerspace Booking System

A web app for booking tools in a university makerspace.

> **Status: Default Template.** This commit is the project immediately after being made in visual studio, with only minor changes in folder structure

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


In visual studio, you should simply be able to press "start" to run the asp.net server and react frontend

In VSCode, you need to open program.cs in the server, then F5 or "Run and Debug". Then select C# then C#: Launch startup project. From then on, pressing F5 or debug should start it as usual.

