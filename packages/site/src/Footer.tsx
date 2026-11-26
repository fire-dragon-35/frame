import { Container, type ContainerProps } from '@frame/core';
import type { ReactNode } from 'react';
import { cx } from './cx';
import styles from './Footer.module.css';

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterProps {
  brand: ReactNode;
  /** One sentence under the brand. */
  tagline?: ReactNode;
  columns?: FooterColumn[];
  /** The bottom line: copyright, attribution. */
  legal?: ReactNode;
  size?: ContainerProps['size'];
  /** `start` (default): brand left, columns beside it. `center`: everything centred, brand above the columns. */
  align?: 'start' | 'center';
  /** `dark`: a dark band (foreground colour as background, text in the background colour). */
  tone?: 'default' | 'dark';
}

/** The site's footer: brand and tagline, link columns (side by side from 640 px; under `center` always), a legal line. */
export function Footer({
  brand,
  tagline,
  columns = [],
  legal,
  size,
  align = 'start',
  tone = 'default',
}: FooterProps) {
  return (
    <footer
      className={cx(
        styles.footer,
        align === 'center' && styles.center,
        tone === 'dark' && styles.dark,
      )}
    >
      <Container size={size}>
        <div className={styles.grid}>
          <div className={styles.about}>
            <div className={styles.brand}>{brand}</div>
            {tagline && <p className={styles.tagline}>{tagline}</p>}
          </div>
          {columns.map((c) => (
            <nav key={c.title} className={styles.column} aria-label={c.title}>
              <p className={styles.title}>{c.title}</p>
              {c.links.map((l) => (
                <a key={l.label} href={l.href} className={styles.link}>
                  {l.label}
                </a>
              ))}
            </nav>
          ))}
        </div>
        {legal && <p className={styles.legal}>{legal}</p>}
      </Container>
    </footer>
  );
}
