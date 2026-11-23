import type { SelectHTMLAttributes } from 'react';
import { cx } from '../cx';
import styles from './forms.module.css';

/** Native <select>: full platform keyboard and mobile behavior for free. */
export function Select({ className, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cx(styles.control, className)} {...rest} />;
}
