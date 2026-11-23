import { describe, expect, it } from 'vitest';
import { defaultTheme, editorialTheme, themeToCssVars, validateTheme } from './index';

describe('themes', () => {
  it('presets validate', () => {
    expect(() => validateTheme(defaultTheme)).not.toThrow();
    expect(() => validateTheme(editorialTheme)).not.toThrow();
  });
  it('rejects incomplete custom themes', () => {
    expect(() => validateTheme({ name: 'x' })).toThrow();
  });
  it('emits semantic variables', () => {
    const v = themeToCssVars(defaultTheme);
    expect(v['--color-primary']).toBe('#2563eb');
    expect(v['--color-surface-secondary']).toBe('#f5f5f5');
  });
  it('dark mode overrides colors and keeps fallbacks', () => {
    const v = themeToCssVars(editorialTheme, 'dark');
    expect(v['--color-background']).toBe('#1c1917');
    expect(v['--color-danger']).toBe('#991b1b');
  });
  it('compact density shrinks controls', () => {
    const v = themeToCssVars({ ...defaultTheme, density: 'compact' });
    expect(v['--control-height']).toBe('2rem');
  });
});
