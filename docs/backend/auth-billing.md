# Auth and billing (`@frame/supabase`)

Sign in with a magic link and one Stripe subscription per user, on Supabase. The app writes no auth or payment
code: it wraps itself in `FrameProvider`, uses the components, deploys Frame's backend files and sets env vars.

## 1. Frontend

```tsx
import {
  FrameProvider,
  SignInForm,
  RequireAuth,
  Paywall,
  CheckoutButton,
  BillingPortalButton,
  useAuth,
} from '@frame/supabase';

<FrameProvider>
  {' '}
  {/* once, around the app */}
  <RequireAuth fallback={<SignInForm />}>
    {' '}
    {/* signed-in only */}
    <Paywall fallback={<CheckoutButton>Upgrade</CheckoutButton>}>
      <ProFeature /> {/* paying only */}
    </Paywall>
    <BillingPortalButton variant="secondary">Manage subscription</BillingPortalButton>
  </RequireAuth>
</FrameProvider>;
```

| Export                    | What it does                                                                                                |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `FrameProvider`           | Holds the session and the user's subscription; re-reads it when the tab becomes visible (back from Stripe). |
| `useAuth()`               | `{ user, session, loading, signInWithEmail(email, redirectTo?), signOut() }`                                |
| `useSubscription()`       | `{ active, subscription, loading, refresh() }`; `active` = status active or trialing, period not over.      |
| `useSupabase()`           | The client, for the app's own tables.                                                                       |
| `SignInForm`              | Email field and button; sends a magic link. `labels` to translate.                                          |
| `RequireAuth` / `Paywall` | Children or `fallback`. UI only: protect data with RLS (below).                                             |
| `CheckoutButton`          | Stripe Checkout for `priceId` (default: the first allowed price). `returnPath` (default: this page).        |
| `BillingPortalButton`     | Stripe customer portal: cancel, card, receipts.                                                             |

## 2. Backend (Supabase)

```sh
npx frame-supabase sync .                 # copies Frame's migration and Edge Functions into ./supabase
supabase db push
supabase functions deploy frame-checkout frame-portal
supabase functions deploy frame-stripe-webhook --no-verify-jwt
```

Run `sync` again after updating Frame; commit the copied files in the app.

- Table `frame_subscriptions` (one row per user, readable only by its user, written only by the webhook).
- Function `frame_is_active(uid)` for RLS: `using (frame_is_active(auth.uid()))` makes data paid-only on the server.

## 3. Environment

| Where                | Name                     | Value                                                         |
| -------------------- | ------------------------ | ------------------------------------------------------------- |
| App (Vercel, `.env`) | `VITE_SUPABASE_URL`      | `https://<ref>.supabase.co`                                   |
| App                  | `VITE_SUPABASE_ANON_KEY` | the publishable key `sb_publishable_…` (never the secret key) |
| Supabase secrets     | `STRIPE_SECRET_KEY`      | `sk_test_…` / `sk_live_…`                                     |
| Supabase secrets     | `STRIPE_WEBHOOK_SECRET`  | `whsec_…` from the webhook endpoint below                     |
| Supabase secrets     | `STRIPE_PRICE_IDS`       | `price_…` (comma separated; the first is the default)         |
| Supabase secrets     | `SITE_URL`               | `https://your-app.vercel.app` (Stripe returns here)           |

`supabase secrets set STRIPE_SECRET_KEY=… STRIPE_WEBHOOK_SECRET=… STRIPE_PRICE_IDS=… SITE_URL=…`

## 4. Stripe and Supabase dashboards

1. Stripe: create a product with a recurring price; copy its `price_…` id.
2. Stripe → Developers → Webhooks: endpoint `https://<ref>.supabase.co/functions/v1/frame-stripe-webhook`, events
   `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`,
   `customer.subscription.deleted`; copy the signing secret.
3. Stripe → Settings → Billing → Customer portal: turn it on (cancel, update payment method).
4. Supabase → Authentication → URL configuration: Site URL and redirect URLs = your app's URLs (magic links).
