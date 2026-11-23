import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { NotesView } from './NotesView';

it('validates and submits a note', async () => {
  const onCreate = vi.fn();
  render(<NotesView notes={[]} onCreate={onCreate} />);
  fireEvent.click(screen.getByRole('button', { name: 'Add note' }));
  expect(await screen.findByText('Error: Title is required')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Hello' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add note' }));
  await waitFor(() => expect(onCreate).toHaveBeenCalledWith('Hello'));
});
