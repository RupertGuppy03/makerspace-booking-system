# src/types/

Shared TypeScript types. Mostly mirrors of the C# models the API returns.

```
tool.ts          → Tool
reservation.ts   → Reservation
user.ts          → User
```

## Rules

- These must match the backend. If someone changes a C# model in
  `backend/src/ToolBooking.Api/Models/`, the matching type here changes in the same PR.
- C# `PascalCase` properties usually serialise to `camelCase` JSON — type what the API actually
  sends, not what the C# class looks like.
- Use `type` for object shapes, `interface` only when you need to extend.
- No `any`. If you don't know the shape yet, use `unknown` and narrow it.

Page-specific types that nobody else uses can just live in your page file.
