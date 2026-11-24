/* eslint-disable no-restricted-syntax -- sole sanctioned inline style: CSS custom properties carrying a data colour */
import type { CSSProperties, HTMLAttributes } from 'react';
import { cx } from '../cx';
import styles from './Badge.module.css';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** `neutral|primary|success|danger` use theme tokens; `custom` uses `color` and `background`. Default `neutral`. */
  tone?: 'neutral' | 'primary' | 'success' | 'danger' | 'custom';
  /** `rounded` label, `pill` (fully round), or `dot` (a small colour mark, no text, hidden from screen readers). */
  shape?: 'rounded' | 'pill' | 'dot';
  /** Text colour when tone is `custom` (a data colour, e.g. a category). */
  color?: string;
  /** Background when tone is `custom`. */
  background?: string;
}

/**
 * A short label or colour mark: a status, a category, a tag. Colour is never the only signal: a rounded or pill
 * badge always carries text, and a dot sits next to text that names it.
 */
export function Badge({
  tone = 'neutral',
  shape = 'rounded',
  color,
  background,
  className,
  children,
  ...rest
}: BadgeProps) {
  const vars =
    tone === 'custom'
      ? ({ '--badge-fg': color, '--badge-bg': background } as CSSProperties)
      : undefined;
  return (
    <span
      className={cx(styles.badge, styles[shape], styles[tone], className)}
      style={vars}
      aria-hidden={shape === 'dot' || undefined}
      {...rest}
    >
      {shape === 'dot' ? null : children}
    </span>
  );
}
