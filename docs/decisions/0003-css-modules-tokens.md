# ADR 0003: CSS Modules + semantic CSS variables

**Status:** Accepted

## Decision

Styling uses CSS Modules and semantic tokens. Breakpoints are plain media queries (custom properties cannot be used in them). Responsive props are passed to CSS as custom properties.

## Consequences

No utility classes, no inline styles except sanctioned CSS-variable passing in Grid/Stack. Native elements (select, dialog) are preferred over reimplemented interaction patterns.
