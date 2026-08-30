# src/components/

Reusable UI shared across pages. Presentational — components here take props and render; they
shouldn't fetch data themselves.

## Naming

Put components made for a specific page in a sub-folder.

## Conventions

- One component per file, named export matching the filename.
- Props typed with an explicit `type Props = { ... }`.
- Prefer MUI components over hand-rolled CSS.
- Charts use Recharts.
