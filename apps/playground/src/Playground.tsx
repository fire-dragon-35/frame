import { AppShell, Container, Grid, Page, Panel, Stack } from '@frame/core';
import { presets, ThemeProvider, type PresetName } from '@frame/themes';
import { Button, Checkbox, Dialog, Field, Input, Select, Table, Tabs } from '@frame/ui';
import { useState } from 'react';

const rows = [
  { id: '1', name: 'Ada', role: 'Admin' },
  { id: '2', name: 'Linus', role: 'Member' },
];

export function Playground() {
  const [preset, setPreset] = useState<PresetName>('default');
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <ThemeProvider theme={presets[preset]} mode={dark ? 'dark' : 'light'}>
      <AppShell
        navigation={
          <Container>
            <Stack direction="row" gap={4} align="center" justify="between" wrap>
              <strong>Frame Playground</strong>
              <Stack direction="row" gap={2} align="center" wrap>
                <Select
                  aria-label="Theme"
                  value={preset}
                  onChange={(e) => setPreset(e.target.value as PresetName)}
                >
                  {Object.keys(presets).map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </Select>
                <Checkbox label="Dark" checked={dark} onChange={(e) => setDark(e.target.checked)} />
              </Stack>
            </Stack>
          </Container>
        }
      >
        <Container>
          <Page>
            <Page.Header>
              <h1>Overview</h1>
            </Page.Header>
            <Page.Content>
              <Grid>
                <Grid.Item span={{ base: 12, md: 6, lg: 8 }}>
                  <Panel>
                    <Stack gap={4}>
                      <h2>Form</h2>
                      <Field label="Name" hint="Your display name">
                        {(p) => <Input {...p} />}
                      </Field>
                      <Stack direction="row" gap={2}>
                        <Button>Save</Button>
                        <Button variant="secondary" onClick={() => setOpen(true)}>
                          Open dialog
                        </Button>
                      </Stack>
                    </Stack>
                  </Panel>
                </Grid.Item>
                <Grid.Item span={{ base: 12, md: 6, lg: 4 }}>
                  <Panel>
                    <h2>Supporting</h2>
                    <p>Same composition, any theme.</p>
                  </Panel>
                </Grid.Item>
                <Grid.Item span={12}>
                  <Panel>
                    <Tabs
                      aria-label="Data"
                      items={[
                        {
                          id: 'users',
                          label: 'Users',
                          content: (
                            <Table
                              caption="Users"
                              rowKey={(r) => r.id}
                              rows={rows}
                              columns={[
                                { key: 'name', header: 'Name', cell: (r) => r.name },
                                { key: 'role', header: 'Role', cell: (r) => r.role },
                              ]}
                            />
                          ),
                        },
                        { id: 'other', label: 'Other', content: <p>Other content</p> },
                      ]}
                    />
                  </Panel>
                </Grid.Item>
              </Grid>
            </Page.Content>
          </Page>
        </Container>
        <Dialog open={open} onClose={() => setOpen(false)} title="Example dialog">
          <p>Native dialog: focus is trapped and Escape closes it.</p>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Dialog>
      </AppShell>
    </ThemeProvider>
  );
}
