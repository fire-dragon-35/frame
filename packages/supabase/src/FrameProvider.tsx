import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getSupabase } from './client';

export interface Subscription {
  status: string;
  priceId: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

interface FrameState {
  client: SupabaseClient;
  session: Session | null;
  user: User | null;
  /** True until the stored session (and then the subscription) has been read. */
  loading: boolean;
  subscription: Subscription | null;
  /** Paying right now: status active or trialing and the period not over. */
  active: boolean;
  refreshSubscription: () => Promise<void>;
}

const Ctx = createContext<FrameState | null>(null);

function isActive(s: Subscription | null) {
  return (
    !!s &&
    (s.status === 'active' || s.status === 'trialing') &&
    (!s.currentPeriodEnd || Date.parse(s.currentPeriodEnd) > Date.now())
  );
}

/** The page (hash) a sign-in started on, so the user lands there again, also when the email link opens a new tab. */
const RETURN_KEY = 'frame:return-to';
function rememberPage() {
  try {
    if (window.location.hash) localStorage.setItem(RETURN_KEY, window.location.hash);
  } catch {
    /* private mode: the user lands on the root */
  }
}
function returnToPage() {
  try {
    const hash = localStorage.getItem(RETURN_KEY);
    localStorage.removeItem(RETURN_KEY);
    if (hash && window.location.hash !== hash) window.location.hash = hash;
  } catch {
    /* private mode */
  }
}

/**
 * Wrap the app once. Holds the Supabase session and the user's subscription (table frame_subscriptions, own row
 * only through RLS). The subscription is read again when the tab becomes visible, e.g. back from Stripe Checkout.
 */
export function FrameProvider({
  client,
  children,
}: {
  client?: SupabaseClient;
  children: ReactNode;
}) {
  const supabase = useMemo(() => client ?? getSupabase(), [client]);
  const [session, setSession] = useState<Session | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = session?.user.id;

  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (alive) {
        setSession(data.session);
        if (!data.session) setLoading(false);
      }
    });
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === 'SIGNED_IN') returnToPage();
      if (!s) setLoading(false);
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  const refreshSubscription = useCallback(async () => {
    if (!userId) {
      setSubscription(null);
      return;
    }
    const { data } = await supabase
      .from('frame_subscriptions')
      .select('status, price_id, current_period_end, cancel_at_period_end')
      .eq('user_id', userId)
      .maybeSingle();
    setSubscription(
      data
        ? {
            status: data.status,
            priceId: data.price_id,
            currentPeriodEnd: data.current_period_end,
            cancelAtPeriodEnd: data.cancel_at_period_end,
          }
        : null,
    );
    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    void refreshSubscription();
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refreshSubscription();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refreshSubscription]);

  const value = useMemo<FrameState>(
    () => ({
      client: supabase,
      session,
      user: session?.user ?? null,
      loading,
      subscription,
      active: isActive(subscription),
      refreshSubscription,
    }),
    [supabase, session, loading, subscription, refreshSubscription],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function useFrame(): FrameState {
  const v = useContext(Ctx);
  if (!v) throw new Error('Frame: wrap the app in <FrameProvider>.');
  return v;
}

/** The Supabase client (for the app's own tables). */
export const useSupabase = () => useFrame().client;

/** Session, user and the sign in / out actions. */
export function useAuth() {
  const { client, session, user, loading } = useFrame();
  return {
    session,
    user,
    loading,
    /**
     * Sends a magic link; the user comes back to `redirectTo` signed in (default: this site's root, no hash; it must be
     * in Supabase's redirect URLs), then to the page the sign-in started on.
     */
    signInWithEmail: (
      email: string,
      redirectTo = window.location.origin + window.location.pathname,
    ) => {
      rememberPage();
      return client.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    },
    /** Google sign-in (enable the Google provider in Supabase); back on the same page afterwards. */
    signInWithGoogle: (redirectTo = window.location.origin + window.location.pathname) => {
      rememberPage();
      return client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
    },
    signOut: () => client.auth.signOut(),
  };
}

/** The user's subscription and whether it is active. */
export function useSubscription() {
  const { subscription, active, loading, refreshSubscription } = useFrame();
  return { subscription, active, loading, refresh: refreshSubscription };
}

/** Calls one of Frame's Edge Functions (frame-checkout, frame-portal) and follows the URL it returns. */
export async function goTo(
  client: SupabaseClient,
  fn: 'frame-checkout' | 'frame-portal',
  body: Record<string, unknown>,
): Promise<string | null> {
  const { data, error } = await client.functions.invoke<{ url?: string; error?: string }>(fn, {
    body,
  });
  if (error || !data?.url) return data?.error ?? error?.message ?? 'Something went wrong';
  window.location.assign(data.url);
  return null;
}
