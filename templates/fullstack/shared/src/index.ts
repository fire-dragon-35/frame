import { z } from 'zod';

export const noteSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string(),
  created_at: z.string(),
});
export const createNoteInput = z.object({ title: z.string().trim().min(1).max(200) });

export type Note = z.infer<typeof noteSchema>;
export type CreateNoteInput = z.infer<typeof createNoteInput>;
export type { Database } from './database.types';
