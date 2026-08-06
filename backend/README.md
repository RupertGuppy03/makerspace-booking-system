# backend/

ASP.NET Core Web API (.NET 8) talking to Supabase Postgres via EF Core + Npgsql.

> **Not scaffolded yet.** No `.csproj`, no `.sln`, no C# — this commit is folders only. We're doing
> the frontend first.

## Before you start

Install the **.NET 8 SDK**. This matters: the machine this was set up on has .NET 9 only, and a
`net8.0` project won't *run* on the .NET 9 runtime alone. Check with:

```bash
dotnet --list-sdks     # want a 8.x entry
```

## Scaffolding it (later)

```bash
cd backend
dotnet new sln -n ToolBooking

dotnet new webapi -o src/ToolBooking.Api -f net8.0
dotnet new xunit  -o tests/ToolBooking.Api.Tests -f net8.0

dotnet sln add src/ToolBooking.Api tests/ToolBooking.Api.Tests
dotnet add tests/ToolBooking.Api.Tests reference src/ToolBooking.Api

dotnet add src/ToolBooking.Api package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add src/ToolBooking.Api package Microsoft.EntityFrameworkCore.Design
dotnet add src/ToolBooking.Api package Microsoft.AspNetCore.Authentication.JwtBearer
```

## Running it (once scaffolded)

```bash
dotnet run --project src/ToolBooking.Api
dotnet test
```

## Layout

```
src/ToolBooking.Api/
├── Controllers/   HTTP endpoints
├── Models/        entities — Tool, Reservation, User
├── Data/          EF Core DbContext + migrations
├── Services/      business logic
└── Auth/          JWT validation against Supabase Auth
tests/ToolBooking.Api.Tests/   xUnit tests
```

Each folder has its own README.

## Config

Copy `.env.example` → `.env`. Connection strings and the JWT signing key never go in
`appsettings.json` — that file is committed.

## TODO

- Scaffold the projects with the commands above.
- Add a `backend.yml` GitHub Actions workflow (build + test) once there's something to build.
