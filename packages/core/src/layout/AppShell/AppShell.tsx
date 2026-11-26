import type { ReactNode } from 'react';
import styles from './AppShell.module.css';

export interface AppShellProps {
  /** Top navigation region. On small screens consumers render a compact variant here. */
  navigation?: ReactNode;
  /** Persistent sidebar from the lg breakpoint up; hidden below it. */
  sidebar?: ReactNode;
  /** Site footer, after the main region; it sits at the bottom of the window on short pages. */
  footer?: ReactNode;
  children: ReactNode;
}

/** Overall application frame: navigation, optional sidebar, and the main content region. */
export function AppShell({ navigation, sidebar, footer, children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      {navigation && <div className={styles.navigation}>{navigation}</div>}
      <div className={[styles.body, sidebar && styles.hasSidebar].filter(Boolean).join(' ')}>
        {sidebar && <aside className={styles.sidebar}>{sidebar}</aside>}
        <main className={styles.main}>{children}</main>
      </div>
      {footer}
    </div>
  );
}
