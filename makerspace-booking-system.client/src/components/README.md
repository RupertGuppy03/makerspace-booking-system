# src/components/

Reusable UI shared across pages. Presentational — components here take props and render; they
shouldn't fetch data themselves.

## Naming

This folder is shared by all three of us, so **prefix components that are really yours**:

- `ManagementToolTable.tsx` ✅ — clearly Rupert's, nobody else will touch it
- `Table.tsx` ❌ — three people will each want this name

Genuinely shared things (`LoadingSpinner.tsx`, `ErrorMessage.tsx`, `ConfirmDialog.tsx`) go
unprefixed — but say so in the group chat so we don't build the same one twice.

## Conventions

- One component per file, named export matching the filename.
- Props typed with an explicit `type Props = { ... }`.
- Prefer MUI components over hand-rolled CSS.
- Charts use Recharts.
