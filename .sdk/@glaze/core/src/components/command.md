# Command

A command palette with fuzzy search, keyboard navigation, and grouped actions. Built on `cmdk`. Use it when you want a single searchable surface for navigating, switching, or triggering many actions from one place.

## When to Use

- **Command palettes / quick switchers**: searchable access to navigation, files, projects, or actions (⌘K is the standard trigger).
- **Action menus**: keyboard-driven selection across a large set of commands.
- For a small, fixed set of options use a regular menu or `DropdownMenu` instead — a command palette is overkill below ~8 items.
- Use `CommandDialog` for an overlay palette; use bare `Command` to embed the same UI inline in a page or panel.

## Usage Patterns

### Basic

`CommandDialog` is the overlay form. Open state is yours to manage; the canonical trigger is ⌘K.

```tsx
const [open, setOpen] = useState(false);

useEffect(() => {
  const down = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((o) => !o);
    }
  };
  document.addEventListener("keydown", down);
  return () => document.removeEventListener("keydown", down);
}, []);

<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem onSelect={() => navigate("/dashboard")}>
        <HomeIcon />
        Go to Dashboard
        <CommandShortcut>⌘H</CommandShortcut>
      </CommandItem>
      <CommandItem onSelect={() => navigate("/settings")}>
        <SettingsIcon />
        Open Settings
        <CommandShortcut>⌘,</CommandShortcut>
      </CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>;
```

### Inline (without a dialog)

Render `Command` directly to embed the palette in a page or panel.

```tsx
<Command className="rounded-lg border shadow-md">
  <CommandInput placeholder="Search commands..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Quick Actions">
      <CommandItem onSelect={handleSave}>
        <SaveIcon />
        Save Document
        <CommandShortcut>⌘S</CommandShortcut>
      </CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

### Grouped commands with separators and accessories

Group related commands with `CommandGroup` headings, divide groups with `CommandSeparator`, and use `CommandAccessory` for secondary text (paths, sizes, timestamps).

```tsx
<CommandDialog open={open} onOpenChange={setOpen} title="Quick Open">
  <CommandInput placeholder="Search files..." />
  <CommandList>
    <CommandEmpty>No files found.</CommandEmpty>
    <CommandGroup heading="Recent Files">
      {recentFiles.map((file) => (
        <CommandItem key={file.id} onSelect={() => openFile(file)}>
          <FileIcon />
          {file.name}
          <CommandAccessory>{file.path}</CommandAccessory>
        </CommandItem>
      ))}
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Actions">
      <CommandItem onSelect={handleNewProject}>
        <PlusIcon />
        New Project
        <CommandShortcut>⌘N</CommandShortcut>
      </CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>
```

### Async / dynamic results

Drive results from `onValueChange` and render your own loading state inside `CommandList`.

```tsx
const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);

const handleSearch = async (query: string) => {
  if (!query.trim()) return setResults([]);
  setLoading(true);
  try {
    setResults(await searchAPI(query));
  } finally {
    setLoading(false);
  }
};

<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Search everything..." onValueChange={handleSearch} />
  <CommandList>
    {loading ? (
      <Spinner className="mx-auto my-6 size-4" />
    ) : (
      <>
        <CommandEmpty>No results found.</CommandEmpty>
        {results.map((group) => (
          <CommandGroup key={group.type} heading={group.title}>
            {group.items.map((item) => (
              <CommandItem key={item.id} onSelect={() => selectItem(item)}>
                <item.icon />
                {item.title}
                <CommandAccessory>{item.subtitle}</CommandAccessory>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </>
    )}
  </CommandList>
</CommandDialog>;
```

## Required Structure

`CommandList` wraps the results, `CommandEmpty` must be present to handle the no-match state, and items live inside `CommandGroup`.

```tsx
<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Group Name">
      <CommandItem onSelect={handleAction}>
        <Icon />
        Command Name
        <CommandShortcut>⌘K</CommandShortcut>
      </CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>
```

## Component API

`Command`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, and `CommandSeparator` wrap the corresponding `cmdk` primitives and forward all of their props. Only the additions are listed below.

### Command

| Prop        | Type     | Default | Description                                             |
| ----------- | -------- | ------- | ------------------------------------------------------- |
| `className` | `string` | -       | Additional classes; forwards all `cmdk` `Command` props |

### CommandDialog

Wraps `Dialog` (renders a `large` `DialogContent`). Forwards all `Dialog` props (`open`, `onOpenChange`, …).

| Prop              | Type      | Default                            | Description                               |
| ----------------- | --------- | ---------------------------------- | ----------------------------------------- |
| `title`           | `string`  | `"Command Palette"`                | Accessible dialog title (visually hidden) |
| `description`     | `string`  | `"Search for a command to run..."` | Accessible description (visually hidden)  |
| `showCloseButton` | `boolean` | `true`                             | Show the close button                     |
| `className`       | `string`  | -                                  | Classes on the dialog content             |

### CommandInput

| Prop            | Type                      | Default | Description                  |
| --------------- | ------------------------- | ------- | ---------------------------- |
| `showIcon`      | `boolean`                 | `true`  | Show the leading search icon |
| `placeholder`   | `string`                  | -       | Placeholder text             |
| `onValueChange` | `(value: string) => void` | -       | Called as the query changes  |

### CommandItem

| Prop        | Type                      | Default      | Description                            |
| ----------- | ------------------------- | ------------ | -------------------------------------- |
| `onSelect`  | `(value: string) => void` | -            | Called when the item is chosen         |
| `value`     | `string`                  | text content | Custom search value used for filtering |
| `disabled`  | `boolean`                 | `false`      | Disable the item                       |
| `className` | `string`                  | -            | Additional classes                     |

### CommandGroup

| Prop        | Type              | Default | Description        |
| ----------- | ----------------- | ------- | ------------------ |
| `heading`   | `React.ReactNode` | -       | Group title        |
| `className` | `string`          | -       | Additional classes |

### CommandShortcut / CommandAccessory

Both render a `<span>` (forwarding all span props) pushed to the right of an item — `CommandShortcut` for keyboard shortcuts, `CommandAccessory` for secondary metadata.

## Design System Rules

### ✅ Do

- Group related commands with `CommandGroup` and descriptive headings; keep each group short (~8 items).
- Add `CommandShortcut` for actions that have a keyboard shortcut.
- Use `CommandAccessory` for secondary info (paths, sizes, timestamps).
- Always render `CommandEmpty` to handle the no-results state.
- Bind ⌘K (or another global shortcut) to open the palette.
- Set a custom `value` on `CommandItem` when the visible label alone won't match the searches users will type.

### ❌ Don't

- Use a command palette for a small fixed option set (use a menu or `DropdownMenu`).
- Cram more than ~8-10 items into one group.
- Use vague command names or skip icons — they hurt scannability.
- Trigger destructive actions without confirmation.

## Keyboard Navigation

`cmdk` provides these out of the box:

- `↑` / `↓` — move between items
- `Enter` — select the highlighted item
- `Escape` — close the dialog
- Typing filters items with fuzzy matching (exact, partial, acronym, and out-of-order character matches).
