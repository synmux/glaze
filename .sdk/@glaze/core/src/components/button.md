# Button

A native macOS-style button for triggering actions. Use it for any clickable action — primary/confirm buttons, secondary/cancel buttons, toolbar buttons, and dropdown triggers. The variant communicates emphasis; the surrounding context (toolbar, dialog, sidebar) dictates which variant and size to use.

## When to Use

- **`filled`** (default): most buttons — dialog/form actions, secondary actions, Cancel.
- **`muted`**: subtle controls that should match filled inputs, selects, or segmented-control tracks, such as secondary composer actions.
- **`accent`**: the one primary action per screen/dialog (Save, Submit, Confirm).
- **`destructive`**: dangerous confirm actions (Delete, Remove).
- **`glass`**: content-area toolbar buttons only — not on glass surfaces like modals or sidebars.
- **`transparent`**: tertiary/inline actions, link-like buttons, and sidebar toolbar buttons.
- **`iconOnly`**: compact spaces and toolbars where the icon's meaning is obvious.
- For a segmented row of related actions, wrap buttons in `ButtonGroup` (see [./button-group.md](./button-group.md)).

## Usage Patterns

### Basic

```tsx
<Button>Cancel</Button>
<Button variant="accent">Save Changes</Button>
<Button variant="destructive">Delete</Button>

// Icon + label — SVG children auto-size from the button's size prop
<Button variant="accent">
  <PlusIcon />
  Add Item
</Button>
```

### Variants and sizes

`variant` defaults to `filled` (or `transparent` inside a `ButtonGroup`). Inside `ToolbarActions`, the toolbar supplies its contextual variant and size automatically. `size` otherwise defaults to `medium`. SVG icon children auto-size from `size`; override a single icon with `className="size-X"`.

```tsx
<Button variant="filled">Filled</Button>
<Button variant="transparent">Transparent</Button>
<Button variant="muted">Muted</Button>

<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>

<Button iconOnly size="medium"><SearchIcon /></Button>
```

### Toolbar buttons

Place toolbar buttons in `ToolbarActions`: it defaults them to glass/large in content areas and transparent/small in sidebars (glass/large on macOS 27+). Prefer either icon-only or text-only toolbar buttons — don't mix icon and text. See [./toolbar.md](./toolbar.md).

```tsx
{
  /* Content-area toolbar */
}
<Toolbar>
  <ToolbarContent>
    <ToolbarTitle>Documents</ToolbarTitle>
  </ToolbarContent>
  <ToolbarActions>
    <Button iconOnly>
      <SearchIcon />
    </Button>
    <Button>Add Item</Button>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button iconOnly>
          <MoreIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>...</DropdownMenuContent>
    </DropdownMenu>
  </ToolbarActions>
</Toolbar>;

{
  /* Sidebar toolbar */
}
<Sidebar
  toolbar={
    <Toolbar className="pt-1">
      <ToolbarRow className="justify-end">
        <Button iconOnly variant="transparent" size="small">
          <PlusIcon />
        </Button>
      </ToolbarRow>
    </Toolbar>
  }
>
  ...
</Sidebar>;
```

### As a link or trigger

`asChild` renders the button styling onto its single child (a link, a dropdown trigger, etc.).

```tsx
<Button asChild>
  <Link to="/settings">Settings</Link>
</Button>
```

## Component API

### Button

Extends `React.ButtonHTMLAttributes<HTMLButtonElement>` (minus `size`). All standard button attributes (`onClick`, `disabled`, `type`, …) pass through to the underlying element.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"accent" \| "destructive" \| "filled" \| "muted" \| "glass" \| "glassAccent" \| "transparent"` | `"filled"` (`"transparent"` in a ButtonGroup) | Visual emphasis / context. |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Height (28 / 32 / 36px) and auto icon size (16 / 18 / 20px). |
| `iconOnly` | `boolean` | `false` | Square button sized for a single icon (28 / 32 / 36px square). |
| `radius` | `"full" \| "rounded"` | `"full"` | `full` = pill; `rounded` = control radius (softer corners on `small`). |
| `asChild` | `boolean` | `false` | Render button styling onto the single child instead of a `<button>`. |
| `className` | `string` | - | Additional classes. |

## Design System Rules

### ✅ Do

- Use exactly **one `accent` button** per screen/dialog for the primary action.
- Use `filled` (default) for most buttons.
- Use `muted` when a button sits beside a subtle filled form control and should share its tint.
- Put toolbar buttons in `ToolbarActions` and let it supply the contextual variant and size, including through dropdown triggers.
- Keep button text concise (1–3 words).
- Trust auto-sizing: let SVG icons inherit size from the button's `size` prop; override per icon only with `className="size-X"`.

### ❌ Don't

- Use `glass` outside a toolbar, or `filled`/`accent` inside a toolbar.
- Use `glass` or `size="large"` in sidebar toolbars (use `transparent` + `size="small"`).
- Mix icon and text in a toolbar button.
- Use `className` to override colors or spacing.
- Use icon-only buttons where the icon's meaning isn't clear from context.
