import type { CSSProperties } from 'react';

/** Spacing scale keys map to --space-N tokens. */
export type Space = 0 | 1 | 2 | 3 | 4 | 6 | 8;
export const spaceVar = (s: Space) => (s === 0 ? '0' : `var(--space-${s})`);
export type CssVars = CSSProperties & Record<`--${string}`, string | number>;
