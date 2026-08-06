# src/tests/

Unit and component tests — Vitest + React Testing Library.

```bash
npm run test           # watch mode
npm run test -- --run  # single pass, what CI does
```

## Conventions

- Name tests after what they test: `ManagementPage.test.tsx`, `useTools.test.ts`.
- **Test your own page.** Each of us covers the page we own.
- Query by what the user sees — `getByRole`, `getByLabelText`, `getByText`. Avoid test IDs and
  never assert on CSS classes.
- Don't hit the real API. Mock the `src/api/` hook or the fetch layer.
- Components using TanStack Query need a `QueryClientProvider` wrapper — write one shared render
  helper here rather than repeating it in every test.

Full user journeys across pages go in `e2e/` (Playwright), not here.
