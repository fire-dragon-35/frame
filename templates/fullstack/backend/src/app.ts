import { createHmac, timingSafeEqual } from 'node:crypto';
import { createNoteInput } from '@frame-app/shared';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import Fastify, { type FastifyInstance, type FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import type { Env } from './env.js';

export type UserClientFactory = (accessToken: string) => SupabaseClient;

export interface AppDeps {
  env: Pick<Env, 'WEBHOOK_SECRET'>;
  /** Returns a Supabase client acting AS the user, so RLS applies. */
  userClient: UserClientFactory;
}

export const makeUserClientFactory =
  (env: Pick<Env, 'SUPABASE_URL' | 'SUPABASE_ANON_KEY'>): UserClientFactory =>
  (token) =>
    createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

declare module 'fastify' {
  interface FastifyRequest {
    db?: SupabaseClient;
    userId?: string;
  }
}

export function buildApp(deps: AppDeps): FastifyInstance {
  const app = Fastify({ logger: process.env.NODE_ENV !== 'test' });

  // Keep the raw body so webhook signatures can be verified.
  app.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
    (req as FastifyRequest & { rawBody?: string }).rawBody = body as string;
    try {
      done(null, body ? JSON.parse(body as string) : {});
    } catch (e) {
      done(e as Error);
    }
  });

  app.setErrorHandler((err, _req, reply) => {
    if (err instanceof ZodError)
      return reply.status(400).send({ error: 'validation_error', issues: err.issues });
    const status = (err as { statusCode?: number }).statusCode ?? 500;
    if (status >= 500) app.log.error(err);
    return reply
      .status(status)
      .send({ error: status >= 500 ? 'internal_error' : (err as Error).message });
  });

  app.get('/health', async () => ({ status: 'ok' }));

  // Authenticated routes: verify the user's JWT with Supabase Auth, then query AS that user (RLS enforced).
  app.register(async (api) => {
    api.addHook('preHandler', async (req, reply) => {
      const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
      if (!token) return reply.status(401).send({ error: 'missing_token' });
      const db = deps.userClient(token);
      const { data, error } = await db.auth.getUser(token);
      if (error || !data.user) return reply.status(401).send({ error: 'invalid_token' });
      req.db = db;
      req.userId = data.user.id;
    });

    api.get('/api/notes', async (req) => {
      const { data, error } = await req
        .db!.from('notes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { notes: data };
    });

    api.post('/api/notes', async (req, reply) => {
      const input = createNoteInput.parse(req.body);
      const { data, error } = await req
        .db!.from('notes')
        .insert({ title: input.title })
        .select()
        .single();
      if (error) throw error;
      return reply.status(201).send({ note: data });
    });
  });

  // Webhooks: authenticated by HMAC signature, not by user identity.
  app.post('/webhooks/example', async (req, reply) => {
    const raw = (req as FastifyRequest & { rawBody?: string }).rawBody ?? '';
    const sig = String(req.headers['x-signature'] ?? '');
    const expected = createHmac('sha256', deps.env.WEBHOOK_SECRET).update(raw).digest('hex');
    const a = Buffer.from(sig),
      b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b))
      return reply.status(401).send({ error: 'invalid_signature' });
    return { received: true };
  });

  return app;
}
