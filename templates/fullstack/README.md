# Frame fullstack template

React + Vite frontend, Fastify backend, shared Zod schemas, and a Supabase project (SQL migrations are the schema source of truth).

```bash
cp .env.example .env     # fill keys from `supabase status`
pnpm db:start            # needs Docker + Supabase CLI
pnpm db:types            # regenerate shared/src/database.types.ts
pnpm dev                 # frontend :5173, backend :3001
```

Authorization model: identity = Supabase Auth; access = RLS. The backend verifies the user's JWT and queries _as that user_.
The service-role key is server-only and must be used only for narrowly scoped privileged operations.
