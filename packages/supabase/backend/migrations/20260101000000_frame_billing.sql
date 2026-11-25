-- Frame: one Stripe subscription per user. Written only by the frame-stripe-webhook Edge Function (service role).
create table if not exists public.frame_subscriptions (
  user_id                uuid primary key references auth.users on delete cascade,
  stripe_customer_id     text unique,
  stripe_subscription_id text,
  price_id               text,
  status                 text not null default 'none',   -- Stripe status, or 'none' before the first checkout
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  last_event_id          text,                            -- each Stripe event is applied once
  last_event_at          timestamptz,                     -- older events never overwrite newer ones
  updated_at             timestamptz not null default now()
);

alter table public.frame_subscriptions enable row level security;
drop policy if exists "frame: read own subscription" on public.frame_subscriptions;
create policy "frame: read own subscription" on public.frame_subscriptions for select using (user_id = auth.uid());
grant select on public.frame_subscriptions to authenticated;
grant all on public.frame_subscriptions to service_role;

-- Use in RLS policies and Edge Functions: is this user paying right now?
create or replace function public.frame_is_active(uid uuid) returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.frame_subscriptions s
    where s.user_id = uid and s.status in ('active', 'trialing')
      and (s.current_period_end is null or s.current_period_end > now())
  ) $$;
grant execute on function public.frame_is_active(uuid) to anon, authenticated, service_role;
