# src/api/

TanStack Query hooks — every call to the backend goes through here. Pages call these hooks; pages
never call `fetch` directly.

## Layout

One file per resource, matching a backend controller:

```
useTools.ts          → GET/POST /api/tools
useReservations.ts   → GET/POST /api/reservations
```

## Shape of a hook

```ts
export function useTools() {
  return useQuery({
    queryKey: ['tools'],
    queryFn: () => apiGet<Tool[]>('/api/tools'),
  });
}
```

- Return types come from `src/types/`.
- Query keys are arrays, and the first element is the resource name — `['tools']`,
  `['tools', id]`. Consistent keys are what makes cache invalidation work.
- Mutations invalidate the keys they affect.
- The auth token gets attached in one shared place (`src/lib/`), not in every hook.

If two of us need the same endpoint, we share the hook — don't write a second one.
