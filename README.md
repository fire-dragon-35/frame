# Frame

A small, design-independent foundation for React + TypeScript web apps: six layout primitives, optional themeable UI, semantic tokens, a Supabase + Fastify fullstack template, and rules that keep AI coding agents on the rails.

- `@frame/core` — headless layout primitives (AppShell, Page, Container, Grid, Stack, Panel)
- `@frame/themes` — theme schema, presets, dark mode, density, CSS variables
- `@frame/ui` — optional accessible controls (Button, Field/Input, Select, Checkbox, Dialog, Tabs, Table)
- `templates/fullstack` — React/Vite + Fastify + Supabase starter with auth, RLS example, shared Zod schemas
- `apps/playground` — one composition rendered with different themes

Architecture and decisions: [FRAME.md](FRAME.md). Agent rules: [AGENTS.md](AGENTS.md).

## Requirements

Node 20+ and pnpm 10 (`corepack enable`). Docker + Supabase CLI for local backend development.

## Develop

```bash
pnpm install
pnpm --filter @frame/playground dev     # playground
pnpm test                               # Vitest
pnpm test:e2e                           # Playwright (run `pnpm exec playwright install` once)
pnpm check                              # typecheck + lint + format + tests + build
```

## Use

```tsx
import '@frame/core/styles.css';
import { AppShell, Container, Page, Grid, Panel } from '@frame/core';
import { ThemeProvider, defaultTheme } from '@frame/themes';

<ThemeProvider theme={defaultTheme}>
  <AppShell>
    <Container>
      <Page>
        <Page.Header>
          <h1>Overview</h1>
        </Page.Header>
        <Page.Content>
          <Grid>
            <Grid.Item span={{ base: 12, md: 6, lg: 8 }}>
              <Panel>Main</Panel>
            </Grid.Item>
            <Grid.Item span={{ base: 12, md: 6, lg: 4 }}>
              <Panel>Side</Panel>
            </Grid.Item>
          </Grid>
        </Page.Content>
      </Page>
    </Container>
  </AppShell>
</ThemeProvider>;
```

Fullstack template: see [templates/fullstack/README.md](templates/fullstack/README.md).

## Status

v0.1 Foundation (phases 1–5 of the plan, partially). Not yet implemented: reusable compositions (Phase 6), three validation apps (Phase 7), `create-frame-app` generator (Phase 8). See [CHANGELOG.md](CHANGELOG.md).
