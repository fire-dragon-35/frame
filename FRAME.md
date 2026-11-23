# FRAME — Architecture and Decisions

> Authoritative architecture for Frame. Read before making architectural changes. Change confirmed decisions only via an ADR in `docs/decisions/` and explicit approval.

**Initial release:** v0.1 Foundation

---

# 1. PROJECT VISION

Frame is a reusable frontend and fullstack development foundation designed to make building web applications predictable, consistent, maintainable, and efficient.

The primary problem Frame solves is frontend architecture becoming unstructured over time.

When building multiple web applications, frontend code can accumulate:

- Inconsistent layouts.
- Duplicated components.
- Arbitrary CSS.
- One-off responsive fixes.
- Excessive wrappers and abstractions.
- Components with unclear responsibilities.
- AI-generated code that improvises layouts and styling.
- Increasing complexity from quick fixes rather than addressing underlying problems.

Frame must prevent these problems through a deliberately designed composition system, reusable components, explicit architectural rules, and AI development instructions.

The goal is not to build another enormous UI framework.

The goal is to create a small, powerful, design-independent foundation that makes good frontend architecture the default.

Frame must support arbitrary types of web applications, including SaaS platforms, dashboards, administration systems, content platforms, internal tools, and other fullstack applications.

## Governing principle

Build applications by composing known, approved building blocks.

Improve the building blocks when a genuine recurring need appears.

Never solve structural problems by accumulating local patches, arbitrary CSS, or unnecessary abstractions.

---

# 2. CONFIRMED TECHNOLOGY STACK

Use the following stack as the default foundation.

## Frontend

- React
- TypeScript
- Vite
- CSS Modules
- CSS custom properties for semantic design tokens
- CSS Grid for two-dimensional layouts
- Flexbox for one-dimensional layouts

## Backend

- Node.js
- Fastify
- TypeScript

## Backend platform and database

Supabase must be a first-class part of Frame.

Use:

- Supabase PostgreSQL
- Supabase Auth
- Supabase Row Level Security (RLS)
- Supabase Storage
- Supabase Realtime
- Supabase Edge Functions when appropriate
- Supabase CLI
- SQL-based Supabase migrations

Supabase is not simply a database host. It is the primary backend platform for authentication, database, authorization, storage, and realtime functionality.

## Database architecture

- PostgreSQL is the database.
- Supabase SQL migrations are the authoritative source of database schema changes.
- Generate TypeScript database types from the Supabase schema.
- Do not introduce a second competing schema or migration system.
- Drizzle ORM is NOT the default migration/schema owner.
- Use the Supabase JavaScript client where appropriate.
- Use direct PostgreSQL access only for justified server-side use cases.

## Fastify responsibilities

Fastify handles functionality that requires a custom backend:

- Complex business workflows.
- Third-party integrations.
- Webhooks.
- Server-side operations.
- Custom API endpoints.
- Privileged operations.
- Workflows that should not execute in the browser.

Do not duplicate functionality that Supabase already provides without a clear reason.

## Validation

- Zod for runtime validation.
- Shared validation schemas where appropriate.
- Validate external inputs at system boundaries.

## Package manager

- pnpm
- pnpm workspaces
- Use a consistent pnpm version.
- Commit the lockfile.

## Testing

- Vitest for unit and integration tests.
- Playwright for browser and responsive tests.
- Accessibility testing integrated into the development process.

## Development tooling

- TypeScript strict mode.
- ESLint.
- Prettier.
- GitHub Actions for CI.
- Supabase CLI for local backend development.

Use stable, compatible package versions at implementation time. Do not blindly use outdated version numbers from this specification.

---

# 3. FRAME ARCHITECTURE

Frame consists of three primary packages and an application layer.

## Package architecture

### @frame/core

The headless structural foundation.

Owns:

- Layout primitives.
- Structural CSS.
- Composition APIs.
- Responsive layout behavior.
- Shared layout contracts.

Must not own:

- Brand-specific styling.
- Business logic.
- Application-specific features.
- Mandatory visual design decisions.

Important: Headless does not mean CSS-free. Core components require structural CSS to implement layout, positioning, spacing, and responsive behavior. They must remain visually neutral.

### @frame/ui

An optional, themeable UI component library.

Owns:

- Buttons.
- Inputs.
- Form controls.
- Dialogs.
- Tabs.
- Navigation components.
- Tables.
- Feedback components.
- Accessible interaction behavior.

Applications must be able to use Frame Core without adopting Frame UI.

Applications may also use their own UI library or custom components.

### @frame/themes

Theme configuration and semantic design tokens.

Owns:

- Theme schema.
- Predefined themes.
- Custom theme configurations.
- Semantic CSS variables.
- Theme application.
- Dark mode support.
- Density configuration.

Themes must be independent of layout structure and business logic.

### Application layer

Owns:

- Routes.
- Features.
- Business logic.
- Data fetching.
- Product-specific components.
- Application-specific pages.
- Application configuration.

Frame must never contain application-specific business logic.

---

# 4. CORE LAYOUT SYSTEM

Frame starts with six approved layout primitives.

Do not expand this list without a genuine recurring use case.

## 4.1 AppShell

Responsibility:

- Overall application frame.
- Navigation regions.
- Sidebar positioning.
- Desktop/mobile navigation transitions.
- Main application content region.

Example:

<AppShell navigation={<Navigation />} sidebar={<Sidebar />}>
<Page>...</Page>
</AppShell>

The shell owns navigation presentation and responsive shell behavior, not individual page business logic.

## 4.2 Page

Responsibility:

- Page-level structure.
- Header and content regions.
- Vertical page flow.
- Consistent page spacing.

Proposed composition:

<Page>
  <Page.Header>
    <PageTitle title="Overview" />
  </Page.Header>
  <Page.Content>
    ...
  </Page.Content>
</Page>

Use explicit semantic regions where useful. Do not create compound APIs unnecessarily.

## 4.3 Container

Responsibility:

- Maximum content width.
- Centering.
- Horizontal gutters.
- Content boundaries.

It must not own child positioning or visual styling.

## 4.4 Grid

Responsibility:

- Two-dimensional layout.
- Column tracks.
- Gaps.
- Responsive item placement.

Use a 12-column logical CSS Grid at every viewport size.

Example:

<Grid>
  <Grid.Item span={{ base: 12, md: 6, lg: 8 }}>
    <Panel>Main content</Panel>
  </Grid.Item>
  <Grid.Item span={{ base: 12, md: 6, lg: 4 }}>
    <Panel>Supporting content</Panel>
  </Grid.Item>
</Grid>

Rules:

- Desktop supports spans from 1 to 12.
- Tablet can use adjusted spans.
- Mobile defaults to full-width items (span 12).
- Grid owns actual item placement.
- Grid.Item declares its intended span.
- Nested grids are allowed when justified.
- Avoid competing layout CSS on grid children.

## 4.5 Stack

Responsibility:

- One-dimensional layout.
- Vertical or horizontal direction.
- Alignment.
- Gap.
- Wrapping.

Implement using Flexbox.

## 4.6 Panel

Responsibility:

- Content grouping.
- Internal padding.
- A bounded structural content region.

It must not become a generic substitute for every div or a page-wide layout system.

---

# 5. RESPONSIVE DESIGN

Responsive behavior is mandatory.

Initial breakpoint scale:

- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

These are initial defaults and can be adjusted based on actual interface requirements.

Implement breakpoints in CSS media queries.

TypeScript should describe supported breakpoint names for responsive component props.

Do not rely on CSS custom properties as media-query breakpoint values.

Expected behavior:

- AppShell: persistent sidebar on desktop where configured; drawer or compact navigation on mobile.
- Container: constrained and centered on desktop; full-width with gutters on mobile.
- Grid: responsive columns on desktop/tablet; typically one-column flow on mobile.
- Stack: may change direction at responsive breakpoints when needed.
- Panel: responsive padding.
- Forms: generally one column on mobile.
- Dialogs: adapt to viewport size.
- Tables: use appropriate scrolling or alternative compact presentations depending on the use case.

Do not simply shrink desktop layouts.

Adapt compositions while preserving their purpose and functionality.

---

# 6. VISUAL ARCHITECTURE

Confirmed decision:

HEADLESS CORE + OPTIONAL THEMEABLE UI LIBRARY.

The core is design-neutral.

The UI library provides reusable, accessible controls with a baseline appearance.

The theme package provides predefined and custom visual configurations.

The same core composition must work with different themes or with an entirely custom UI implementation.

Do not make Frame's core dependent on one design style.

---

# 7. THEMING SYSTEM

Support both:

1. Predefined theme presets.
2. Custom theme configurations.

Potential initial presets:

- default
- minimal
- corporate
- editorial

These are examples. Implement only the presets needed for initial validation.

## Token architecture

Use three conceptual levels:

1. Primitive tokens: raw colors, spacing values, typography scales, radii.
2. Semantic tokens: background, foreground, surface, primary, border, etc.
3. Component consumption: components consume semantic tokens.

Example:

:root {
--color-background: #ffffff;
--color-foreground: #171717;
--color-surface: #ffffff;
--color-surface-secondary: #f5f5f5;
--color-border: #e5e5e5;
--color-primary: #2563eb;
--color-primary-foreground: #ffffff;

--font-body: Inter, sans-serif;
--font-heading: Inter, sans-serif;

--radius-control: 0.5rem;
--radius-panel: 0.75rem;

--space-panel: 1.25rem;
--control-height: 2.5rem;

--focus-ring: 0 0 0 3px rgb(37 99 235 / 25%);
}

Values are illustrative defaults, not mandatory brand colors.

Theme schema should eventually include:

- Colors.
- Typography.
- Spacing.
- Radius.
- Shadows.
- Density.
- Control heights.
- Focus styles.
- Interaction states.
- Dark mode variants.

Theme configuration must not alter component hierarchy or business behavior.

Density can affect explicitly defined dimensions and spacing.

All themes must preserve accessibility, including visible focus indicators and appropriate contrast.

Provide sensible baseline styling when @frame/themes is not installed.

---

# 8. UI LIBRARY

The UI library is optional.

Potential component inventory:

Actions:

- Button
- IconButton
- Link

Forms:

- Input
- Textarea
- Select
- Checkbox
- RadioGroup
- Switch

Feedback:

- Alert
- Badge
- Spinner
- Progress

Overlays:

- Dialog
- Popover
- Tooltip
- DropdownMenu

Navigation:

- Tabs
- Breadcrumbs
- Pagination

Data:

- Table
- DataTable, only if a genuine reusable distinction is needed.

States:

- EmptyState
- Skeleton
- ErrorState

Do not build all components immediately.

Start with:

- Button
- Input
- Select
- Checkbox
- Dialog
- Tabs
- Table

Use semantic HTML and established accessibility primitives where appropriate.

Do not reinvent complex keyboard interaction patterns unnecessarily.

---

# 9. COMPOSITION HIERARCHY

The conceptual hierarchy is:

Application
-> Pages
-> Page compositions
-> Layout primitives
-> UI components and semantic elements

Component categories:

Foundations:

- Tokens.
- Breakpoints.
- Theme schema.

Layout:

- AppShell.
- Page.
- Container.
- Grid.
- Stack.
- Panel.

UI:

- Button.
- Input.
- Dialog.
- Table.

Compositions:

- PageTitle.
- FilterBar.
- EmptyState.
- DataView.

Features:

- Product-specific components and business logic.

Pages:

- Assemble features into routes.

Do not mix these responsibilities unnecessarily.

Strict hierarchy is enforced through:

- TypeScript contracts.
- Explicit slot APIs where useful.
- ESLint architectural rules.
- Documentation.
- Automated tests.
- Runtime development warnings only where useful.

Do not claim TypeScript can enforce every possible JSX parent-child relationship.

---

# 10. CSS AND STYLING RULES

Use:

- CSS Modules.
- Semantic CSS variables.
- CSS Grid.
- Flexbox.
- Media queries.
- A small global stylesheet.

Avoid:

- Arbitrary page-level layout CSS.
- Global style leakage.
- Large override systems.
- Utility-class sprawl.
- Brand colors hardcoded in core.
- Unnecessary one-off spacing values.
- Reaching into another component's private CSS classes.
- Making every component a generic layout component.

Responsibility ownership:

- Grid owns column placement.
- Stack owns linear alignment and spacing.
- Container owns maximum content width.
- Panel owns panel padding.
- Button owns button behavior.
- Themes own brand colors.
- Features own business workflows.
- Application owns route composition.

Component styles must implement the component's actual responsibility.

---

# 11. REPOSITORY STRUCTURE

Create a pnpm monorepo.

Recommended initial structure:

frame/
|
├── FRAME.md
├── AGENTS.md
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
|
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── tsconfig.base.json
|
├── packages/
| ├── core/
| | └── src/
| | ├── foundations/
| | ├── layout/
| | | ├── AppShell/
| | | ├── Page/
| | | ├── Container/
| | | ├── Grid/
| | | ├── Stack/
| | | └── Panel/
| | ├── registry/
| | └── index.ts
| |
| ├── ui/
| | └── src/
| | ├── actions/
| | ├── forms/
| | ├── feedback/
| | ├── overlays/
| | ├── navigation/
| | ├── data/
| | └── index.ts
| |
| └── themes/
| └── src/
| ├── presets/
| ├── tokens/
| ├── schema/
| ├── provider/
| └── index.ts
|
├── templates/
| └── fullstack/
| ├── frontend/
| ├── backend/
| ├── shared/
| ├── supabase/
| | ├── config.toml
| | ├── migrations/
| | └── seed.sql
| ├── tests/
| ├── .env.example
| ├── package.json
| └── README.md
|
├── apps/
| └── playground/
|
├── examples/
| └── dashboard/
|
├── docs/
| ├── architecture/
| ├── components/
| ├── theming/
| ├── responsive-design/
| ├── ai-rules/
| └── decisions/
|
├── tooling/
| ├── eslint/
| ├── typescript/
| └── scripts/
|
└── .github/
└── workflows/

Adjust the exact directory structure if implementation reveals a simpler arrangement.

Do not create unnecessary files or folders just to fill out the proposed tree.

Each component should have a compact implementation.

Example:

Grid/
Grid.tsx
Grid.module.css
GridItem.tsx
index.ts

Avoid excessive file fragmentation.

---

# 12. FULLSTACK STARTER TEMPLATE

The template must be reusable to generate independent applications.

Frontend:

- React.
- TypeScript.
- Vite.
- Frame Core.
- Optional Frame UI.
- Optional Frame Themes.
- Supabase client.
- Feature-oriented directory structure.

Backend:

- Fastify.
- TypeScript.
- API route registration.
- Validation.
- Error handling.
- Logging.
- Health endpoint.
- Supabase server integration.
- Authentication verification.
- Webhook infrastructure.

Shared:

- Shared types where appropriate.
- Shared Zod schemas where appropriate.
- API contracts.
- Generated Supabase database types.

Supabase:

- Supabase CLI configuration.
- SQL migrations.
- Seed data.
- Database types.
- RLS policies.
- Local development instructions.

Tests:

- Vitest.
- API tests.
- Frontend component tests.
- Playwright browser tests.

The template must include a functional minimal example, not just empty directories.

---

# 13. SUPABASE SECURITY AND ARCHITECTURE

Supabase is the primary backend platform.

Use Supabase Auth for authentication.

Use PostgreSQL RLS for user-data authorization.

Use Supabase Storage for file storage.

Use Realtime where live synchronization is justified.

Use Edge Functions for appropriate lightweight serverless workloads.

Use Fastify for more complex custom backend workflows.

## Security requirements

- Never expose Supabase secret/service-role keys in browser code.
- Never commit real credentials.
- Use environment variables.
- Provide .env.example files.
- Validate all external inputs.
- Enable RLS for tables containing user-accessible data.
- Write explicit RLS policies.
- Do not assume frontend authorization is sufficient.
- Do not bypass RLS casually.
- Keep privileged server-side operations narrowly scoped.
- Verify authenticated users and their authorization on protected backend operations.
- Handle webhook authentication and signature verification.
- Document how local and production credentials differ.

A key design requirement:

Fastify and the browser may interact with the same Supabase database, but must follow a consistent authorization model.

Do not create two competing systems of truth for user identity, permissions, or database schema.

Use the Supabase client with the appropriate user context where RLS should apply.

Only use privileged credentials for operations that explicitly require elevated permissions.

---

# 14. AI GOVERNANCE

AGENTS.md is mandatory.

It must instruct coding agents to:

1. Read FRAME.md before making architectural changes.
2. Inspect existing project structure and components before implementation.
3. Reuse approved components.
4. Follow package boundaries.
5. Avoid arbitrary CSS and local layout patches.
6. Identify root causes before fixing problems.
7. Avoid unnecessary abstractions.
8. Avoid unrelated refactoring.
9. Use semantic theme tokens.
10. Build responsive behavior intentionally.
11. Follow accessibility requirements.
12. Test relevant behavior.
13. Inspect actual UI results when possible.
14. Report changes and compromises.
15. Keep documentation synchronized with architectural changes.

## Component approval

AI may propose new shared components but cannot silently add them to the approved Frame library.

Before proposing a component, AI must explain:

- The problem it solves.
- Its responsibility.
- Its proposed API.
- Its place in the hierarchy.
- Why existing components are insufficient.
- Whether it is reusable.
- Its responsive implications.
- Its accessibility implications.
- Its testing and maintenance impact.

Explicit approval is required before adding new shared primitives, shared UI components, or changing public component contracts.

Ordinary application-specific feature components do not require framework-level approval.

## AI implementation workflow

Inspect -> Plan -> Reuse -> Request approval if needed -> Implement -> Test -> Report.

---

# 15. COMPONENT REGISTRY

Create a lightweight component registry.

Initially it is documentation and metadata, not a complex runtime.

Each component should document:

- Name.
- Category.
- Description.
- Responsibility.
- Package.
- Public props.
- Composition rules.
- Responsive behavior.
- Accessibility notes.
- Usage examples.
- Status: approved, experimental, or deprecated.

Keep the registry easy for humans and AI coding agents to inspect.

Do not build a generic registry engine prematurely.

---

# 16. QUALITY AND PERFORMANCE REQUIREMENTS

Required:

- TypeScript strict mode.
- ESLint.
- Prettier.
- Vitest.
- Playwright.
- Architecture dependency checks.
- Responsive testing.
- Accessibility testing.
- GitHub Actions CI.

Performance rules:

- Prefer native browser features.
- Avoid unnecessary state and effects.
- Avoid premature memoization.
- Avoid unnecessary dependencies.
- Use responsive images.
- Avoid expensive layout measurements.
- Introduce table virtualization only when needed.
- Respect prefers-reduced-motion.
- Monitor bundle size as the framework grows.

Accessibility:

- Semantic HTML.
- Keyboard navigation.
- Visible focus.
- Accessible labels.
- Correct ARIA usage.
- Contrast requirements.
- Reduced motion.
- Correct focus management in overlays.
- Never rely on color alone for status.

---

# 17. IMPLEMENTATION PLAN

Implement incrementally.

Do not attempt to build the entire framework in one pass.

## Phase 1 — Repository foundation

- Initialize Git-ready pnpm monorepo.
- Configure workspaces.
- Configure TypeScript strict mode.
- Configure ESLint and Prettier.
- Add testing infrastructure.
- Establish package boundaries.
- Add GitHub Actions.
- Write FRAME.md.
- Write AGENTS.md.
- Write README.md.
- Write initial architecture decision records.

Deliverable: Clean, working repository foundation.

## Phase 2 — Core layout

Implement:

- AppShell.
- Page.
- Container.
- Grid.
- Stack.
- Panel.

Add:

- Structural CSS.
- Responsive APIs.
- Tests.
- Documentation.
- Examples.

Deliverable: Design-neutral layout system capable of building complete responsive pages.

## Phase 3 — Theme system

Implement:

- Theme schema.
- Semantic CSS variables.
- Default theme.
- One contrasting theme.
- Custom theme configuration.
- Dark mode.
- Theme validation.

Deliverable: Identical compositions can use different visual identities.

## Phase 4 — Essential UI

Implement:

- Button.
- Input.
- Select.
- Checkbox.
- Dialog.
- Tabs.
- Table.

Add accessible behavior and tests.

Deliverable: Useful optional UI library.

## Phase 5 — Fullstack template

Implement:

- React frontend.
- Fastify backend.
- Supabase integration.
- PostgreSQL migrations.
- Authentication example.
- RLS example.
- Shared validation.
- Environment configuration.
- Local development scripts.

Deliverable: Functional starter application.

## Phase 6 — Reusable compositions

Implement initial compositions:

- PageTitle.
- FilterBar.
- EmptyState.
- DataView.

Only add compositions justified by repeated use.

Deliverable: Reusable page-building patterns.

## Phase 7 — Real-world validation

Build at least three different application examples:

1. Data-heavy SaaS dashboard.
2. Form-oriented application.
3. Content-oriented application.

Test:

- Desktop.
- Tablet.
- Mobile.
- Different themes.
- Accessibility.
- Component reusability.
- Performance.

Use the findings to refine Frame.

## Phase 8 — Project launcher and release

Create a project generator with an eventual command such as:

pnpm create frame-app my-project

It should generate an independent fullstack project with:

- Selected template.
- Frame dependencies.
- Frontend.
- Backend.
- Supabase setup.
- Environment example.
- AI instructions.
- Tests.
- Development scripts.

Do not build a complicated generator before the template works reliably.

---

# 18. GIT AND VERSIONING STRATEGY

The Frame repository is the source of truth for reusable framework development.

New applications should inherit Frame through approved packages and the fullstack template, rather than copying the entire Frame development repository.

Use:

- Git.
- Clear commit messages.
- Version tags.
- Changelog.
- Documented breaking changes.
- Stable package APIs after validation.

Keep Frame packages and generated applications independently maintainable.

Do not allow updates to Frame to silently break existing projects.

---

# 19. IMPORTANT NON-GOALS

Frame is NOT:

- A visual website builder.
- A replacement for React.
- A mandatory design system.
- A giant component library.
- A CSS utility framework.
- A framework that imposes one visual identity.
- A place for application-specific business logic.
- An excuse to abstract every repeated line of code.
- An AI system that freely invents shared components.
- A system with two competing database migration owners.

Prioritize clarity, simplicity, performance, and deliberate composition.
