import type { ElementType, HTMLAttributes } from 'react';
import styles from './Container.module.css';

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  size?: 'narrow' | 'default' | 'wide';
}

/** Owns maximum content width, centering and horizontal gutters. Nothing else. */
export function Container({
  as: Tag = 'div',
  size = 'default',
  className,
  ...rest
}: ContainerProps) {
  const cls = [styles.container, size !== 'default' && styles[size], className]
    .filter(Boolean)
    .join(' ');
  return <Tag className={cls} {...rest} />;
}
