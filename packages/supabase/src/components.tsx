import { Stack } from '@frame/core';
import { Button, Field, Input, Text, type ButtonProps } from '@frame/ui';
import { useState, type FormEvent, type ReactNode } from 'react';
import { goTo, useAuth, useSubscription, useSupabase } from './FrameProvider';

export interface SignInLabels {
  email: string;
  submit: string;
  sent: string;
  invalid: string;
}
const EN: SignInLabels = {
  email: 'Email',
  submit: 'Send sign-in link',
  sent: 'Check your inbox for a sign-in link.',
  invalid: 'Enter a valid email address.',
};

/** Passwordless sign in: one email field, Supabase sends a magic link. */
export function SignInForm({
  labels = EN,
  redirectTo,
}: {
  labels?: SignInLabels;
  redirectTo?: string;
}) {
  const { signInWithEmail } = useAuth();
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
    <form onSubmit={submit} noValidate>
      <Stack gap={3}>
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
