# Auth

> TODO — not written yet.

What belongs here:

- The login flow: user signs in via Supabase Auth in the browser → Supabase returns a JWT → the
  frontend attaches it to API requests as `Authorization: Bearer <token>`.
- How the backend validates that token (issuer, audience, signing key from the Supabase project).
- Our roles — user vs admin vs management — and where role is stored.
- What each role is allowed to do.
