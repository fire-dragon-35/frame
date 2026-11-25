# Site blocks (`@frame/site`)

Page-level building blocks for a product site: the bar at the top, the footer, and landing page sections. They take
data and slots, never content of their own; texts, links and actions come from the app. Styling is theme tokens only.

```tsx
import { AppShell } from '@frame/core';
import { ButtonLink } from '@frame/ui';
import {
  Navbar,
  Footer,
  Hero,
  Stats,
  Steps,
  FeatureGrid,
  ChipList,
  CallToAction,
} from '@frame/site';

<AppShell>
  <Navbar
    brand={<Logo />}
    brandLabel="Acme, home"
    links={[{ label: 'Map', href: '#/map', current: true }]}
    actions={
      <>
        <ButtonLink variant="ghost" href="#/login">
          Log in
        </ButtonLink>
        <ButtonLink href="#/signup">Sign up</ButtonLink>
      </>
    }
  />
  <main>
    <Hero
      eyebrow="For renters"
      title="Find the flat that fits"
      lead="Every listing on one map."
      actions={<ButtonLink href="#/map">Open the map</ButtonLink>}
    />
    <Stats items={[{ value: '1 200+', label: 'listings' }]} />
    <Steps title="How it works" items={[{ title: 'Filter', text: '…' }]} />
    <FeatureGrid title="What you get" items={[{ title: 'Travel time', text: '…' }]} />
    <ChipList title="Sources" items={['Qasa', 'HomeQ']} />
    <CallToAction title="Ready?" actions={<ButtonLink href="#/map">Open the map</ButtonLink>} />
  </main>
  <Footer
    brand={<Logo />}
    tagline="…"
    columns={[{ title: 'Help', links: [{ label: 'Contact', href: '#/contact' }] }]}
    legal="© 2026 Acme"
  />
</AppShell>;
```

| Block          | Props                                                                                              | Notes                                                                                               |
| -------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `Navbar`       | `brand`, `brandLabel`, `brandHref` (`/`), `links` (`{ label, href, current? }`), `actions`, `size` | Scrolls with the page. Under 768 px links and actions fold into a `<details>` menu (no JavaScript). |
| `Footer`       | `brand`, `tagline`, `columns` (`{ title, links }`), `legal`, `size`                                | Columns stack on phones.                                                                            |
| `Hero`         | `eyebrow`, `title` (the page's only h1), `lead`, `actions`, `size` (`wide`)                        | Eyebrow uses `--color-primary`.                                                                     |
| `Stats`        | `items` (`{ value, label }`), `label`                                                              | Tinted band, 2 then 4 per row.                                                                      |
| `Steps`        | `title`, `items` (`{ title, text }`)                                                               | Numbered cards, 1 then 3 per row.                                                                   |
| `FeatureGrid`  | `title`, `items` (`{ title, text }`)                                                               | Cards, 1, 2 then 3 per row.                                                                         |
| `ChipList`     | `title`, `items` (strings)                                                                         | Outlined names.                                                                                     |
| `CallToAction` | `title`, `text`, `actions`                                                                         | Tinted closing panel.                                                                               |
| `Section`      | `title` or `label`, `tone` (`default` / `muted`), `size`, `children`                               | For a section none of the above fits.                                                               |

Actions are `ButtonLink` from `@frame/ui` (a link styled as `Button`: `primary`, `secondary`, `ghost`).
`size` is the `Container` size; use the same value for navbar, page and footer so their edges line up.
