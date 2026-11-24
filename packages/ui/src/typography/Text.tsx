import type { ElementType, HTMLAttributes } from 'react';
import { cx } from '../cx';
import styles from './Text.module.css';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Element to render. Default `span`; use `p` for a paragraph, `h1`–`h3` for headings. */
  as?: ElementType;
  /** Type scale step: tokens `--text-xs|sm|md|lg|xl`. Default `sm`. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** `default` = foreground, `secondary` = between foreground and muted, `muted` = muted. */
  tone?: 'default' | 'secondary' | 'muted';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  /** Never wrap (numbers, prices, short labels). */
  nowrap?: boolean;
}

/** Text in the type scale. Owns font size, weight, colour and wrapping; never margins or layout. */
export function Text({
  as: Tag = 'span',
  size = 'sm',
  tone = 'default',
  weight = 'regular',
  nowrap,
  className,
  ...rest
}: TextProps) {
  return (
    <Tag
      className={cx(
        styles.text,
        styles[size],
        styles[tone],
        styles[weight],
        nowrap && styles.nowrap,
        className,
      )}
      {...rest}
    />
  );
}
