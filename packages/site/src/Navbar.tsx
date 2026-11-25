import { Container, type ContainerProps } from '@frame/core';
import type { ReactNode } from 'react';
import styles from './Navbar.module.css';

export interface NavLink {
  label: string;
  href: string;
  /** Marks the link of the page being shown (`aria-current="page"`). */
  current?: boolean;
}

export interface NavbarProps {
  /** Logo and/or name. Rendered inside the home link. */
  brand: ReactNode;
  /** Accessible name of the home link, e.g. "Acme, home". */
  brandLabel: string;
  brandHref?: string;
  links?: NavLink[];
  /** Right side: sign in, sign up (`ButtonLink`), an account menu. */
  actions?: ReactNode;
  size?: ContainerProps['size'];
  /** Accessible names. */
  navLabel?: string;
  menuLabel?: string;
}

/**
 * The site's top bar: brand at the left, page links, actions at the right. It scrolls with the page (never fixed).
 * Under 768 px links and actions fold into a menu button (a native `<details>`, so it works without JavaScript).
 */
export function Navbar({
  brand,
  brandLabel,
  brandHref = '/',
  links = [],
  actions,
  size,
  navLabel = 'Main',
  menuLabel = 'Menu',
}: NavbarProps) {
  const items = links.map((l) => (
    <a
      key={l.href}
      href={l.href}
      className={styles.link}
      aria-current={l.current ? 'page' : undefined}
    >
      {l.label}
    </a>
  ));
  return (
    <header className={styles.bar}>
      <Container size={size}>
        <div className={styles.row}>
          <a href={brandHref} className={styles.brand} aria-label={brandLabel}>
            {brand}
          </a>
          {items.length > 0 && (
            <nav className={styles.nav} aria-label={navLabel}>
              {items}
            </nav>
          )}
          {actions && <div className={styles.actions}>{actions}</div>}
          {(items.length > 0 || actions) && (
            <details className={styles.menu}>
              <summary className={styles.burger} aria-label={menuLabel}>
                <span />
                <span />
                <span />
              </summary>
              <div className={styles.sheet}>
                {items.length > 0 && (
                  <nav aria-label={`${navLabel} (${menuLabel})`} className={styles.sheetNav}>
                    {items}
                  </nav>
                )}
                {actions && <div className={styles.sheetActions}>{actions}</div>}
              </div>
            </details>
          )}
        </div>
      </Container>
    </header>
  );
}
