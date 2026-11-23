/* eslint-disable no-restricted-syntax -- sole sanctioned inline style: CSS custom properties carrying token-based layout values */
import type { ElementType, HTMLAttributes } from 'react';
import { responsiveVars, type Responsive } from '../../foundations/breakpoints';
import { spaceVar, type CssVars, type Space } from '../../foundations/types';
import styles from './Stack.module.css';

type Direction = 'row' | 'column';
export interface StackProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  as?: ElementType;
  direction?: Responsive<Direction>;
  gap?: Space;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between';
  wrap?: boolean;
}

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};
const justifyMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
};

/** One-dimensional layout: direction, gap, alignment, wrapping. Built on Flexbox. */
export function Stack({
  as: Tag = 'div',
  direction,
  gap,
  align,
  justify,
  wrap,
  className,
  ...rest
}: StackProps) {
  const vars: CssVars = { ...responsiveVars('stack-direction', direction) };
  if (gap !== undefined) vars['--stack-gap'] = spaceVar(gap);
  if (align) vars['--stack-align'] = alignMap[align];
  if (justify) vars['--stack-justify'] = justifyMap[justify];
  if (wrap) vars['--stack-wrap'] = 'wrap';
  return (
    <Tag className={[styles.stack, className].filter(Boolean).join(' ')} style={vars} {...rest} />
  );
}
