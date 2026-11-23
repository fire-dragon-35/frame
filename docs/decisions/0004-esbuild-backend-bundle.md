# ADR 0004: Backend is bundled with esbuild

**Status:** Accepted

## Decision

The template backend is bundled with esbuild (workspace TS packages inlined; npm deps external); dev uses tsx.

## Consequences

Avoids NodeNext import-extension friction with shared TypeScript source. Minor deviation from plain tsc build; no architecture change.
