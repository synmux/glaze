# ProgressiveBlur

A decorative overlay that applies a graduated backdrop blur over the edge of a scrollable region, fading content out behind a soft frosted band instead of cutting it off at a hard line. It is the right choice for scroll-edge fades on lists, feeds, and document views where you want content to dissolve rather than clip.

## When to Use

- **Scroll-edge fade**: soften the top and/or bottom of a scrollable container so content fades under a header, toolbar, or beyond the viewport.
- **Overlay legibility**: blur imagery beneath floating controls (a caption bar over a photo, a button row over a hero image).
- Use a plain CSS `mask` / linear-gradient fade-out instead when you only need to fade opacity and do not want the frosted blur effect.

## Required Structure

`ProgressiveBlur` is `position: absolute` and `pointer-events-none`, so it must live inside a `position: relative` (or otherwise positioned) container. It pins itself to the edge(s) of that container — it does not render or wrap the scrolling content itself, so place it as a sibling after the content.

```tsx
<div className="relative h-[300px]">
  <div className="h-full overflow-y-auto">{/* scrolling content */}</div>
  <ProgressiveBlur />
</div>
```

## Usage Patterns

### Basic

Defaults to a blur band on the bottom edge, 30% of the container's height:

```tsx
<ProgressiveBlur />
```

### Position

`position` pins the band and orients its fade. Use `"both"` to blur top and bottom — the band then spans the full container height and fades in from both edges (`height` is ignored).

```tsx
<ProgressiveBlur position="top" />
<ProgressiveBlur position="bottom" />
<ProgressiveBlur position="both" />
```

### Custom height and blur ramp

`height` sets how far the band reaches into the container; `blurLevels` is the per-layer blur in px, from the content-facing edge (sharpest) to the outer edge (most blurred). More entries means a smoother ramp.

```tsx
<ProgressiveBlur height="80px" blurLevels={[1, 4, 8, 12]} />
```

### Blurring an overlay header

Pin a blurred band to the top so a sticky header reads cleanly over scrolling content:

```tsx
<div className="relative h-[400px] overflow-hidden">
  <ProgressiveBlur position="top" height="64px" />
  <div className="absolute inset-x-0 top-0 z-20 flex h-16 items-center px-4">
    <Text className="text-strong">Activity</Text>
  </div>
  <div className="h-full overflow-y-auto pt-16">{/* feed items */}</div>
</div>
```

## Component API

### ProgressiveBlur

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `position` | `"top" \| "bottom" \| "both"` | `"bottom"` | Which edge the band pins to and the direction it fades. |
| `height` | `string` | `"30%"` | How far the band reaches into the container (CSS length). Ignored when `position="both"` (spans full height). |
| `blurLevels` | `number[]` | `[0.5, 1, 2, 3, 4]` | Per-layer backdrop blur in px, from content-facing edge to outer edge. |
| `className` | `string` | - | Additional classes on the band container. |
| `children` | `React.ReactNode` | - | Accepted by the props type but not rendered. |

## Design System Rules

### ✅ Do

- Place inside a positioned (`relative`) container so the absolute band anchors correctly.
- Match `height` to the content rhythm — a band roughly the height of one or two rows usually reads best.
- Keep `blurLevels` ascending for a natural ramp from sharp to soft.

### ❌ Don't

- Render content inside it expecting it to show — it is `pointer-events-none` and ignores `children`.
- Rely on it to fully hide content; it is a soft fade, not an opaque cover.
- Stack a heavy blur ramp over interactive controls that need to stay readable.
