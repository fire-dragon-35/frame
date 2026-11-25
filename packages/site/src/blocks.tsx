import { Container, type ContainerProps } from '@frame/core';
import type { ReactNode } from 'react';
import { cx } from './cx';
import styles from './blocks.module.css';

type Size = ContainerProps['size'];
interface Item {
  title: string;
  text: string;
}

export interface SectionProps {
  /** Section heading (h2). Leave out for an unlabelled band, then give `label`. */
  title?: string;
  /** Accessible name when there is no title. */
  label?: string;
  /** `muted` = a full width tinted band with borders. */
  tone?: 'default' | 'muted';
  size?: Size;
  id?: string;
  children: ReactNode;
}

/** One landing page section: vertical rhythm, a heading, the content in a container. Every block below is a Section. */
export function Section({
  title,
  label,
  tone = 'default',
  size = 'wide',
  id,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={title ? undefined : label}
      className={cx(styles.section, tone === 'muted' && styles.muted)}
    >
      <Container size={size}>
        {title && <h2 className={styles.heading}>{title}</h2>}
        {children}
      </Container>
    </section>
  );
}

export interface HeroProps {
  /** Small line above the title, in the primary colour. */
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  /** Usually one primary and one secondary `ButtonLink`. */
  actions?: ReactNode;
  size?: Size;
}

/** The top of a landing page: the one h1, a lead paragraph and the main actions. */
export function Hero({ eyebrow, title, lead, actions, size = 'wide' }: HeroProps) {
  return (
    <section className={styles.hero}>
      <Container size={size}>
        <div className={styles.heroText}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h1 className={styles.title}>{title}</h1>
          {lead && <p className={styles.lead}>{lead}</p>}
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      </Container>
    </section>
  );
}

/** Key numbers in a tinted band: 2 per row on phones, 4 from 640 px. */
export function Stats({
  items,
  label = 'Key figures',
  size,
}: {
  items: { value: string; label: string }[];
  label?: string;
  size?: Size;
}) {
  return (
    <Section label={label} tone="muted" size={size}>
      <dl className={styles.stats}>
        {items.map((s) => (
          <div key={s.label} className={styles.stat}>
            <dt className={styles.statValue}>{s.value}</dt>
            <dd className={styles.statLabel}>{s.label}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/** Numbered steps (an ordered list of cards): 1 column on phones, 3 from 640 px. */
export function Steps({ title, items, size }: { title: string; items: Item[]; size?: Size }) {
  return (
    <Section title={title} size={size}>
      <ol className={cx(styles.list, styles.three)}>
        {items.map((s, i) => (
          <li key={s.title} className={styles.card}>
            <span className={styles.number} aria-hidden="true">
              {i + 1}
            </span>
            <h3 className={styles.cardTitle}>{s.title}</h3>
            <p className={styles.cardText}>{s.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/** Features as cards: 1, 2 or 3 per row by width. */
export function FeatureGrid({ title, items, size }: { title: string; items: Item[]; size?: Size }) {
  return (
    <Section title={title} size={size}>
      <ul className={cx(styles.list, styles.grid)}>
        {items.map((f) => (
          <li key={f.title} className={styles.card}>
            <h3 className={styles.cardTitle}>{f.title}</h3>
            <p className={styles.cardText}>{f.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** A row of names (partners, sources, integrations) as outlined chips. */
export function ChipList({ title, items, size }: { title: string; items: string[]; size?: Size }) {
  return (
    <Section title={title} size={size}>
      <ul className={styles.chips}>
        {items.map((c) => (
          <li key={c} className={styles.chip}>
            {c}
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** The closing ask: a tinted panel with a heading, one line and the actions. */
export function CallToAction({
  title,
  text,
  actions,
  size,
}: {
  title: string;
  text?: ReactNode;
  actions: ReactNode;
  size?: Size;
}) {
  return (
    <Section size={size} label={title}>
      <div className={styles.cta}>
        <h2 className={styles.heading}>{title}</h2>
        {text && <p className={styles.lead}>{text}</p>}
        <div className={styles.actions}>{actions}</div>
      </div>
    </Section>
  );
}
