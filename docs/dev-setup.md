# Dev setup

> TODO — expand once there's something to run.

Getting a new machine ready:

1. Install **Node 20+** and the **.NET 8 SDK** (.NET 9 will not work — the project targets `net8.0`).
2. Clone the repo.
3. Copy `frontend/.env.example` → `frontend/.env` and fill in the Supabase values.
4. Copy `backend/.env.example` → `backend/.env` and fill in the connection string.
5. `cd frontend && npm install` *(once the frontend is scaffolded)*.

Ask in the group chat for the Supabase project credentials — they are **not** in the repo.

### Gotchas

- Add anything that wasted your afternoon here so the next person skips it.
