# Dialog

A native macOS-style modal dialog with glass morphism, smooth animations, and focus management, built on Radix primitives. Top-level props collapse the trigger/header/body/footer tree into a single `<Dialog>` call and manage open state + async confirm; drop to the primitive parts for layouts the props can't express.

## When to Use

- Create / rename / edit an entity in a focused form, or an informational "read and acknowledge" modal (changelog, terms) — use `Dialog` with `title` + `onConfirm`.
- Settings-style edit sheet with a destructive escape hatch — `Dialog` with `destructiveAction`.
- Multi-step wizard (Back/Next), custom footer (progress bar, "don't ask again" checkbox), or a `<form>`-submit body — drop to primitives (`DialogContent`/`DialogHeader`/…).
- Irreversible destructive action (delete, unpublish) or an "unsaved changes" guard — use **AlertDialog** (`./alert-dialog.md`), which blocks Esc / outside-click dismissal.

Quick rule: `Dialog` is for flows where Esc / outside-click dismissal is a safe no-op. `AlertDialog` is for flows where it isn't.

## Usage Patterns

### Basic — props API

Most dialogs are trigger → header → body → footer with Cancel + Confirm. Set the top-level props and pass body content as `children` (auto-wrapped in `DialogBody`, scrolls at `60vh` with faded edges).

```tsx
<Dialog
  trigger={<Button>New Project</Button>}
  title="Create a New Project"
  description="Describe what you want to build. You can refine it later."
  confirmLabel="Create Project"
  confirmDisabled={!name.trim() || !prompt.trim()}
  onConfirm={async () => {
    await createProject({ name, prompt });
  }}
>
  <div className="flex flex-col gap-3">
    <Field label="Name" orientation="vertical" className="p-0">
      <Input value={name} onChange={(e) => setName(e.target.value)} />
    </Field>
    <Field label="Prompt" orientation="vertical" className="p-0">
      <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} />
    </Field>
  </div>
</Dialog>
```

`onConfirm` returning a Promise disables the confirm button (no inline spinner — avoids width jitter) until it resolves: on success the dialog closes; on throw it stays open so you can surface the error inline. Cancel stays enabled throughout.

```tsx
<Dialog
  trigger={<Button variant="destructive">Delete</Button>}
  title="Delete this project?"
  confirmLabel="Delete"
  confirmVariant="destructive"
  onConfirm={async () => {
    try {
      await deleteProject(id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete project");
      throw err; // keeps the dialog open so the user can retry
    }
  }}
/>
```

### Controlled open (programmatic)

Omit `trigger` and pass `open` / `onOpenChange` when the dialog opens from a menu item, shortcut, or event instead of an inline button.

```tsx
const [open, setOpen] = useState(false);

<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Rename project"
  description="This is how the project shows up in your workspace."
  confirmLabel="Rename"
  onConfirm={renameProject}
>
  <Field label="Name" orientation="vertical" className="p-0">
    <Input value={name} onChange={(e) => setName(e.target.value)} />
  </Field>
</Dialog>;
```

### Destructive side action (edit sheet)

For an edit sheet with a destructive escape hatch, pass `destructiveAction`. It renders left-aligned, styled `filled` (not red — red is reserved for the terminal confirmation in a follow-up `AlertDialog`). Footer lays out `[Remove from Organization]` … `[Cancel] [Save]`.

```tsx
<Dialog
  size="large"
  trigger={<Button>Edit Member</Button>}
  title="Jamie Chen"
  hideTitle
  description="jamie@acme.com"
  hideDescription
  confirmLabel="Save"
  destructiveAction={{
    label: "Remove from Organization",
    onClick: () => openRemoveMemberConfirmation(memberId), // fires a follow-up AlertDialog
  }}
  onConfirm={() => saveMember(settings)}
>
  <FieldGroup>
    <Field label="Name">
      <Input value={settings.name} onChange={...} className="w-52" />
    </Field>
    <Field label="Email">
      <Input value={settings.email} onChange={...} className="w-52" />
    </Field>
  </FieldGroup>
</Dialog>
```

`secondaryAction` (a neutral left button, e.g. "Reset Defaults") renders after `destructiveAction`. Use it sparingly: setting both makes four buttons that stack vertically (Confirm → secondary → destructive → Cancel, each full-width), usually a sign the UX needs rethinking.

### Composition — primitives

Drop to the parts when the props can't express the layout: multi-step wizards, a custom footer, or a `<form>`-submit body. Body-only customization (compiler output, code, diffs) does **not** need primitives — pass it as `children` (it scrolls automatically), and "type the name to confirm" is just a computed `confirmDisabled` boolean.

```tsx
// Install update with a "don't ask again" checkbox in the footer.
<Dialog>
  <DialogTrigger asChild>
    <Button>Install Update</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Install Glaze 1.5?</DialogTitle>
      <DialogDescription>
        Glaze will restart to apply the update. Any running agent sessions will be paused.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="items-center justify-between">
      <Label className="flex items-center gap-2 text-regular text-secondary">
        <Checkbox checked={skip} onCheckedChange={setSkip} /> Don't ask again
      </Label>
      <div className="flex gap-2">
        <DialogClose asChild>
          <Button variant="filled">Later</Button>
        </DialogClose>
        <Button variant="accent" onClick={install}>
          Install & Restart
        </Button>
      </div>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Sizing

| Size               | Width  | Use                    |
| ------------------ | ------ | ---------------------- |
| `small`            | ~320px | Simple confirmations   |
| `medium` (default) | 400px  | Standard forms, info   |
| `large`            | 500px  | Multi-section forms    |
| `xl`               | 750px  | Content-heavy, wizards |
| `2xl`              | 900px  | Data tables, media     |

## Component API

### Dialog

Root. When any of `trigger` / `title` / `description` / `onConfirm` is set ("props mode"), auto-builds the content tree, owns open state internally, and treats `children` as body. Otherwise behaves as the Radix root (compose the parts by hand). Forwards all `DialogPrimitive.Root` props (`open`, `defaultOpen`, `onOpenChange`, `modal`).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` | `ReactNode` | - | Auto-wrapped in `DialogTrigger asChild`. Omit when opening programmatically via `open`. |
| `title` | `ReactNode` | - | Auto-renders a `DialogTitle`. Required for accessibility whenever props mode is used. |
| `hideTitle` | `boolean` | `false` | Keep the title in the DOM but `sr-only`. Use when the trigger already conveys it. |
| `description` | `ReactNode` | - | Auto-renders a `DialogDescription` under the title. |
| `hideDescription` | `boolean` | `false` | Same pattern as `hideTitle` for the description. |
| `onConfirm` | `() => void \| Promise<void>` | - | Primary action. Enables the auto footer (Cancel + Confirm). Promise disables confirm while pending. |
| `confirmLabel` | `ReactNode` | `"Done"` | Confirm button label. |
| `confirmVariant` | `"accent" \| "destructive"` | `"accent"` | Confirm button variant. |
| `confirmDisabled` | `boolean` | - | Disable confirm (e.g. failed form validation). |
| `destructiveAction` | `{ label: ReactNode; onClick: () => void \| Promise<void> }` | - | Left-aligned destructive-intent button, styled `filled`. Renders before `secondaryAction`. |
| `secondaryAction` | `{ label: ReactNode; onClick: () => void \| Promise<void> }` | - | Left-aligned neutral button. Renders after `destructiveAction`. |
| `size` | `"small" \| "medium" \| "large" \| "xl" \| "2xl"` | `"medium"` | Forwarded to `DialogContent`. |
| `showOverlay` | `boolean` | `true` | Show/hide the backdrop overlay (composition mode only). |

### DialogContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `"small" \| "medium" \| "large" \| "xl" \| "2xl"` | `"medium"` | Dialog width. |
| `showCloseButton` | `boolean` | `false` | Show the X close button. |
| `overlayClassName` | `string` | - | Custom overlay classes. |
| `className` | `string` | - | Additional classes for custom sizing. |

### DialogBody

Scrollable container between header and footer; wraps children in a `ScrollArea` with faded edges on overflow.

| Prop                  | Type     | Default  | Description                                          |
| --------------------- | -------- | -------- | ---------------------------------------------------- |
| `maxHeight`           | `string` | `"60vh"` | Max height. Lower it when header/footer are tall.    |
| `scrollAreaClassName` | `string` | -        | Classes on the `ScrollArea` wrapper.                 |
| `className`           | `string` | -        | Classes on the inner content div (e.g. `space-y-4`). |

### Other parts

- **DialogTrigger** — use `asChild` to apply trigger behavior to a child button.
- **DialogHeader** — container for title + description.
- **DialogTitle** — required for accessibility; `className="sr-only"` to hide visually.
- **DialogDescription** — auto-linked via `aria-describedby`.
- **DialogFooter** — arranges buttons, primary action rightmost.
- **DialogClose** — use `asChild` to apply close behavior to a button.
- **DialogOverlay** — the backdrop. Rendered automatically by `DialogContent` (and by the root in composition mode when `showOverlay`); export it only to customize the backdrop directly. Forwards all `DialogPrimitive.Overlay` props.
- **DialogPortal** — portals dialog content to the document body. Rendered internally by `DialogContent`; rarely needed directly. Forwards all `DialogPrimitive.Portal` props.

## Design System Rules

### ✅ Do

- Use the top-level props **or** the primitives, not both — a `<DialogHeader>`/`<DialogFooter>` inside a props-mode `Dialog` lands inside the body.
- Keep one primary action per dialog (the confirm button); put extra actions in `destructiveAction` / `secondaryAction` or compose the footer.
- Pass any renderable node to `title`, `description`, `confirmLabel`, `trigger`, and side-action `label` — strings, fragments, inline icons all work.
- Surface async-confirm errors via `toast.error(...)` and re-`throw` so the dialog stays open for retry.

### ❌ Don't

- Use `Dialog` for irreversible destructive confirmations — use `AlertDialog`, which blocks Esc / outside-click.
- Add accent buttons inside the body — the confirm button is the single primary action.
- Set both `destructiveAction` and `secondaryAction` unless you genuinely need a 4-button vertical stack.
- Expect an inline spinner on confirm — the button only disables (an icon would jitter its width).
