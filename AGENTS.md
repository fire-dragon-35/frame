# AGENTS.md — rules for AI coding agents

Read `FRAME.md` before any architectural change. These rules are mandatory.

## Workflow

Inspect → Plan → Reuse → Request approval if needed → Implement → Test → Report.

1. Inspect the existing structure, `packages/core/src/registry`, and `docs/components/` before writing code.
2. Reuse approved components. Do not rebuild what exists.
3. Find the root cause before fixing. No local patches for structural problems.
4. Keep changes small. No unrelated refactoring, no speculative abstractions.
5. Test relevant behavior (`pnpm test`); verify responsive/UI results when you can.
6. Report what changed and every compromise. Update docs when architecture changes.

## Package boundaries (enforced by ESLint)

- `@frame/core` imports nothing from `@frame/ui` or `@frame/themes`. No brand styling, no business logic.
- `@frame/themes` imports nothing from core/ui. It owns tokens, presets, schema.
- `@frame/ui` may use core-neutral CSS variables but must not import `@frame/themes`.
- `@frame/site` (page blocks) may import `@frame/core` and `@frame/ui`, never `@frame/themes`. No app content inside it.
- `@frame/supabase` (auth, billing) may import `@frame/core` and `@frame/ui`, never `@frame/themes`. Its `backend/` (migration, Edge Functions) is copied into apps with `frame-supabase sync`; never write auth or Stripe code in an app.
- Business logic lives only in the application layer (`templates/fullstack`, your app), never in packages.

## Layout and styling

- Compose pages from the six primitives: `AppShell`, `Page`, `Container`, `Grid`, `Stack`, `Panel`.
- Grid owns column placement (12 columns); Stack owns linear spacing; Container owns max width; Panel owns padding.
- Do not add layout CSS to grid children, page-level arbitrary CSS, inline styles, utility-class sprawl, or hardcoded colors/spacing.
- Type and rhythm are Frame's: sizes from `Text`/`Heading`, space between landing sections from `Section` (`--space-section`), page title spacing from `Page`. An app never sets font sizes, weights or margins on text; if a page needs one, the missing piece belongs in Frame.
- Use semantic tokens (`--color-*`, `--radius-*`, `--space-*`, `--control-height`, `--focus-ring`). Never reach into another component's CSS classes.
- Breakpoints: sm 640, md 768, lg 1024, xl 1280 in CSS media queries. Design mobile composition intentionally; do not just shrink desktop.

## Which component for what (check here before writing any markup)

| You need                                    | Use                                                                                                         | Reference                    |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------- |
| page frame, header, content                 | `AppShell` › `Container` › `Page` (`Page.Header`, `Page.Content`)                                           | docs/components/layout.md    |
| items in a row or column, gaps, wrapping    | `Stack` (`direction`, `gap`, `align`, `wrap`, `as`)                                                         | layout.md                    |
| columns that change per breakpoint          | `Grid` + `Grid.Item span={{ base, md }}`                                                                    | layout.md                    |
| a bordered box                              | `Panel` (`flush` for edge-to-edge content such as a map or a list)                                          | layout.md                    |
| any text with a size, tone or weight        | `Text`                                                                                                      | docs/components/ui.md        |
| any heading (hero, page, section, card)     | `Heading level="display" \| 1 \| 2 \| 3` (never a raw `<h1>`–`<h6>`)                                        | ui.md                        |
| benefits or features with check marks       | `CheckList` (`size="lg"` in a hero)                                                                         | ui.md                        |
| a status, category, tag or colour from data | `Badge` (`tone="custom"` for data colours)                                                                  | ui.md                        |
| a tappable row in a list, selected state    | `ListItem` inside `Panel flush`                                                                             | ui.md                        |
| a number range filter                       | `Slider`                                                                                                    | ui.md                        |
| on/off                                      | `Checkbox`                                                                                                  | ui.md                        |
| form control with label/error               | `Field` + `Input` / `Select`                                                                                | ui.md                        |
| action                                      | `Button`                                                                                                    | ui.md                        |
| modal                                       | `Dialog`                                                                                                    | ui.md                        |
| a link that looks like a button             | `ButtonLink`                                                                                                | ui.md                        |
| site top bar with links and sign in         | `Navbar` (`@frame/site`)                                                                                    | docs/components/site.md      |
| site footer                                 | `Footer` (`@frame/site`)                                                                                    | site.md                      |
| landing page                                | `Hero` then `Section`s: `Stats`, `Steps`, `FeatureGrid`, `ChipList`, `CallToAction`, `MediaCard`, `Pricing` | site.md                      |
| sign in, signed-in only pages               | `FrameProvider`, `SignInForm`, `RequireAuth`, `useAuth` (`@frame/supabase`)                                 | docs/backend/auth-billing.md |
| paid features, checkout, manage billing     | `Paywall`, `CheckoutButton`, `BillingPortalButton`, `useSubscription`                                       | auth-billing.md              |

If nothing fits, write an app component (CSS Module next to it, tokens only) and say so in your report. A colour that
comes from data goes through `Badge tone="custom"`; never an inline style in app code. Third-party widgets (maps,
charts) are app components; restyle only their content through your own CSS Module.

## Accessibility

Semantic HTML, keyboard operation, visible focus, labelled controls, correct ARIA, sufficient contrast, `prefers-reduced-motion`, never color alone for status, correct focus management in overlays.

## New shared components need approval

Do not add or change shared primitives, shared UI components or public contracts silently. Propose first, covering: problem solved; responsibility; proposed API; place in the hierarchy; why existing components are insufficient; reusability; responsive and accessibility implications; testing/maintenance impact. Wait for explicit approval. App-specific feature components need no approval.

## Backend and data (Supabase)

- Supabase SQL migrations (`templates/fullstack/supabase/migrations`) are the only schema source. No second ORM/migration system.
- Every user-data table: RLS enabled plus explicit policies. Frontend checks are never sufficient authorization.
- Never expose the service-role key in browser code; never commit credentials; update `.env.example`.
- Fastify queries as the verified user (RLS applies). Privileged operations: narrow, justified, documented.
- Validate all external input with Zod at system boundaries; verify webhook signatures.

## Before you finish

`pnpm check` must pass (typecheck, lint, format, tests, build).
