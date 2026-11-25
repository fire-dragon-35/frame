// POST { returnPath? } as a signed-in user → { url } of the Stripe customer portal (cancel, card, invoices).
import { admin, cors, json, siteUrl, stripe, userOf } from '../_shared/frame.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const user = await userOf(req);
    if (!user) return json({ error: 'Sign in first' }, 401);
    const body = await req.json().catch(() => ({}));
    const { data } = await admin
      .from('frame_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();
    if (!data?.stripe_customer_id) return json({ error: 'No subscription yet' }, 404);
    const session = await stripe.billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      return_url: siteUrl(body.returnPath),
    });
    return json({ url: session.url });
  } catch (e) {
    console.error(e);
    return json({ error: 'Portal could not open' }, 500);
  }
});
