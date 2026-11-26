import type { ElementType, HTMLAttributes } from 'react';
import { cx } from '../cx';
import styles from './Heading.module.css';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * Size step. `display` = the hero title, `1` = a page title, `2` = a section title, `3` = a card or tool title.
   * Tokens `--heading-display|1|2|3`.
   */
  level: 'display' | 1 | 2 | 3;
  /** Element to render. Default: `h1` for display and 1, `h2` for 2, `h3` for 3. Change it for the outline, never for size. */
  as?: ElementType;
}

const TAG = { display: 'h1', 1: 'h1', 2: 'h2', 3: 'h3' } as const;

/** Every heading. Owns font, size, weight, line height and tracking; never margins (spacing comes from Stack, Page or Section). */
export function Heading({ level, as, className, ...rest }: HeadingProps) {
  const Tag = as ?? TAG[level];
  return <Tag className={cx(styles.heading, styles[`l${level}`], className)} {...rest} />;
}
