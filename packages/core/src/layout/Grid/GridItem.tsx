/* eslint-disable no-restricted-syntax -- sole sanctioned inline style: CSS custom properties carrying token-based layout values */
import type { HTMLAttributes } from 'react';
import { responsiveVars, type Responsive } from '../../foundations/breakpoints';
import type { CssVars } from '../../foundations/types';
import styles from './Grid.module.css';

export type Span = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export interface GridItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Column span out of 12. Defaults to 12 (full width) on mobile. */
  span?: Responsive<Span>;
}

/** Declares its intended span; the parent Grid owns actual placement. */
export function GridItem({ span, className, ...rest }: GridItemProps) {
  const vars: CssVars = responsiveVars('grid-span', span);
  return (
    <div className={[styles.item, className].filter(Boolean).join(' ')} style={vars} {...rest} />
  );
}
