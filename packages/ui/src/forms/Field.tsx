import { useId, type ReactNode } from 'react';
import styles from './forms.module.css';

export interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  /** Receives ids/aria props that must be spread onto the control. */
  children: (p: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: true }) => ReactNode;
}

/** Associates label, hint and error text with a control. Errors use text, not color alone. */
export function Field({ label, hint, error, children }: FieldProps) {
  const id = useId();
  const descId = hint || error ? `${id}-desc` : undefined;
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children({
        id,
        'aria-describedby': descId,
        ...(error ? { 'aria-invalid': true as const } : {}),
      })}
      {error ? (
        <span id={descId} className={styles.error}>
          Error: {error}
        </span>
      ) : hint ? (
        <span id={descId} className={styles.hint}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}
