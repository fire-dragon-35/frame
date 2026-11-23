# ADR 0001: Headless core + optional themeable UI

**Status:** Accepted

## Decision

Layout lives in @frame/core (structural CSS only, visually neutral). Controls live in optional @frame/ui. Visual identity lives in @frame/themes.

## Consequences

Apps can use core alone or with their own UI. Core must never import ui or themes (ESLint-enforced).
