import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button, Checkbox, Field, Input, Tabs, Table } from './index';

describe('@frame/ui', () => {
  it('Button defaults to type=button and fires onClick', () => {
    const fn = vi.fn();
    render(<Button onClick={fn}>Go</Button>);
    const b = screen.getByRole('button', { name: 'Go' });
    expect(b).toHaveAttribute('type', 'button');
    fireEvent.click(b);
    expect(fn).toHaveBeenCalledOnce();
  });
  it('Field links label and error to the input', () => {
    render(
      <Field label="Email" error="Required">
        {(p) => <Input {...p} />}
      </Field>,
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Error: Required');
  });
  it('Checkbox is labelled', () => {
    render(<Checkbox label="Agree" />);
    expect(screen.getByLabelText('Agree')).toBeInTheDocument();
  });
  it('Tabs supports arrow-key navigation', () => {
    render(
      <Tabs
        aria-label="x"
        items={[
          { id: 'a', label: 'A', content: 'one' },
          { id: 'b', label: 'B', content: 'two' },
        ]}
      />,
    );
    const a = screen.getByRole('tab', { name: 'A' });
    fireEvent.keyDown(a, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('two')).toBeVisible();
  });
  it('Table renders headers and rows', () => {
    render(
      <Table
        caption="Users"
        rowKey={(r) => r.n}
        columns={[{ key: 'n', header: 'Name', cell: (r: { n: string }) => r.n }]}
        rows={[{ n: 'Ada' }]}
      />,
    );
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Ada' })).toBeInTheDocument();
  });
});
