import type { Theme } from '../schema/schema';

export const defaultTheme: Theme = {
  name: 'default',
  colors: {
    background: '#ffffff',
    foreground: '#171717',
    surface: '#ffffff',
    surfaceSecondary: '#f5f5f5',
    border: '#e5e5e5',
    primary: '#2563eb',
    primaryForeground: '#ffffff',
    danger: '#b91c1c',
    success: '#15803d',
    muted: '#525252',
  },
  dark: {
    background: '#0a0a0a',
    foreground: '#fafafa',
    surface: '#171717',
    surfaceSecondary: '#262626',
    border: '#3f3f3f',
    primary: '#60a5fa',
    primaryForeground: '#0a0a0a',
    danger: '#f87171',
    success: '#4ade80',
    muted: '#a3a3a3',
  },
  typography: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' },
  radius: { control: '0.5rem', panel: '0.75rem' },
  space: { panel: '1.25rem' },
  control: { height: '2.5rem' },
  focusRing: '0 0 0 3px rgb(37 99 235 / 35%)',
  density: 'comfortable',
};

export const editorialTheme: Theme = {
  name: 'editorial',
  colors: {
    background: '#faf7f2',
    foreground: '#1c1917',
    surface: '#fffdf9',
    surfaceSecondary: '#f0ebe1',
    border: '#d6cfc2',
    primary: '#9a3412',
    primaryForeground: '#ffffff',
    danger: '#991b1b',
    success: '#166534',
    muted: '#57534e',
  },
  dark: {
    background: '#1c1917',
    foreground: '#faf7f2',
    surface: '#292524',
    surfaceSecondary: '#34302d',
    border: '#57534e',
    primary: '#fb923c',
    primaryForeground: '#1c1917',
    muted: '#a8a29e',
  },
  typography: { body: 'Georgia, serif', heading: 'Georgia, serif' },
  radius: { control: '0.125rem', panel: '0.125rem' },
  space: { panel: '1.75rem' },
  control: { height: '2.75rem' },
  focusRing: '0 0 0 3px rgb(154 52 18 / 35%)',
  density: 'comfortable',
};

export const presets = { default: defaultTheme, editorial: editorialTheme } as const;
export type PresetName = keyof typeof presets;
