import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppShell, Container, Grid, Page, Panel, Stack, responsiveVars } from '../index';

describe('responsiveVars', () => {
  it('maps breakpoint keys to custom properties', () => {
    expect(responsiveVars('x', { base: 12, md: 6 })).toEqual({ '--x-base': 12, '--x-md': 6 });
  });
  it('treats a plain value as base', () => {
    expect(responsiveVars('x', 4)).toEqual({ '--x-base': 4 });
  });
});

describe('layout primitives', () => {
  it('Grid.Item exposes responsive spans as CSS variables', () => {
    render(
      <Grid>
        <Grid.Item span={{ base: 12, md: 6, lg: 8 }}>a</Grid.Item>
      </Grid>,
    );
    const item = screen.getByText('a');
    expect(item.style.getPropertyValue('--grid-span-md')).toBe('6');
    expect(item.style.getPropertyValue('--grid-span-lg')).toBe('8');
  });
  it('Stack applies gap and direction tokens', () => {
    render(
      <Stack gap={4} direction={{ base: 'column', md: 'row' }}>
        s
      </Stack>,
    );
    const el = screen.getByText('s');
    expect(el.style.getPropertyValue('--stack-gap')).toBe('var(--space-4)');
    expect(el.style.getPropertyValue('--stack-direction-md')).toBe('row');
  });
  it('AppShell renders navigation, sidebar and a main landmark', () => {
    render(
      <AppShell navigation={<nav>n</nav>} sidebar={<div>s</div>}>
        content
      </AppShell>,
    );
    expect(screen.getByRole('main')).toHaveTextContent('content');
    expect(screen.getByText('s').closest('aside')).not.toBeNull();
  });
  it('Page, Container and Panel compose', () => {
    render(
      <Container>
        <Page>
          <Page.Header>
            <h1>T</h1>
          </Page.Header>
          <Page.Content>
            <Panel>p</Panel>
          </Page.Content>
        </Page>
      </Container>,
    );
    expect(screen.getByRole('heading', { name: 'T' })).toBeInTheDocument();
    expect(screen.getByText('p').tagName).toBe('SECTION');
  });
});
