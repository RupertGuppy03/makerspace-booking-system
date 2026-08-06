# .github/workflows/

GitHub Actions CI. Nothing here yet — there's no code to build.

## Planned

| File | Runs |
|---|---|
| `frontend.yml` | `npm ci`, `npm run lint`, `npm run test -- --run`, `npm run build` |
| `backend.yml` | `dotnet restore`, `dotnet build`, `dotnet test` |

Both trigger on push and pull request to `main`, with `paths:` filters so a frontend change doesn't
run the backend job.

## Add these when

- `frontend.yml` — as soon as the Vite app is scaffolded (next commit).
- `backend.yml` — once `dotnet new` has been run.

Once CI is green, turn on branch protection for `main` so a failing build blocks the merge. That's
the point of having it.
