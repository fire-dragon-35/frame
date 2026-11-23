export type ComponentStatus = 'approved' | 'experimental' | 'deprecated';
export interface ComponentEntry {
  name: string;
  category: 'layout' | 'ui' | 'composition';
  package: '@frame/core' | '@frame/ui';
  responsibility: string;
  status: ComponentStatus;
  docs: string;
}

/** Lightweight metadata registry. Human- and agent-readable; see docs/components/. */
export const registry: ComponentEntry[] = [
  {
    name: 'AppShell',
    category: 'layout',
    package: '@frame/core',
    responsibility: 'Application frame, navigation and sidebar regions',
    status: 'approved',
    docs: 'docs/components/layout.md',
  },
  {
    name: 'Page',
    category: 'layout',
    package: '@frame/core',
    responsibility: 'Page header/content structure and vertical flow',
    status: 'approved',
    docs: 'docs/components/layout.md',
  },
  {
    name: 'Container',
    category: 'layout',
    package: '@frame/core',
    responsibility: 'Max width, centering, gutters',
    status: 'approved',
    docs: 'docs/components/layout.md',
  },
  {
    name: 'Grid',
    category: 'layout',
    package: '@frame/core',
    responsibility: '12-column responsive item placement',
    status: 'approved',
    docs: 'docs/components/layout.md',
  },
  {
    name: 'Stack',
    category: 'layout',
    package: '@frame/core',
    responsibility: 'One-dimensional alignment, gap, wrapping',
    status: 'approved',
    docs: 'docs/components/layout.md',
  },
  {
    name: 'Panel',
    category: 'layout',
    package: '@frame/core',
    responsibility: 'Bounded content grouping with padding',
    status: 'approved',
    docs: 'docs/components/layout.md',
  },
];
