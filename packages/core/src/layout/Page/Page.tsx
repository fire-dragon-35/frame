import type { HTMLAttributes } from 'react';
import styles from './Page.module.css';

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(' ');

function PageRoot({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.page, className)} {...rest} />;
}
function PageHeader({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return <header className={cx(styles.header, className)} {...rest} />;
}
function PageContent({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.content, className)} {...rest} />;
}

/** Page-level structure: a header region and a content region in a vertical flow. */
export const Page = Object.assign(PageRoot, { Header: PageHeader, Content: PageContent });
