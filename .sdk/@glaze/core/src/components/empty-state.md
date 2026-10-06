# Empty State

A native macOS-style placeholder for screens, lists, or panels that have no content to show. Leads with plain text — icon-free by default, following Apple HIG (Mail, Notes, Messages, Finder all use text-only empty states). One component with four optional props covers nearly every case.

## When to Use

- **Empty lists or collections**: "No notes yet", "Inbox is empty".
- **Empty search results**: "No matches for 'abc'".
- **First-run / zero-data screens**: "What would you like to build?".
- **Error or failure states**: "Couldn't load projects".

## Usage Patterns

### Basic

Pass any of `title`, `description`, `actions`, `media` and the component auto-builds its internal tree. Each is optional — title-only or description-only is fine.

```tsx
<EmptyState title="No notes yet" description="Create your first note to get started." />
```

### Placement

- **`"center"`** (default) — absolutely positioned in the middle of the nearest **positioned** ancestor. `SplitView` columns, `Panel`, and `ScrollArea` already are one, so inside those it centers within its own pane. In a hand-rolled container (a plain flex column, a custom pane) add `position: relative` to the pane — otherwise the empty state escapes and centers across the whole window.
- **`"viewport"`** — centers within the visible part of an enclosing `ScrollArea`, between its measured toolbar and footer. Use for empty conversations with a docked composer or other scroll layouts whose top and bottom chrome have different heights. It updates as that chrome resizes.
- **`"inline"`** — flows with surrounding content. Use inside a scrollable list or a larger section.

```tsx
<div className="space-y-4">
  <h2>Recent Activity</h2>
  <EmptyState placement="inline" title="No recent activity" />
</div>

<ScrollArea footer={composer}>
  <EmptyState placement="viewport" title="New conversation" description="Ask anything to get started." />
</ScrollArea>
```

### List, search, and error states

Render conditionally on the data state. Keep actions to 1–2 buttons and messages specific.

```tsx
{
  items.length === 0 && (
    <EmptyState
      title="No projects yet"
      description="Create your first project to get started."
      actions={<Button onClick={handleCreate}>Create Project</Button>}
    />
  );
}

{
  searchQuery && filtered.length === 0 && (
    <EmptyState
      title={`No results for "${searchQuery}"`}
      description="Try a different search term."
      actions={
        <Button variant="transparent" onClick={clearSearch}>
          Clear Search
        </Button>
      }
    />
  );
}

{
  error && (
    <EmptyState
      title="Couldn't load projects"
      description={error.message}
      actions={<Button onClick={retry}>Try Again</Button>}
    />
  );
}
```

### When (rarely) to include media

Native macOS apps almost never put icons in empty states — the default should be no icon. Only add `media` when the visual genuinely adds information (signature artwork, an onboarding illustration, a domain-specific glyph like an unpaired device).

The slot expects something around `size-16` — the right scale for SF Symbols, custom illustrations, or app artwork. **Lucide icons don't work at that size** (2px-stroke glyphs designed for ~20px look cartoonish scaled up); use a non-Lucide asset at `size-16` or skip media entirely.

```tsx
<EmptyState
  media={<AirPodsIllustration className="size-16" />}
  title="No AirPods nearby"
  description="Make sure they're charged and within range."
/>
```

### Composition

Use the primitives only when props can't express what you need — custom ordering, a multi-paragraph description with inline formatting, a non-standard action layout. If `EmptyState` receives no auto-build props, it renders `children`.

```tsx
<EmptyState>
  <EmptyStateMedia>{/* rarely used — see above */}</EmptyStateMedia>
  <EmptyStateTitle>{/* heading */}</EmptyStateTitle>
  <EmptyStateDescription>{/* supporting text */}</EmptyStateDescription>
  <EmptyStateActions>{/* one or two buttons */}</EmptyStateActions>
</EmptyState>
```

## Component API

### EmptyState

Extends `div` props (minus `title`). Setting any of `title`/`description`/`actions`/`media` switches to props mode; otherwise `children` is rendered.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `React.ReactNode` | - | Heading text. |
| `description` | `React.ReactNode` | - | Supporting text below the title. |
| `actions` | `React.ReactNode` | - | One or more action buttons. |
| `media` | `React.ReactNode` | - | Icon or illustration above the title. Use sparingly. |
| `placement` | `"center" \| "inline" \| "viewport"` | `"center"` | Positioning behavior. |
| `className` | `string` | - | Additional CSS classes. |

### Primitives

- `EmptyStateTitle` — renders `Text as="h1"` at `heading1` size, regular weight (24/400), primary color.
- `EmptyStateDescription` — renders `Text as="p"` with `color="tertiary"`.
- `EmptyStateActions` — stacks children vertically (`gap-2`), centered.
- `EmptyStateMedia` — centered container for an icon or illustration.

## Design System Rules

### ✅ Do

- Lead with text — title + description is the canonical shape.
- Be specific: "No notes yet" beats "No data".
- Keep actions to 1–2 buttons max.
- Use `placement="inline"` when the empty state sits inside a larger layout.
- Use `placement="viewport"` when unequal, measured `ScrollArea` toolbar/footer chrome should be excluded from centering.
- In multi-column layouts, render the empty state in the **primary/flex column** only — adjacent sidebars or list columns should stay blank or show a static heading.
- Make sure a centered empty state centers **within its own pane**: render it inside the column it describes and give hand-rolled panes `position: relative`. It must never span the full window of a list + detail layout.

### ❌ Don't

- Reach for a generic Lucide icon by default. Native macOS apps don't.
- Use Lucide icons in the `media` slot — they look cartoonish at the `size-16` media scale.
- Put the same empty state in both sidebar and list columns.
- Use vague messages ("No data", "Nothing to show").
- Put more than 2 actions in `actions`.
