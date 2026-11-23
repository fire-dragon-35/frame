/** Breakpoints are implemented in CSS media queries; keep values in sync with the CSS modules. */
export const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const;
export type Breakpoint = keyof typeof breakpoints;
export type Responsive<T> = T | ({ base?: T } & Partial<Record<Breakpoint, T>>);

const order: Array<'base' | Breakpoint> = ['base', 'sm', 'md', 'lg', 'xl'];

/** Turns a responsive prop into CSS custom properties, e.g. --grid-span-md: 6. */
export function responsiveVars<T extends string | number>(
  prefix: string,
  value: Responsive<T> | undefined,
): Record<string, string | number> {
  const vars: Record<string, string | number> = {};
  if (value === undefined) return vars;
  if (typeof value !== 'object') {
    vars[`--${prefix}-base`] = value;
    return vars;
  }
  for (const key of order) {
    const v = value[key];
    if (v !== undefined) vars[`--${prefix}-${key}`] = v;
  }
  return vars;
}
