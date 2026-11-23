import { useId, type InputHTMLAttributes } from 'react';
import styles from './forms.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export function Checkbox({ label, id, ...rest }: CheckboxProps) {
  const auto = useId();
  const cid = id ?? auto;
  return (
    <span className={styles.checkRow}>
      <input type="checkbox" id={cid} className={styles.check} {...rest} />
      <label htmlFor={cid}>{label}</label>
    </span>
  );
}
