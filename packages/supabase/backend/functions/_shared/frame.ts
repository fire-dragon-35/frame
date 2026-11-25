// Shared by Frame's Edge Functions (Deno). Secrets: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_IDS,
// SITE_URL. SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are set by Supabase.
import Stripe from 'npm:stripe@17';
import { createClient } from 'npm:@supabase/supabase-js@2';

export const env = (name: string): string => {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing secret ${name}`);
  return v;
};

export const stripe = new Stripe(env('STRIPE_SECRET_KEY'), {
  httpClient: Stripe.createFetchHttpClient(),
});
export const admin = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: { persistSession: false },
});

export const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });

/** The signed-in user of a request (its Authorization header), or null. */
export async function userOf(req: Request) {
  const token = req.headers.get('Authorization')?.replace(/^Bearer /, '');
  if (!token) return null;
  const { data } = await admin.auth.getUser(token);
  return data.user ?? null;
}

/** A path on the site, never another origin. */
export function siteUrl(path: unknown): string {
  const base = env('SITE_URL').replace(/\/$/, '');
  const p = typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') ? path : '/';
  return base + p;
}

/** The user's Stripe customer, created on first use and remembered in frame_subscriptions. */
export async function customerFor(user: { id: string; email?: string }): Promise<string> {
  const { data } = await admin
    .from('frame_subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle();
  if (data?.stripe_customer_id) return data.stripe_customer_id;
  const customer = await stripe.customers.create({
    email: user.email,
    metadata: { user_id: user.id },
  });
  await admin.from('frame_subscriptions').upsert({
    user_id: user.id,
    stripe_customer_id: customer.id,
    updated_at: new Date().toISOString(),
  });
  return customer.id;
}
