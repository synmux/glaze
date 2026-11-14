# Custom Styling and Overlays

Use custom markup only after confirming the design system has no equivalent.

## Native visual language

- Avoid web-style bordered, shadowed cards. Separate content with layout, lists, groups, headings, `Separator`, panels, or tabs.
- For a bounded custom region, prefer a separator, a recessed `bg-well` region, or a `border-field` group only when independently interactive.
- If a custom `div` combines shadow, border, large radius, and generous padding, re-check the component catalog.

## Typography and color

- Render text with `Text` and a role-based variant. For inherited typography, use matching utilities such as `text-regular`, `text-strong`, `text-small`, or `text-heading1`.
- Do not combine raw size utilities with manual font weights. Use `tabular-nums` for counters, timers, and prices.
- Use semantic text roles: `text-primary`, `text-secondary`, `text-tertiary`, `text-quaternary`, `text-accent`, and `text-support-*`.
- Bare palette classes such as `text-green`, `bg-red`, or `border-blue` do not exist in generated CSS.
- Use semantic surfaces (`bg-well`, `bg-control*`, `bg-popover`) and borders (`border-separator`, `border-field`, `border-secondary`).
- Do not hardcode white/black or add `dark:` variants to semantic tokens.

## Radius and spacing

- Let components keep their own radii.
- Use radius by role: `rounded-pill`, `rounded-full` for true circles, `rounded-control`, `rounded-panel`, `rounded-popover`, `rounded-dialog`, or `rounded-card`.
- Space flex/grid children with parent `gap-*`, not repeated child margins.
- Fluid/truncated children need `min-w-0`; icons and fixed-width children need `shrink-0`.
- Use `size-*` when width equals height and avoid redundant or conflicting classes.

## Scroll, sticky, and overlays

- Keep one scroll container between a sticky element and the viewport. Avoid `overflow-hidden`, `overflow-clip`, or `isolate` on ancestors of sticky children.
- Use `ScrollArea scrollbars="vertical"` when a child owns horizontal scrolling.
- Z-index roles: `z-30` window chrome, `z-20` scroll toolbars, `z-10` sticky headers, `z-auto` content.
- Use design-system overlays because they portal to the document root. Inline absolute overlays can be clipped or trapped below sibling stacking contexts.
- If opaque content appears transparent, inspect `document.elementsFromPoint(...)` before changing colors. Fix paint order, portaling, or stacking context instead of increasing opacity.
