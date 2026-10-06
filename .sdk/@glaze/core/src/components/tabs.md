# Tabs

A native macOS-style tabbed control with an animated active-tab indicator and keyboard navigation. Use it to switch between alternative views of the same surface — settings categories, filtered lists, or sections of a single item — where only one view is visible at a time.

## When to Use

- Switching between peer views of the same surface (settings categories, filtered lists, dashboard sections).
- Toolbar-style segmented controls (use the `glass` variant); content-area or in-dialog sections (use `filled`).
- Use a **wizard/stepper** instead for sequential flows, a **Switch** for an immediate-effect binary setting, and a sidebar/list for navigation between distinct top-level destinations.

## Usage Patterns

### Basic

`TabsRoot` owns the active value; `Tabs` is the trigger row; each `TabsContent` shows when its `value` matches.

```tsx
<TabsRoot defaultValue="general">
  <Tabs>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="privacy">Privacy</TabsTrigger>
    <TabsTrigger value="advanced">Advanced</TabsTrigger>
  </Tabs>

  <TabsContent value="general" className="p-4">
    {/* General settings */}
  </TabsContent>
  <TabsContent value="privacy" className="p-4">
    {/* Privacy settings */}
  </TabsContent>
  <TabsContent value="advanced" className="p-4">
    {/* Advanced settings */}
  </TabsContent>
</TabsRoot>
```

Control the active tab with `value` + `onValueChange` instead of `defaultValue` when another part of the UI needs to read or set it.

### Variants and sizes

`variant` is `glass` (default), `filled`, or `transparent`; `size` is `small`, `medium` (default), or `large`. Both go on `Tabs`.

```tsx
<Tabs variant="filled" size="large">
  <TabsTrigger value="all">All</TabsTrigger>
  <TabsTrigger value="active">Active</TabsTrigger>
</Tabs>
```

### Icons and separators

Triggers accept arbitrary children; SVGs default to `size-4`. Place a `TabsSeparator` between triggers — it auto-hides next to the active or hovered tab.

```tsx
<Tabs variant="transparent">
  <TabsTrigger value="grid">
    <GridIcon />
    Grid
  </TabsTrigger>
  <TabsSeparator />
  <TabsTrigger value="list">
    <ListIcon />
    List
  </TabsTrigger>
</Tabs>
```

## Component API

### TabsRoot

Wraps Radix `Tabs.Root` — all Radix Tabs props are supported.

| Prop            | Type                         | Default        | Description                        |
| --------------- | ---------------------------- | -------------- | ---------------------------------- |
| `value`         | `string`                     | -              | Controlled active tab value        |
| `defaultValue`  | `string`                     | -              | Initial active tab (uncontrolled)  |
| `onValueChange` | `(value: string) => void`    | -              | Called when the active tab changes |
| `orientation`   | `"horizontal" \| "vertical"` | `"horizontal"` | Layout orientation                 |
| `className`     | `string`                     | -              | Additional classes                 |

### Tabs

The trigger row. Wraps Radix `Tabs.List`.

| Prop        | Type                                   | Default    | Description                     |
| ----------- | -------------------------------------- | ---------- | ------------------------------- |
| `variant`   | `"glass" \| "filled" \| "transparent"` | `"glass"`  | Visual style of the trigger row |
| `size`      | `"small" \| "medium" \| "large"`       | `"medium"` | Row height                      |
| `className` | `string`                               | -          | Additional classes              |

### TabsTrigger

A single tab. Wraps Radix `Tabs.Trigger`.

| Prop        | Type              | Default | Description                                         |
| ----------- | ----------------- | ------- | --------------------------------------------------- |
| `value`     | `string`          | -       | Tab identifier (required) — matches a `TabsContent` |
| `disabled`  | `boolean`         | `false` | Disable this tab                                    |
| `children`  | `React.ReactNode` | -       | Label content (text and/or icon)                    |
| `className` | `string`          | -       | Additional classes                                  |

### TabsContent

The panel for a tab. Wraps Radix `Tabs.Content`.

| Prop        | Type              | Default | Description                                         |
| ----------- | ----------------- | ------- | --------------------------------------------------- |
| `value`     | `string`          | -       | Tab identifier (required) — matches a `TabsTrigger` |
| `children`  | `React.ReactNode` | -       | Panel content                                       |
| `className` | `string`          | -       | Additional classes                                  |

### TabsSeparator

A thin divider placed between triggers (no props). Auto-hides adjacent to the active or hovered tab.

## Design System Rules

### ✅ Do

- Use descriptive, concise labels (1-2 words where possible).
- Pick the variant for the context: `glass` for toolbar segmented controls, `filled` for content areas and dialogs.
- Add content padding inside `TabsContent` (e.g. `className="p-4"`).
- Keep tab counts low (around 6-7 max) so labels stay readable.

### ❌ Don't

- Use tabs for sequential workflows (use a wizard) or for a binary on/off setting (use Switch).
- Bury critical actions inside a non-default tab where they may be missed.
- Mix unrelated content types into one tab set.
