import { Stack } from '@frame/core';
import { Button, Field, Input, Text, type ButtonProps } from '@frame/ui';
import { useState, type FormEvent, type ReactNode } from 'react';
import { goTo, useAuth, useSubscription, useSupabase } from './FrameProvider';
import styles from './components.module.css';

/** Google's "G", as its brand guidelines ask for on a sign-in button. */
function GoogleMark() {
  return (
    <svg className={styles.mark} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.9 6.1C12.4 13.7 17.7 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z"
      />
      <path
        fill="#FBBC05"
        d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.6 10.7l7.9-6.1z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.6-4.2-13.5-10l-7.9 6.1C6.6 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}

export interface SignInLabels {
  email: string;
  submit: string;
  sent: string;
  invalid: string;
  /** the Google button and the line between it and the email field (with `google`) */
  google?: string;
  or?: string;
}
const EN: Required<SignInLabels> = {
  email: 'Email',
  submit: 'Send sign-in link',
  sent: 'Check your inbox for a sign-in link.',
  invalid: 'Enter a valid email address.',
  google: 'Continue with Google',
  or: 'or with email',
};

/**
 * Passwordless sign in: one email field, Supabase sends a magic link. With `google`, a Google button above it.
 * Either way the user lands back on the page the sign-in started on.
 */
export function SignInForm({
  labels: given = EN,
  redirectTo,
  google = false,
}: {
  labels?: SignInLabels;
  redirectTo?: string;
  google?: boolean;
}) {
  const labels = { ...EN, ...given };
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | undefined>();

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError(labels.invalid);
      return;
    }
    setState('sending');
    const { error: err } = await signInWithEmail(email, redirectTo);
    if (err) {
      setError(err.message);
      setState('idle');
    } else setState('sent');
  }

  if (state === 'sent')
    return (
      <Text as="p" role="status">
        {labels.sent}
      </Text>
    );
  return (
    <form onSubmit={submit} noValidate className={styles.form}>
      <Stack gap={3} align="stretch">
        {google && (
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={async () => {
                const { error: err } = await signInWithGoogle(redirectTo);
                if (err) setError(err.message);
              }}
            >
              <GoogleMark />
              {labels.google}
            </Button>
            <p className={styles.or}>{labels.or}</p>
          </>
        )}
        <Field label={labels.email} error={error}>
          {(props) => (
            <Input
              {...props}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(undefined);
              }}
            />
          )}
        </Field>
        <Button type="submit" disabled={state === 'sending'}>
          {labels.submit}
        </Button>
      </Stack>
    </form>
  );
}

/** Shows `children` to signed-in users, `fallback` (e.g. a SignInForm) to everyone else. */
export function RequireAuth({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return <>{user ? children : fallback}</>;
}

/** Shows `children` to paying users, `fallback` (e.g. a CheckoutButton) to everyone else. The server must check too (RLS with frame_is_active). */
export function Paywall({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const { active, loading } = useSubscription();
  if (loading) return null;
  return <>{active ? children : fallback}</>;
}

interface GoButtonProps extends Omit<ButtonProps, 'onClick'> {
  /** Where Stripe sends the user back to, a path on this site. Default: the current page. */
  returnPath?: string;
}
const here = () => window.location.pathname + window.location.search + window.location.hash;

/** Opens Stripe Checkout for `priceId` (one of the STRIPE_PRICE_IDS secret; default the first). Needs a signed-in user. */
export function CheckoutButton({
  priceId,
  returnPath,
  children,
  ...rest
}: GoButtonProps & { priceId?: string }) {
  return (
    <GoButton fn="frame-checkout" body={{ priceId, returnPath: returnPath ?? here() }} {...rest}>
      {children}
    </GoButton>
  );
}

/** Opens the Stripe customer portal (cancel, change card, receipts). */
export function BillingPortalButton({ returnPath, children, ...rest }: GoButtonProps) {
  return (
    <GoButton fn="frame-portal" body={{ returnPath: returnPath ?? here() }} {...rest}>
      {children}
    </GoButton>
  );
}

function GoButton({
  fn,
  body,
  children,
  ...rest
}: Omit<ButtonProps, 'onClick'> & {
  fn: 'frame-checkout' | 'frame-portal';
  body: Record<string, unknown>;
}) {
  const client = useSupabase();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <Stack gap={1}>
      <Button
        {...rest}
        disabled={busy || rest.disabled}
        onClick={async () => {
          setBusy(true);
          setError(await goTo(client, fn, body));
          setBusy(false);
        }}
      >
        {children}
      </Button>
      {error && (
        <Text size="xs" tone="muted" role="alert">
          {error}
        </Text>
      )}
    </Stack>
  );
}
