import { Container, Page, Panel, Stack } from '@frame/core';
import { Button, Field, Input } from '@frame/ui';
import { createNoteInput, type Note } from '@frame-app/shared';
import { useState } from 'react';

export interface NotesViewProps {
  notes: Note[];
  onCreate: (title: string) => void | Promise<void>;
}

/** Presentational feature component: data comes from props, so it is trivial to test. */
export function NotesView({ notes, onCreate }: NotesViewProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string>();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = createNoteInput.safeParse({ title });
    if (!parsed.success) return setError('Title is required');
    setError(undefined);
    await onCreate(parsed.data.title);
    setTitle('');
  };
  return (
    <Container>
      <Page>
        <Page.Header>
          <h1>Notes</h1>
        </Page.Header>
        <Page.Content>
          <Panel>
            <form onSubmit={submit}>
              <Stack gap={4}>
                <Field label="Title" error={error}>
                  {(p) => <Input {...p} value={title} onChange={(e) => setTitle(e.target.value)} />}
                </Field>
                <Stack direction="row">
                  <Button type="submit">Add note</Button>
                </Stack>
              </Stack>
            </form>
          </Panel>
          <Panel>
            {notes.length === 0 ? (
              <p>No notes yet.</p>
            ) : (
              <ul>
                {notes.map((n) => (
                  <li key={n.id}>{n.title}</li>
                ))}
              </ul>
            )}
          </Panel>
        </Page.Content>
      </Page>
    </Container>
  );
}
