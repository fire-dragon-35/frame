import type { ElementType, HTMLAttributes } from 'react';
import styles from './Panel.module.css';

export interface PanelProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /** Remove internal padding, e.g. for edge-to-edge tables. */
  flush?: boolean;
}

/** A bounded content region that owns its internal padding. Not a generic div. */
export function Panel({ as: Tag = 'section', flush, className, ...rest }: PanelProps) {
  return (
    <Tag
      className={[styles.panel, flush && styles.flush, className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
}
