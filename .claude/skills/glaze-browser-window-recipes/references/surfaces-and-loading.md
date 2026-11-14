# Surfaces, Loading, and Chrome

Examples assume:

```ts
import { BrowserWindow } from "@glaze/core/backend";
import { getPreloadPath, getWindowUrl } from "./windows/window-paths.js";
```

## Loading and lifecycle

- App-owned renderer page: load with `await win.loadURL(await getWindowUrl("your-window.html"))`; attach `webPreferences.preload` only when it needs `window.glazeAPI`.
- External page: load its `https://...` URL directly and omit the app preload unless a deliberately restricted bridge is required.
- A temporary self-contained HTML document used only for printing or capture may use `loadFile()` or a `file:` URL.
- Use `show: false` and `win.once("ready-to-show", () => win.show())` to prevent a white flash. Use `showInactive()` when it must not steal focus.
- An external page needs `titleBarStyle: "default"` for a native draggable title bar, or an app-owned wrapper with a top drag region.
- `window.glazeAPI` is intentionally absent on external pages without a preload. For an app-owned page, verify `webPreferences.preload` points to a built JS preload.

`toolbarStyle` accepts `"none"`, `"unified"` (default), or `"unifiedCompact"`. `frame: false` already implies `toolbarStyle: "none"`. Toolbar style does not hide traffic lights.

## Surface decision

Native appearance has separate layers:

- **Material:** `vibrancy` paints macOS translucency.
- **Shape:** the native frame supplies the rounded outline for normal panels.

For visible rectangular panels, HUDs, popovers, and palettes, keep `frame: true`. For frosted/glass surfaces, make renderer roots transparent and use native vibrancy. Do not cover it with root-level fills such as `bg-black/60`, and never fake it with CSS blur.

Use `frame: false` only when content itself is the shape: a circular timer, pass-through overlay, custom canvas/SVG shape, or fully renderer-drawn widget. Use `transparent: true`, no vibrancy, and deliberately implement clipping and shadow. Frameless native bounds are rectangular; pairing frameless mode with vibrancy produces square translucent corners.

## Native vibrancy recipe

```ts
const win = new BrowserWindow({
  windowKey: "vibrant-window",
  width: 520,
  height: 360,
  frame: true,
  titleBarStyle: "hidden",
  toolbarStyle: "none",
  backgroundColor: "#00000000",
  vibrancy: "sidebar",
  visualEffectState: "active",
  show: false,
  webPreferences: { preload: getPreloadPath() },
});

win.setWindowButtonVisibility(false);
win.once("ready-to-show", () => win.showInactive());
await win.loadURL(await getWindowUrl("vibrant-window.html"));
```

Use `visualEffectState: "active"` for a non-focusable HUD that should retain the active material; omit it when focus should drive material state. Supported materials include `"sidebar"`, `"hud"`, and `"popover"`; deprecated AppKit materials such as `"light"` and `"dark"` are intentionally unsupported.

Transparent renderer roots are required:

```html
<html class="no-background"></html>
```

```css
html,
body,
#root {
  background: transparent;
}
```

## Transparent custom-shaped overlay

Use only when the renderer owns the entire visible shape:

```ts
const win = new BrowserWindow({
  windowKey: "overlay",
  width: 420,
  height: 240,
  frame: false,
  transparent: true,
  backgroundColor: "#00000000",
  hasShadow: false,
  alwaysOnTop: true,
  show: false,
  webPreferences: { preload: getPreloadPath() },
});

win.once("ready-to-show", () => win.show());
await win.loadURL(await getWindowUrl("overlay-window.html"));
```

Use the same `no-background` HTML and transparent-root CSS shown above. Choose `hasShadow` deliberately. If a custom surface is opaque, check `transparent`, `backgroundColor`, and all renderer root backgrounds before changing anything else.

Example renderer-owned circular shape:

```tsx
import { Button } from "@glaze/core/components";

export function CustomShapeSurface() {
  return (
    <div className="drag-region size-full overflow-hidden rounded-full bg-control">
      <Button className="no-drag">Action</Button>
    </div>
  );
}
```

## Drag regions

- Prefer shared `.drag-region` and `.no-drag`; `<Toolbar>` already renders a drag region.
- Buttons, inputs, selects, links, and textareas are already non-draggable in shared styles.
- Without `<Toolbar>`, add a deliberate top drag region; do not rely on empty padding.
- Avoid a full-root drag region unless it cannot trap interactions.
- External pages need native default chrome or an app-owned wrapper.

If shared styles are unavailable:

```css
.drag-region {
  -webkit-app-region: drag;
  app-region: drag;
}

.no-drag {
  -webkit-app-region: no-drag;
  app-region: no-drag;
}
```

## Native window buttons

```ts
const win = new BrowserWindow({
  windowKey: "titled",
  width: 960,
  height: 720,
  frame: true,
  toolbarStyle: "unified",
  trafficLightPosition: { x: 18, y: 18 },
  show: false,
  webPreferences: { preload: getPreloadPath() },
});

win.setWindowButtonPosition({ x: 18, y: 18 });
win.setWindowButtonVisibility(false);
```

Hiding traffic lights is separate from toolbar style. Use constructor option `trafficLightPosition`; `windowButtonPosition` is deprecated. After creation use `setWindowButtonPosition()`; `setTrafficLightPosition()` is deprecated. If native buttons are hidden, provide equivalent custom actions when the design still requires them.

## Troubleshooting

- **Vibrancy is covered:** keep `frame: true`, vibrancy, `backgroundColor: "#00000000"`, `<html class="no-background">`, and transparent roots; remove full-window fills. Do not add `transparent: true` unless it is a custom-shaped/pass-through overlay.
- **Traffic lights remain:** `toolbarStyle: "none"` is insufficient; call `setWindowButtonVisibility(false)`.
- **Window does not drag:** add a top drag region or `<Toolbar>`; nested controls need `.no-drag`.
- **Header controls do not click:** they inherited drag behavior; add `.no-drag` to the control or its interactive container.
- **Transparent mode looks wrong:** remove unintended vibrancy/background colors and decide whether the overlay keeps a shadow.
- **App page has no `window.glazeAPI`:** check its preload path and built preload output.
