import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ButtonLink } from '@frame/ui';
import { CallToAction, FeatureGrid, Footer, Hero, MediaCard, Navbar, Stats, Steps } from './index';

describe('@frame/site', () => {
  it('Navbar marks the current page and names the home link', () => {
    render(
      <Navbar
        brand="Acme"
        brandLabel="Acme, home"
        links={[
          { label: 'Map', href: '/map', current: true },
          { label: 'About', href: '/about' },
        ]}
        actions={<ButtonLink href="/signup">Sign up</ButtonLink>}
      />,
    );
    expect(screen.getByRole('link', { name: 'Acme, home' })).toHaveAttribute('href', '/');
    expect(screen.getAllByRole('link', { name: 'Map' })[0]).toHaveAttribute('aria-current', 'page');
    expect(screen.getAllByRole('link', { name: 'About' })[0]).not.toHaveAttribute('aria-current');
  });
  it('Footer renders named link columns', () => {
    render(
      <Footer
        brand="Acme"
        columns={[{ title: 'Help', links: [{ label: 'Contact', href: '/contact' }] }]}
        legal="© Acme"
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Help' })).toContainElement(
      screen.getByRole('link', { name: 'Contact' }),
    );
  });
  it('landing blocks give one h1 and h2 per section', () => {
    render(
      <>
        <Hero title="Find it" actions={<ButtonLink href="/go">Go</ButtonLink>} />
        <Stats items={[{ value: '4', label: 'sources' }]} />
        <Steps title="How" items={[{ title: 'One', text: 'a' }]} />
        <FeatureGrid title="What" items={[{ title: 'F', text: 'b' }]} />
        <CallToAction title="Ready?" actions={<ButtonLink href="/go">Go</ButtonLink>} />
      </>,
    );
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'How',
      'What',
      'Ready?',
    ]);
    expect(screen.getAllByRole('link', { name: 'Go' })).toHaveLength(2);
  });
  it('MediaCard is a link only with href', () => {
    render(
      <>
        <MediaCard title="Open" image="/a.webp" href="/go" />
        <MediaCard title="Soon" image="/b.webp" note="Coming soon" />
      </>,
    );
    expect(screen.getByRole('link').textContent).toContain('Open');
    expect(screen.getByText('Coming soon')).toBeTruthy();
  });
});
