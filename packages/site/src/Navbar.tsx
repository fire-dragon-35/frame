import { Container, type ContainerProps } from '@frame/core';
import { useEffect, useRef, type ReactNode } from 'react';
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
 * The open menu closes on a tap anywhere outside it, on Escape, and after a link or action in it is chosen.
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
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = () => {
      if (menu.current) menu.current.open = false;
    };
    const onPointer = (e: PointerEvent) => {
      if (menu.current?.open && !menu.current.contains(e.target as Node)) close();
    };
    // a link or button chosen in the open menu closes it (a tap on the sheet's own padding does not)
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (menu.current?.open && menu.current.contains(t) && t.closest('a, button')) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    addEventListener('hashchange', close);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
      removeEventListener('hashchange', close);
    };
  }, []);
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
            <details ref={menu} className={styles.menu}>
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
