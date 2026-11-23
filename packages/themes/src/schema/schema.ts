import { z } from 'zod';

const color = z.string().min(1);
const length = z.string().min(1);

export const colorTokensSchema = z.object({
  background: color,
  foreground: color,
  surface: color,
  surfaceSecondary: color,
  border: color,
  primary: color,
  primaryForeground: color,
  danger: color,
  success: color,
  muted: color,
});

export const themeSchema = z.object({
  name: z.string().min(1),
  colors: colorTokensSchema,
  /** Optional dark variant; unspecified tokens fall back to `colors`. */
  dark: colorTokensSchema.partial().optional(),
  typography: z.object({ body: z.string(), heading: z.string() }),
  radius: z.object({ control: length, panel: length }),
  space: z.object({ panel: length }),
  control: z.object({ height: length }),
  focusRing: z.string(),
  density: z.enum(['compact', 'comfortable']).default('comfortable'),
});

export type ColorTokens = z.infer<typeof colorTokensSchema>;
export type Theme = z.input<typeof themeSchema>;
export type ResolvedTheme = z.output<typeof themeSchema>;
export type ThemeMode = 'light' | 'dark';

export function validateTheme(input: unknown): ResolvedTheme {
  return themeSchema.parse(input);
}
