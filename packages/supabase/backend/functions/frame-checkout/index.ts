// POST { priceId?, returnPath? } as a signed-in user → { url } of a Stripe Checkout page for a subscription.
// priceId must be one of STRIPE_PRICE_IDS (comma separated); the first is the default.
import { cors, customerFor, env, json, siteUrl, stripe, userOf } from '../_shared/frame.ts';

function withQuery(url: string, key: string, value: string): string {
  const u = new URL(url);
  u.searchParams.set(key, value);
  return u.toString();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const user = await userOf(req);
    if (!user) return json({ error: 'Sign in first' }, 401);
    const body = await req.json().catch(() => ({}));
    const allowed = env('STRIPE_PRICE_IDS')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const price = allowed.includes(body.priceId) ? body.priceId : allowed[0];
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: await customerFor(user),
      client_reference_id: user.id,
      line_items: [{ price, quantity: 1 }],
      subscription_data: { metadata: { user_id: user.id } },
      allow_promotion_codes: true,
      // ?checkout=success goes in the query, never after a #hash page
      success_url: withQuery(siteUrl(body.returnPath), 'checkout', 'success'),
      cancel_url: siteUrl(body.returnPath),
    });
    return json({ url: session.url });
  } catch (e) {
    console.error(e);
    return json({ error: 'Checkout could not start' }, 500);
  }
});
