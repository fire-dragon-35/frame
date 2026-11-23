# ADR 0002: Supabase SQL migrations own the schema

**Status:** Accepted

## Decision

PostgreSQL via Supabase; SQL migrations are the only schema source; TypeScript types are generated. No Drizzle or second migration system.

## Consequences

Fastify and the browser share one identity and authorization model: Supabase Auth + RLS. Fastify queries as the verified user; service-role use is narrow and justified.
