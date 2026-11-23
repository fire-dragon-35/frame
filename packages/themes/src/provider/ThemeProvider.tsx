import { useLayoutEffect, type ReactNode } from 'react';
import { applyTheme } from '../schema/apply';
import type { Theme, ThemeMode } from '../schema/schema';

export interface ThemeProviderProps {
  theme: Theme;
  mode?: ThemeMode;
  children: ReactNode;
}

/** Applies semantic CSS variables to the document root. Renders no DOM of its own. */
export function ThemeProvider({ theme, mode = 'light', children }: ThemeProviderProps) {
  useLayoutEffect(() => applyTheme(theme, mode), [theme, mode]);
  return <>{children}</>;
}
