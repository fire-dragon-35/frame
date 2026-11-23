import type { InputHTMLAttributes } from 'react';
import { cx } from '../cx';
import styles from './forms.module.css';

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(styles.control, className)} {...rest} />;
}
