import { render, screen } from '@testing-library/react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { describe, expect, it } from 'vitest';
import { rowFromSubscription, shouldApply } from '../backend/functions/_shared/subscription';
import { FrameProvider, Paywall, RequireAuth } from './index';

/** The smallest client FrameProvider needs: a session (or none) and one frame_subscriptions row (or none). */
function fakeClient(userId: string | null, row: Record<string, unknown> | null) {
  const session = userId ? { user: { id: userId } } : null;
  const query = {
    select: () => query,
    eq: () => query,
    maybeSingle: async () => ({ data: row, error: null }),
  };
  return {
    auth: {
      getSession: async () => ({ data: { session } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    },
    from: () => query,
  } as unknown as SupabaseClient;
}

const future = new Date(Date.now() + 86_400_000).toISOString();

describe('@frame/supabase', () => {
  it('Paywall shows the content to an active subscriber', async () => {
    render(
      <FrameProvider
        client={fakeClient('u1', {
          status: 'active',
          price_id: 'p',
          current_period_end: future,
          cancel_at_period_end: false,
        })}
      >
        <Paywall fallback={<p>Upgrade</p>}>
          <p>Pro</p>
        </Paywall>
      </FrameProvider>,
    );
    expect(await screen.findByText('Pro')).toBeInTheDocument();
  });

  it('Paywall shows the fallback without a subscription, RequireAuth without a user', async () => {
    render(
      <FrameProvider client={fakeClient(null, null)}>
        <Paywall fallback={<p>Upgrade</p>}>
          <p>Pro</p>
        </Paywall>
        <RequireAuth fallback={<p>Sign in</p>}>
          <p>Account</p>
        </RequireAuth>
      </FrameProvider>,
    );
    expect(await screen.findByText('Upgrade')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.queryByText('Pro')).toBeNull();
  });

  it('webhook mapping: period from the item, events applied once and in order', () => {
    const row = rowFromSubscription(
      {
        id: 'sub_1',
        customer: 'cus_1',
        status: 'active',
        cancel_at_period_end: false,
        items: { data: [{ price: { id: 'price_1' }, current_period_end: 1_800_000_000 }] },
      },
      'u1',
      'evt_2',
      1_700_000_100,
    );
    expect(row).toMatchObject({
      user_id: 'u1',
      stripe_customer_id: 'cus_1',
      price_id: 'price_1',
      status: 'active',
      current_period_end: new Date(1_800_000_000_000).toISOString(),
    });
    expect(shouldApply(null, 'evt_1', 1)).toBe(true);
    expect(
      shouldApply(
        { last_event_id: 'evt_2', last_event_at: row.last_event_at },
        'evt_2',
        1_700_000_100,
      ),
    ).toBe(false);
    expect(
      shouldApply(
        { last_event_id: 'evt_2', last_event_at: row.last_event_at },
        'evt_1',
        1_700_000_000,
      ),
    ).toBe(false);
    expect(
      shouldApply(
        { last_event_id: 'evt_2', last_event_at: row.last_event_at },
        'evt_3',
        1_700_000_200,
      ),
    ).toBe(true);
  });
});
