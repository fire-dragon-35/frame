import type { ButtonHTMLAttributes } from 'react';
import { cx } from '../cx';
import styles from './ListItem.module.css';

export interface ListItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The chosen item: a 2 px inset ring, exposed as `aria-pressed`. */
  selected?: boolean;
  /** Draws attention without selecting (e.g. "new"): a tinted background. Never the only signal; also say it in text. */
  highlighted?: boolean;
}

/**
 * A full-width, tappable row in a list (a result, a message, a file). A real button with a divider below it; put
 * several in a flush `Panel` for a bordered list. The content is free; lay it out with `Stack` (`as="span"`).
 */
export function ListItem({
  selected = false,
  highlighted = false,
  type = 'button',
  className,
  ...rest
}: ListItemProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      data-highlighted={highlighted || undefined}
      className={cx(
        styles.item,
        selected && styles.selected,
        highlighted && styles.highlighted,
        className,
      )}
      {...rest}
    />
  );
}
