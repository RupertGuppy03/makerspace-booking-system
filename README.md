# Makerspace Booking System

A web app for booking tools in a university makerspace.

## Dev Launch Instructions

You need:

- **Node 20+** (we're on 24) — for the frontend
- **.NET 8 SDK** — for the backend.
- **git**

Steps:

- Clone this repository and open it in Visual Studio
- In a terminal, navigate to makerspace-booking-system.client and run `npm install`
- In the solution explorer, right-click makerspace-booking-system.Server and click Set as Startup Project. The start button should now be labelled as `start` or `https`.

In Visual Studio, you should simply be able to press "start" to run the asp.net server and react frontend

If using VSCode, you need the C# Dev Kit extension. To run the project, open program.cs in the server folder and press F5 or "Run and Debug". Then select C# then C#: Launch startup project. From then on, pressing F5 or debug should start it as usual.

If it doesn't work, you may need to navigate to makerspace-booking-system.Server and run these two commands:
- `dotnet user-secrets init`
- `dotnet user-secrets set "SUPABASE_KEY:ServiceApiKey" "<secret key>"`

## Stack

| Layer | Choice |
|---|---|
| Frontend | React + TypeScript (Vite), React Router |
| Backend | C# ASP.NET Core Web API (.NET 8), EF Core, Npgsql |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth — JWTs issued by Supabase, validated by the backend |
| Testing | MSTest (Backend). Later, will use Vitest + React Testing Library (frontend) and Playwright (E2E) |
| CI | GitHub Actions |


