# src/pages/

One component per route. **This is where each of us works.**

| File | Route | Owner |
|---|---|---|
| `ManagementPage.tsx` | `/management` | Rupert |
| `UserPage.tsx` | `/user` | Bailey |
| `AdminPage.tsx` | `/admin` | Jayden |
| `LoginPage.tsx` | `/login` | unassigned |

## Rules

- **Only edit your own page file.** That's the whole point of this layout — three people can push
  all day without touching the same file.
- One default export per file, named the same as the file:
  ```tsx
  export default function ManagementPage() { ... }
  ```
- If your page gets long, pull pieces out into `src/components/` — but prefix them so they don't
  clash (`ManagementToolTable.tsx`, not `Table.tsx`).
- Don't fetch data with `useEffect` + `fetch` here. Write a TanStack Query hook in `src/api/` and
  call it from your page.

New routes need a change to the shared router — mention it in the group chat first.
