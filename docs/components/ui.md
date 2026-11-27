# UI components (`@frame/ui`)

Import from `@frame/ui`. Every component forwards extra HTML props (`id`, `data-*`, `aria-*`, `className`) to its root.
They style themselves from theme tokens; never restyle them from outside beyond `className` for app-specific details.

| Component                    | Use for                                                 | Not for                                        |
| ---------------------------- | ------------------------------------------------------- | ---------------------------------------------- |
| `Button`                     | actions                                                 | navigation between pages (use a link)          |
| `Field` + `Input` / `Select` | a labelled form control with hint and error             | —                                              |
| `Checkbox`                   | an on/off choice with a label                           | —                                              |
| `Slider`                     | a number in a range (filters, settings)                 | free numeric input (use `Input type="number"`) |
| `Dialog`                     | a modal that needs focus trapping                       | non-blocking messages                          |
| `Tabs`                       | switching panels in place                               | site navigation                                |
| `Table`                      | tabular data with headers                               | card lists                                     |
| `ListItem`                   | a tappable row in a list; selected / highlighted states | a static row (use `Stack`)                     |
| `Badge`                      | a short label or colour mark: status, category, tag     | long text, buttons                             |
| `Text`                       | every piece of text that needs a size, tone or weight   | layout or margins                              |

## Text

```tsx
<Text size="md" weight="semibold">Strandvägen</Text>
<Text tone="muted" size="xs">Vasastan</Text>
<Text as="p" tone="secondary">A paragraph.</Text>
<Text nowrap>12.5k kr</Text>
```

`size`: `xs | sm (default) | md | lg | xl` → tokens `--text-xs … --text-xl` (defaults 0.75, 0.875, 1, 1.25, 1.5 rem; an
app may override them on `:root`). `tone`: `default | secondary | muted` (`secondary` reads
`--color-foreground-secondary` if set, else mixes foreground and background). `weight`: `regular | medium | semibold |
bold`. `as`: any element (default `span`). Text never sets margins; spacing comes from `Stack` or `Page`.

## Badge

```tsx
<Badge tone="success">Aktiv</Badge>
<Badge tone="custom" color="#1E7B34" background="#1E7B3433">240 kr/m²</Badge>
<Badge tone="custom" shape="pill" color="#fff" background="#E3000F">T13</Badge>
<Badge tone="custom" shape="dot" background="#34C759" /> <Text>under 250</Text>
```

`tone`: `neutral (default) | primary | success | danger | custom`. With `custom`, `color` and `background` carry a
data colour (category, line, price band); this is the only way to pass a colour from data. `shape`: `rounded (default)
| pill | dot`. A dot has no text and is hidden from screen readers, so put a label next to it.

## Slider

```tsx
<Slider
  id="f-rent"
  label="Hyra"
  min={5000}
  max={25000}
  step={500}
  value={rent}
  onValueChange={setRent}
  format={(v) => `≤ ${v / 1000}k kr`}
/>
```

A native range input with its label and current value. `layout`: `inline (default)` = label · slider · value on one
row; `stacked` = label above. `format` also becomes `aria-valuetext`. `onValueChange` receives a number.

## ListItem

```tsx
<Panel flush>
  {items.map((i) => (
    <ListItem
      key={i.id}
      id={`c${i.id}`}
      selected={i.id === selectedId}
      highlighted={i.isNew}
      onClick={() => pick(i)}
    >
      <Stack as="span" gap={1}>
        …
      </Stack>
    </ListItem>
  ))}
</Panel>
```

A full-width `<button>` with a divider. `selected` → `aria-pressed="true"` and a 2 px inset ring
(`--color-selected`, default foreground). `highlighted` → `data-highlighted` and a tinted background
(`--color-highlight`, default 8 % primary). Content inside a button must be phrasing content, so use
`Stack as="span"` and `Text` (spans), not `div` or `p`.

## Button, Field, Input, Select, Checkbox, Dialog, Tabs, Table

See their source in `packages/ui/src` (short, typed props) and the playground (`apps/playground`).

## Optional tokens these components read

| Token                          | Default                          | Used by                 |
| ------------------------------ | -------------------------------- | ----------------------- |
| `--text-xs` … `--text-xl`      | 0.75 … 1.5 rem                   | Text, Badge, Slider     |
| `--color-foreground-secondary` | mix of foreground and background | Text `tone="secondary"` |
| `--color-highlight`            | 8 % primary on surface           | ListItem `highlighted`  |
| `--color-selected`             | `--color-foreground`             | ListItem `selected`     |

## Heading

```tsx
<Heading level="display">Alla hyresannonser på ett ställe.</Heading>  // hero, h1
<Heading level={1}>Villkor</Heading>                                  // page title, h1
<Heading level={2}>Kartor</Heading>                                   // section title, h2
<Heading level={3} as="h1">Lägenheter</Heading>                       // tool title: small size, h1 element
```

`level` picks the size (tokens `--heading-display` 2.25 rem → 3 rem from 768 px, `--heading-1` 2 rem, `--heading-2`
1.5 rem → 1.75 rem, `--heading-3` 1.25 rem), weight 700, line height 1.15, tracking −0.02 em, `--font-heading`.
`as` changes only the element (for the outline). No margins: spacing comes from `Stack`, `Page` or `Section`.

## CheckList

```tsx
<CheckList items={[{ title: 'Din egen plats', text: 'Flytta pinnen …' }]} />
<CheckList size="lg" items={points} />  // in a hero
```

A `<ul>` of items, each a check mark in a soft `--color-primary` circle, an optional semibold title and a line of
secondary text. `md` (default): title `--text-md`, text `--text-sm`; `lg`: `--text-lg` and `--text-md`.

`Text align="center"` centres a paragraph, e.g. under a centred heading.
