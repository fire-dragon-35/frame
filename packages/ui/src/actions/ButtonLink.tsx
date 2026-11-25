import type { AnchorHTMLAttributes } from 'react';
import { cx } from '../cx';
import styles from './Button.module.css';

export interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

/** A link that looks like a button: navigation with the weight of an action (hero, call to action, sign up). */
export function ButtonLink({ variant = 'primary', className, children, ...rest }: ButtonLinkProps) {
  return (
    <a className={cx(styles.button, styles[variant], styles.link, className)} {...rest}>
      {children}
    </a>
  );
}
