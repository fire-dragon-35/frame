/* eslint-disable no-restricted-syntax -- sole sanctioned inline style: CSS custom properties carrying token-based layout values */
import type { HTMLAttributes } from 'react';
import { spaceVar, type CssVars, type Space } from '../../foundations/types';
import { GridItem } from './GridItem';
import styles from './Grid.module.css';

export interface GridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  gap?: Space;
}

/** 12-column logical CSS Grid at every viewport size. Use Grid.Item to place children. */
function GridRoot({ gap, className, ...rest }: GridProps) {
  const vars: CssVars = gap !== undefined ? { '--grid-gap': spaceVar(gap) } : {};
  return (
    <div className={[styles.grid, className].filter(Boolean).join(' ')} style={vars} {...rest} />
  );
}

export const Grid = Object.assign(GridRoot, { Item: GridItem });
