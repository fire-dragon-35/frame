import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let shared: SupabaseClient | undefined;

/**
 * The app's one Supabase client, from the env vars VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (the publishable
 * key; never the secret key). Pass `url` and `key` to override.
 */
export function getSupabase(url?: string, key?: string): SupabaseClient {
  if (shared) return shared;
  const u = url ?? import.meta.env.VITE_SUPABASE_URL;
  const k = key ?? import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!u || !k)
    throw new Error(
      'Frame: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (Supabase publishable key).',
    );
  shared = createClient(u, k, {
    // PKCE: the sign-in link returns `?code=…`, which works with hash routing (`#/page`); the implicit flow puts the
    // token in the hash and breaks it.
    auth: {
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return shared;
}
