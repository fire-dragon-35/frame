import type { ReactNode } from 'react';
import styles from './Table.module.css';

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
}
export interface TableProps<T> {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
}

/** Semantic table; scrolls horizontally on narrow viewports instead of squashing columns. */
export function Table<T>({ caption, columns, rows, rowKey }: TableProps<T>) {
  return (
    // Scrollable regions must be keyboard-focusable so keyboard users can scroll them.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <div className={styles.scroll} tabIndex={0} role="region" aria-label={caption}>
      <table className={styles.table}>
        <caption className={styles.caption}>{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={rowKey(r)}>
              {columns.map((c) => (
                <td key={c.key}>{c.cell(r)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
