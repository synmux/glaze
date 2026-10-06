# Inspector

Primitives for Apple-style inspector panels — the dense side panel of labeled controls you see in Xcode (File inspector), Pages/Keynote (Format inspector), and Figma. `Inspector` bakes in a `ScrollArea`, an optional toolbar, and standard panel padding; `InspectorSection` groups rows under a title; `InspectorRow` aligns labels across the panel via a shared label column. Designed to drop into a `SplitView`'s `inspector` slot.

## When to Use

- **SplitView inspector slot**: properties of whatever is selected in the main view.
- **Dense creative-tool UIs**: format, layout, style, appearance controls.
- **Object property panels**: many small labeled controls that should visually align.
- Use `Field` / `FieldSet` instead for preference/settings screens (roomy, one-topic-per-row with descriptions). Use `Sidebar` for navigation, not properties.

## Usage Patterns

### Basic

`Inspector` handles the `ScrollArea`, toolbar, and content padding. Drop it straight into `SplitView.inspector`. Labeled rows align on a shared column; unlabeled rows span full width.

```tsx
import {
  Inspector,
  InspectorSection,
  InspectorRow,
  SplitView,
  NumberInput,
  ColorWell,
  Switch,
  Select,
} from "@glaze/core/components";

<SplitView
  inspector={
    <Inspector title="Format" actions={<SplitView.InspectorToggle />}>
      <InspectorSection title="Font">
        <InspectorRow>
          <FontPicker /> {/* full-width, no label */}
        </InspectorRow>
        <InspectorRow label="Color">
          <ColorWell value={color} onChange={setColor} size="small" />
          <Switch />
        </InspectorRow>
      </InspectorSection>

      <InspectorSection title="Spacing" collapsible defaultOpen={false}>
        <InspectorRow label="Line">
          <Select defaultValue="single">…</Select>
        </InspectorRow>
      </InspectorSection>
    </Inspector>
  }
>
  <MainContent />
</SplitView>;
```

`title` is the panel's domain (`"Format"`, `"Layer"`, `"File"`) — never the app name. Omit it if the panel has no meaningful label. Buttons passed to `actions` are auto-styled `glass` / `large` and SVG icon children auto-size to `size-5`; the most common value is `<SplitView.InspectorToggle />` (it portals to the SplitView frame's trailing edge unless `pinned={false}`). For a hand-rolled toolbar or no scroll container, use the `toolbar` and `scrollEnabled={false}` escape hatches.

### Header actions

A trailing `actions` slot on a section header — e.g. a `+` button that adds a layer (Figma fill/stroke pattern). It sits before the chevron when the section is also collapsible, and its clicks are stopped from toggling the section.

```tsx
<InspectorSection
  title="Fill"
  collapsible
  actions={
    <Button variant="transparent" radius="rounded" iconOnly size="small" aria-label="Add fill" onClick={addFill}>
      <PlusIcon className="size-3.5" />
    </Button>
  }
>
  {fills.map((f, i) => (
    <InspectorRow key={i}>…</InspectorRow>
  ))}
</InspectorSection>
```

### Multi-control rows and column alignment

Drop multiple controls into one unlabeled `InspectorRow` and use `className="flex-1"` to split space (the row supplies a 6px gap). To keep a single control aligned under the second column of a previous two-control row, add an `aria-hidden` spacer:

```tsx
<InspectorRow>
  <NumberInput value={x} onValueChange={setX} unit="x" className="flex-1" />
  <NumberInput value={y} onValueChange={setY} unit="y" className="flex-1" />
</InspectorRow>
<InspectorRow>
  <span className="flex-1" aria-hidden />
  <NumberInput value={rotation} unit="°" className="flex-1" />
</InspectorRow>
```

### Vertical rows and slider rows

Use `orientation="vertical"` when a labeled control needs the full row width (multi-option `SegmentedControl`, wide clusters) — the label stacks above. For Lightroom/Photos-style adjustment panels, skip the row label and put the label inside the slider via `startContent` / `endContent` so the slider becomes the entire row.

```tsx
<InspectorRow label="Alignment" orientation="vertical">
  <SegmentedControl size="small" className="w-full">
    <SegmentedControlItem value="left">…</SegmentedControlItem>
    <SegmentedControlItem value="center">…</SegmentedControlItem>
  </SegmentedControl>
</InspectorRow>

<InspectorRow>
  <Slider variant="filled" size="small" value={[exposure]} onValueChange={(v) => setExposure(v[0])} min={-5} max={5} step={0.1} origin={0} ticks startContent="Exposure" endContent={(v) => signedDecimal(v)} className="flex-1" />
</InspectorRow>
```

### Untitled groups and non-row content

`InspectorSection` without a `title` is a valid logical group with standard top padding — useful for a trailing checkbox or single-control section. Section children participate in its `flex flex-col gap-2`, so non-row content (a swatch grid, gradient bar) drops in directly without an `InspectorRow` wrapper.

```tsx
<InspectorSection title="Background">
  <InspectorRow>
    <SegmentedControl …>…</SegmentedControl>
  </InspectorRow>
  <div className="grid grid-cols-3 gap-1.5">
    {gradients.map((g, i) => (
      <button key={i} className="aspect-[5/3] rounded-md …" style={{ background: g }} />
    ))}
  </div>
</InspectorSection>
```

## Label Column Alignment

All labeled rows share one label column width via the `--inspector-label-col` CSS variable (default `88px`). Override on any ancestor — standard place is `Inspector`:

```tsx
<Inspector style={{ "--inspector-label-col": "76px" }}>…</Inspector>
```

Unlabeled rows span full width and don't participate in the grid — this is how a full-width `FontPicker` coexists with labeled rows in one section.

## Styling Overrides

Stable `data-slot` attributes for panel-specific tweaks without forking:

- `[data-slot="inspector"]` — top-level padded wrapper.
- `[data-slot="inspector-section"]` — section wrapper.
- `[data-slot="inspector-section-header"]` / `[data-slot="inspector-section-trigger"]` — header row (non-collapsible vs collapsible).
- `[data-slot="inspector-section-actions"]` — the `actions` slot in the header.
- `[data-slot="inspector-row"]` — every row; carries `data-orientation` of `full`, `labeled`, or `vertical`.
- `[data-slot="inspector-row-label"]` — the label cell. Target it for e.g. Xcode-style right-aligned labels (`[&_[data-slot=inspector-row-label]]:text-right`).

## Component API

### Inspector

Top-level wrapper. Bakes in `ScrollArea` + optional `Toolbar` + content padding.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | - | Rendered as a `ToolbarTitle`. |
| `actions` | `ReactNode` | - | Trailing toolbar buttons; auto-styled `glass`/`large`. Most common: `<SplitView.InspectorToggle />`. |
| `toolbar` | `ReactNode` | - | Escape hatch for a fully custom `<Toolbar>`. Overrides `title` and `actions`. |
| `footer` | `ReactNode` | - | Forwarded to `ScrollArea`. |
| `scrollEnabled` | `boolean` | `true` | Disable to skip the inner `ScrollArea`. |
| `className`, `style` | - | - | Forwarded to the inner `[data-slot="inspector"]` div. Set `--inspector-label-col` via `style`. |

### InspectorSection

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | - | Section header. Omit for an unlabeled grouping container. |
| `actions` | `ReactNode` | - | Trailing header slot, before the chevron when collapsible. Clicks don't bubble to the trigger. |
| `collapsible` | `boolean` | `false` | Wrap in a Collapsible with a chevron trigger. |
| `defaultOpen` | `boolean` | `true` | Initial open state (uncontrolled). |
| `open`, `onOpenChange` | `boolean`, `(open: boolean) => void` | - | Controlled collapse state. |
| `className`, …`section` props | - | - | Forwarded to the `<section>`. |

### InspectorRow

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | - | Row label. With a label, grid-aligned; without, flex full-width. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Only meaningful with a `label`. `"vertical"` stacks the label above a full-width control. |
| `className`, `style`, …`div` props | - | - | Forwarded to the row. Multiple children flex horizontally with a 6px gap. |

### InspectorRowLabel

Exported for custom row layouts that need the standard label typography (`text-small text-secondary truncate`) outside an `InspectorRow`. Accepts all `<span>` props.

## Design System Rules

### ✅ Do

- Pair `InspectorRow` with compact controls: `size="small"` on `NumberInput`, `ColorWell`, `SegmentedControl`, `Select`.
- Keep labels short (1–2 words) — they share a fixed column and long labels truncate.
- Group related rows under one `InspectorSection` rather than chaining unlabeled rows.
- Use `actions` for header-level affordances (add layer, more options).

### ❌ Don't

- Don't use `InspectorRow` for settings-style rows with a `description`. Use `Field` for that.
- Don't add per-row actions (✕, •••). If a row needs an action, put it in the control (right) cell — there's no label-side hover-action slot.
- Don't nest `InspectorSection` inside `InspectorSection`. Flatten with more sections.
- Don't mix icons and text in a single toolbar button — prefer icon-only or text-only.
