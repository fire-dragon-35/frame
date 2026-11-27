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

## Rhythm

`Section` (and every block built on it) has half of `--space-section` above and below, so any two blocks are one
`--space-section` apart (3 rem, 4 rem from 768 px). `Hero` has a full one above. Compose a landing page as
`<Hero />` followed by blocks, with no wrapper and no gaps of your own. `Section` takes `title` (a `Heading level={2}`)
and an optional `lead`.

## MediaCard

`<MediaCard title="Stockholm" image="/cities/stockholm.webp" href="#/karta" />`: a photo that covers the card, the
title on a dark fade at the bottom. Without `href` it is not a link; `note` adds a small label above the title
(`Kommer snart`). `ratio`: `wide` 5:2 (default) or `landscape` 3:2. Put several in a `Grid`.

## Pricing

`<Pricing lead price="299" unit="kr/mån" note action={<ButtonLink …/>} features={[{ title, text }]} />`: one plan in a
`Panel`, lead, price, small print and action on the left (5 of 12 columns), the features as a `CheckList` on the right;
stacked on phones. Put it in a `Section` that carries the plan's name as its title.

## Footer alignment

`align="center"` centres the brand and tagline above the link columns, which sit side by side, and the legal line.

## Centred layout

`Hero`, `Section` and `Page.Header` take `align="center"`: title, lead and actions are centred; a Hero's points stay a
left-aligned list, centred as a block; a Section's content keeps its own layout. For a centred page use the same
`size` on every block (usually `narrow`) so all edges line up.

## Footer tone

`tone="dark"`: a dark band, the foreground colour as background; titles and the brand in the background colour,
links, tagline and legal line at 65 %. The brand element should inherit its colour (`color: inherit`).

## Navbar menu

Under 768 px links and actions fold into a menu button. The open menu closes on a tap anywhere outside it, on Escape,
after a link or action in it is chosen, and on a hash change.

## Sign-in with Google, and back to the same page

`<SignInForm google labels={…} />` adds a "Continue with Google" button above the email field (enable the Google
provider in Supabase first). Both ways remember the page (`location.hash`) the sign-in started on and return there
after the redirect, also when the email link opens a new tab. `useAuth().signInWithGoogle(redirectTo?)` does the same
without the form. After Stripe Checkout the user comes back to `returnPath` with `?checkout=success` in the query.
