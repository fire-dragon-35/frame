import { AppShell } from '@frame/core';
import { defaultTheme, ThemeProvider } from '@frame/themes';
import { Button, Field, Input } from '@frame/ui';
import type { Note } from '@frame-app/shared';
import type { Session } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';
import { NotesView } from './NotesView';
import { supabase } from './supabase';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string>();
  const run = async (mode: 'in' | 'up') => {
    const fn = mode === 'in' ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { error } = await fn.call(supabase.auth, { email, password });
    setMsg(error?.message);
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void run('in');
      }}
    >
      <Field label="Email">
        {(p) => (
          <Input {...p} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        )}
      </Field>
      <Field label="Password" error={msg}>
        {(p) => (
          <Input
            {...p}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
      </Field>
      <Button type="submit">Sign in</Button>{' '}
      <Button variant="secondary" onClick={() => void run('up')}>
        Sign up
      </Button>
    </form>
  );
}

function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const load = useCallback(async () => {
    const { data } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });
    setNotes(data ?? []);
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  return (
    <NotesView
      notes={notes}
      onCreate={async (title) => {
        await supabase.from('notes').insert({ title });
        await load();
      }}
    />
  );
}

export function App() {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppShell>{session ? <Notes /> : <SignIn />}</AppShell>
    </ThemeProvider>
  );
}
