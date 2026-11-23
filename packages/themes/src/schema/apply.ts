import {
  validateTheme,
  type ColorTokens,
  type ResolvedTheme,
  type Theme,
  type ThemeMode,
} from './schema';

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

/** Pure: converts a theme into semantic CSS custom properties (no DOM needed). */
export function themeToCssVars(input: Theme, mode: ThemeMode = 'light'): Record<string, string> {
  const t: ResolvedTheme = validateTheme(input);
  const colors: ColorTokens = mode === 'dark' ? { ...t.colors, ...t.dark } : t.colors;
  const compact = t.density === 'compact';
  const vars: Record<string, string> = {};
  for (const [k, v] of Object.entries(colors)) vars[`--color-${kebab(k)}`] = v;
  vars['--font-body'] = t.typography.body;
  vars['--font-heading'] = t.typography.heading;
  vars['--radius-control'] = t.radius.control;
  vars['--radius-panel'] = t.radius.panel;
  vars['--space-panel'] = compact ? '0.875rem' : t.space.panel;
  vars['--control-height'] = compact ? '2rem' : t.control.height;
  vars['--focus-ring'] = t.focusRing;
  return vars;
}

export function applyTheme(
  input: Theme,
  mode: ThemeMode = 'light',
  el: HTMLElement = document.documentElement,
) {
  for (const [k, v] of Object.entries(themeToCssVars(input, mode))) el.style.setProperty(k, v);
  el.dataset.themeMode = mode;
  el.dataset.theme = input.name;
}
