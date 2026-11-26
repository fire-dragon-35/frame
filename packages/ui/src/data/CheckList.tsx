import type { ReactNode } from 'react';
import { cx } from '../cx';
import styles from './CheckList.module.css';

export interface CheckItem {
  title?: ReactNode;
  text?: ReactNode;
}
export interface CheckListProps {
  items: CheckItem[];
  /** `md` (default) for body lists, `lg` for a hero. */
  size?: 'md' | 'lg';
}

/** A list of benefits, each with a check mark in the primary colour, an optional bold title and a line of text. */
export function CheckList({ items, size = 'md' }: CheckListProps) {
  return (
    <ul className={cx(styles.list, styles[size])}>
      {items.map((it, i) => (
        <li key={i} className={styles.item}>
          <span className={styles.mark} aria-hidden="true">
            ✓
          </span>
          <span className={styles.body}>
            {it.title && <span className={styles.title}>{it.title}</span>}
            {it.text && <span className={styles.text}>{it.text}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}
