// Stripe → frame_subscriptions. Deploy with --no-verify-jwt (Stripe has no Supabase token); the Stripe signature is
// the authentication. Each event is applied once, and an older event never overwrites a newer one.
import Stripe from 'npm:stripe@17';
import { admin, env, stripe } from '../_shared/frame.ts';
import {
  rowFromSubscription,
  shouldApply,
  type StripeSubscriptionLike,
} from '../_shared/subscription.ts';

const crypto = Stripe.createSubtleCryptoProvider();
const HANDLED = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

Deno.serve(async (req) => {
  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = await stripe.webhooks.constructEventAsync(
      body,
      req.headers.get('Stripe-Signature') ?? '',
      env('STRIPE_WEBHOOK_SECRET'),
      undefined,
      crypto,
    );
  } catch {
    return new Response('Bad signature', { status: 400 });
  }
  if (!HANDLED.has(event.type)) return new Response('ignored');

  try {
    const sub = (event.type === 'checkout.session.completed'
      ? await stripe.subscriptions.retrieve(
          String((event.data.object as Stripe.Checkout.Session).subscription),
        )
      : event.data.object) as unknown as StripeSubscriptionLike;
    const userId =
      sub.metadata?.user_id ?? (event.data.object as Stripe.Checkout.Session).client_reference_id;
    if (!userId) return new Response('no user_id', { status: 200 });

    const { data: existing } = await admin
      .from('frame_subscriptions')
      .select('last_event_id, last_event_at')
      .eq('user_id', userId)
      .maybeSingle();
    if (!shouldApply(existing, event.id, event.created)) return new Response('already applied');

    const { error } = await admin
      .from('frame_subscriptions')
      .upsert(rowFromSubscription(sub, userId, event.id, event.created));
    if (error) throw error;
    return new Response('ok');
  } catch (e) {
    console.error(e);
    return new Response('retry', { status: 500 }); // Stripe retries
  }
});
