import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { Playground } from './Playground';

it('renders one composition and applies theme variables', () => {
  render(<Playground />);
  expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument();
  expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#2563eb');
});
