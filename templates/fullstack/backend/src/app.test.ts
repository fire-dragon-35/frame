import { createHmac } from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { describe, expect, it, vi } from 'vitest';
import { buildApp } from './app.js';

process.env.NODE_ENV = 'test';

function fakeClient(user: { id: string } | null) {
  const insert = vi.fn(() => ({
    select: () => ({ single: async () => ({ data: { id: 'n1', title: 'Hi' }, error: null }) }),
  }));
  const client = {
    auth: {
      getUser: async () =>
        user
          ? { data: { user }, error: null }
          : { data: { user: null }, error: { message: 'bad' } },
    },
    from: () => ({ insert, select: () => ({ order: async () => ({ data: [], error: null }) }) }),
  };
  return { client: client as unknown as SupabaseClient, insert };
}
const make = (user: { id: string } | null = { id: 'u1' }) => {
  const { client, insert } = fakeClient(user);
  return {
    app: buildApp({ env: { WEBHOOK_SECRET: 'secretsecret' }, userClient: () => client }),
    insert,
  };
};

describe('backend', () => {
  it('health is public', async () => {
    const res = await make().app.inject('/health');
    expect(res.json()).toEqual({ status: 'ok' });
  });
  it('rejects missing and invalid tokens', async () => {
    expect((await make().app.inject('/api/notes')).statusCode).toBe(401);
    const res = await make(null).app.inject({
      url: '/api/notes',
      headers: { authorization: 'Bearer x' },
    });
    expect(res.statusCode).toBe(401);
  });
  it('lists notes for an authenticated user', async () => {
    const res = await make().app.inject({
      url: '/api/notes',
      headers: { authorization: 'Bearer t' },
    });
    expect(res.json()).toEqual({ notes: [] });
  });
  it('validates input at the boundary', async () => {
    const res = await make().app.inject({
      method: 'POST',
      url: '/api/notes',
      headers: { authorization: 'Bearer t' },
      payload: { title: '' },
    });
    expect(res.statusCode).toBe(400);
  });
  it('creates a note', async () => {
    const res = await make().app.inject({
      method: 'POST',
      url: '/api/notes',
      headers: { authorization: 'Bearer t' },
      payload: { title: 'Hi' },
    });
    expect(res.statusCode).toBe(201);
  });
  it('verifies webhook signatures', async () => {
    const { app } = make();
    const body = JSON.stringify({ a: 1 });
    const good = createHmac('sha256', 'secretsecret').update(body).digest('hex');
    const ok = await app.inject({
      method: 'POST',
      url: '/webhooks/example',
      headers: { 'content-type': 'application/json', 'x-signature': good },
      payload: body,
    });
    expect(ok.statusCode).toBe(200);
    const bad = await app.inject({
      method: 'POST',
      url: '/webhooks/example',
      headers: { 'content-type': 'application/json', 'x-signature': 'nope' },
      payload: body,
    });
    expect(bad.statusCode).toBe(401);
  });
});
