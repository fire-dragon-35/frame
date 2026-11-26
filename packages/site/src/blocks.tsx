import { Container, Grid, Panel, type ContainerProps } from '@frame/core';
import { CheckList, Heading, type CheckItem } from '@frame/ui';
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
  /** One line under the title. */
  lead?: ReactNode;
  /** Accessible name when there is no title. */
  label?: string;
  /** `muted` = a full width tinted band with borders. */
  tone?: 'default' | 'muted';
  size?: Size;
  id?: string;
  children: ReactNode;
}

/**
 * One landing page section. Owns the vertical rhythm (half of `--space-section` above and below, so any two sections
 * are one `--space-section` apart), the heading and the container. Every block below is a Section.
 */
export function Section({
  title,
  lead,
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
        {(title || lead) && (
          <div className={styles.sectionHead}>
            {title && <Heading level={2}>{title}</Heading>}
            {lead && <p className={styles.lead}>{lead}</p>}
          </div>
        )}
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
  /** Benefits under the title, as a large `CheckList`. */
  points?: CheckItem[];
  size?: Size;
}

/** The top of a landing page: the one h1, a lead, benefit points and the main actions. */
export function Hero({ eyebrow, title, lead, actions, points, size = 'wide' }: HeroProps) {
  return (
    <section className={styles.hero}>
      <Container size={size}>
        <div className={styles.heroText}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <Heading level="display">{title}</Heading>
          {lead && <div className={styles.lead}>{lead}</div>}
          {points && <CheckList size="lg" items={points} />}
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
            <Heading level={3}>{s.title}</Heading>
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
            <Heading level={3}>{f.title}</Heading>
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
        <Heading level={2}>{title}</Heading>
        {text && <p className={styles.lead}>{text}</p>}
        <div className={styles.actions}>{actions}</div>
      </div>
    </Section>
  );
}

export interface MediaCardProps {
  title: string;
  /** Image URL; it covers the card. */
  image: string;
  /** Leave out for a card that is not a link yet (then `note` usually says why). */
  href?: string;
  /** A small label above the title, such as "Coming soon". */
  note?: string;
  /** `wide` 5:2 (default) or `landscape` 3:2. */
  ratio?: 'wide' | 'landscape';
}

/** A photo card with its title on a dark fade at the bottom, a link when `href` is given. */
export function MediaCard({ title, image, href, note, ratio = 'wide' }: MediaCardProps) {
  const body = (
    <>
      <img className={styles.mediaImage} src={image} alt="" loading="lazy" />
      <span className={styles.mediaText}>
        {note && <span className={styles.mediaNote}>{note}</span>}
        <span className={styles.mediaTitle}>{title}</span>
      </span>
    </>
  );
  const cls = cx(styles.media, styles[ratio]);
  return href ? (
    <a className={cls} href={href}>
      {body}
    </a>
  ) : (
    <div className={cls} aria-disabled="true">
      {body}
    </div>
  );
}

export interface PricingProps {
  /** One or two sentences: what the plan is for. */
  lead?: ReactNode;
  /** The amount as shown, e.g. "299". */
  price: string;
  /** After the amount, e.g. "kr/mån". */
  unit: string;
  /** Small print under the price (tax, cancellation). */
  note?: ReactNode;
  /** The buy button, usually a `ButtonLink` or a checkout button. */
  action: ReactNode;
  features: CheckItem[];
}

/** One plan in a panel: lead, price and action on the left, what it includes on the right (stacked on phones). */
export function Pricing({ lead, price, unit, note, action, features }: PricingProps) {
  return (
    <Panel>
      <Grid>
        <Grid.Item span={{ base: 12, md: 5 }}>
          <div className={styles.plan}>
            {lead && <p className={styles.lead}>{lead}</p>}
            <div>
              <p className={styles.price}>
                <span className={styles.amount}>{price}</span> {unit}
              </p>
              {note && <p className={styles.note}>{note}</p>}
            </div>
            <div className={styles.actions}>{action}</div>
          </div>
        </Grid.Item>
        <Grid.Item span={{ base: 12, md: 7 }}>
          <CheckList items={features} />
        </Grid.Item>
      </Grid>
    </Panel>
  );
}
