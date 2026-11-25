/**
 * Pure mapping from a Stripe subscription to a frame_subscriptions row, and the rule that decides whether an event
 * may be applied. No imports, so it runs in Deno (Edge Functions) and in Vitest.
 */

export interface StripeSubscriptionLike {
  id: string;
  customer: string | { id: string };
  status: string;
  cancel_at_period_end: boolean;
  current_period_end?: number | null;
  metadata?: Record<string, string> | null;
  items: { data: { price: { id: string }; current_period_end?: number | null }[] };
}

export interface SubscriptionRow {
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  price_id: string | null;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  last_event_id: string;
  last_event_at: string;
  updated_at: string;
}

const iso = (seconds: number | null | undefined) =>
  seconds ? new Date(seconds * 1000).toISOString() : null;

/** The row for `userId` after Stripe event `eventId` (created at `eventCreated`, seconds) about `sub`. */
export function rowFromSubscription(
  sub: StripeSubscriptionLike,
  userId: string,
  eventId: string,
  eventCreated: number,
): SubscriptionRow {
  const item = sub.items.data[0];
  return {
    user_id: userId,
    stripe_customer_id: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
    stripe_subscription_id: sub.id,
    price_id: item?.price.id ?? null,
    status: sub.status,
    // newer Stripe API versions keep the period on the item
    current_period_end: iso(sub.current_period_end ?? item?.current_period_end),
    cancel_at_period_end: sub.cancel_at_period_end,
    last_event_id: eventId,
    last_event_at: new Date(eventCreated * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/** Apply an event only if it is new and not older than the last one applied (Stripe does not guarantee order). */
export function shouldApply(
  existing: { last_event_id: string | null; last_event_at: string | null } | null,
  eventId: string,
  eventCreated: number,
): boolean {
  if (!existing) return true;
  if (existing.last_event_id === eventId) return false;
  return !existing.last_event_at || Date.parse(existing.last_event_at) <= eventCreated * 1000;
}
