import type { Database } from '@frame-app/shared';
import { createClient } from '@supabase/supabase-js';

// Only the publishable/anon key belongs in the browser. RLS protects the data.
export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL ?? 'http://127.0.0.1:54321',
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'missing-anon-key',
);
