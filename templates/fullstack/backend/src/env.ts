import { z } from 'zod';

const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  WEBHOOK_SECRET: z.string().min(8),
  PORT: z.coerce.number().default(3001),
});
export type Env = z.infer<typeof envSchema>;
export const loadEnv = (source: NodeJS.ProcessEnv = process.env): Env => envSchema.parse(source);
