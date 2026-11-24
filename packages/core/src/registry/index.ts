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
  {
    name: 'Button',
    category: 'ui',
    package: '@frame/ui',
    responsibility: 'Actions: submit, confirm, navigate',
    status: 'approved',
    docs: 'docs/components/ui.md',
  },
  {
    name: 'Field',
    category: 'ui',
    package: '@frame/ui',
    responsibility: 'Label, hint and error around one control',
    status: 'approved',
    docs: 'docs/components/ui.md',
  },
  {
    name: 'Input',
    category: 'ui',
    package: '@frame/ui',
    responsibility: 'Text input',
    status: 'approved',
    docs: 'docs/components/ui.md',
  },
  {
    name: 'Select',
    category: 'ui',
    package: '@frame/ui',
    responsibility: 'Native select',
    status: 'approved',
    docs: 'docs/components/ui.md',
  },
  {
    name: 'Checkbox',
    category: 'ui',
    package: '@frame/ui',
    responsibility: 'Labelled checkbox',
    status: 'approved',
    docs: 'docs/components/ui.md',
  },
  {
    name: 'Slider',
    category: 'ui',
    package: '@frame/ui',
    responsibility: 'Labelled range input that shows its value',
    status: 'approved',
    docs: 'docs/components/ui.md',
  },
  {
    name: 'Dialog',
    category: 'ui',
    package: '@frame/ui',
    responsibility: 'Modal dialog with focus management',
    status: 'approved',
    docs: 'docs/components/ui.md',
  },
  {
    name: 'Tabs',
    category: 'ui',
    package: '@frame/ui',
    responsibility: 'Tabbed panels with arrow-key navigation',
    status: 'approved',
    docs: 'docs/components/ui.md',
  },
  {
    name: 'Table',
    category: 'ui',
    package: '@frame/ui',
    responsibility: 'Data table with caption and headers',
    status: 'approved',
    docs: 'docs/components/ui.md',
  },
  {
    name: 'ListItem',
    category: 'ui',
    package: '@frame/ui',
    responsibility: 'Full-width tappable row; selected and highlighted states',
    status: 'approved',
    docs: 'docs/components/ui.md',
  },
  {
    name: 'Badge',
    category: 'ui',
    package: '@frame/ui',
    responsibility: 'Short label or colour mark (status, category, tag)',
    status: 'approved',
    docs: 'docs/components/ui.md',
  },
  {
    name: 'Text',
    category: 'ui',
    package: '@frame/ui',
    responsibility: 'Type scale: size, tone, weight, nowrap',
    status: 'approved',
    docs: 'docs/components/ui.md',
  },
];
