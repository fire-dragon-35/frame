import { Container, type ContainerProps } from '@frame/core';
import type { ReactNode } from 'react';
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
}

/** The site's footer: brand and tagline, link columns (one column on phones, side by side from 640 px), a legal line. */
export function Footer({ brand, tagline, columns = [], legal, size }: FooterProps) {
  return (
    <footer className={styles.footer}>
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
