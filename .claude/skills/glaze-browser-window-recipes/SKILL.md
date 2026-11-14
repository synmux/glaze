---
name: glaze-browser-window-recipes
description: Recipes for creating or configuring Glaze BrowserWindows. Use before writing or changing new BrowserWindow(...), loadURL targets, dragging/chrome, external web page windows, modal/floating/frameless/document windows, or window options.
---

# Glaze BrowserWindow Recipes

Use this skill before writing or changing any `new BrowserWindow(...)`.

Create and manage windows in the backend with `BrowserWindow` from `@glaze/core/backend`; use stable `windowKey` values. Renderer work should stay focused on content, transparent roots, and drag-region markup.

## Non-negotiable decisions

- **Normal or translucent panel/window:** keep `frame: true`. For frosted/glass surfaces use native `vibrancy`, transparent renderer roots, `titleBarStyle: "hidden"`, and `setWindowButtonVisibility(false)` when needed.
- **Custom-shaped or pass-through overlay only:** use `frame: false`, `transparent: true`, `backgroundColor: "#00000000"`, and no `vibrancy`. The renderer must deliberately draw and clip every visible pixel.
- Never use CSS/WebKit blur (`backdrop-filter`, `-webkit-backdrop-filter`, `backdrop-blur-*`) as a window background.
- App-owned pages load through `getWindowUrl()` and receive the preload only when they need `window.glazeAPI`. External pages normally receive no app preload.
- Use `show: false` and show on `ready-to-show`.
- Every movable window needs an explicit drag affordance. Interactive descendants of a drag region must opt out with `.no-drag`.
- When adding a renderer subdirectory, add its `@source` entry to `renderer/styles.css`.
- Display `workArea` positioning must include the origin (`workArea.x`/`y`), not only width/height.

## Read only the file(s) for the task

- Creating a normal app-owned window, loading an external page, configuring preload, lifecycle, dragging, titlebar buttons, vibrancy, transparency, frameless shapes, or troubleshooting appearance: read [surfaces-and-loading.md](references/surfaces-and-loading.md).
- Building an accessory/menu-bar app, floating utility, click-through overlay, document window, or parent/modal window: read [window-patterns.md](references/window-patterns.md). Also read `references/surfaces-and-loading.md` only if changing its surface/chrome.
- Exporting a paginated PDF with a hidden window: read [pdf-export.md](references/pdf-export.md).

## Quick task map

- Native HUD/popover/palette → `surfaces-and-loading.md` → native vibrancy recipe.
- Transparent circle/canvas/widget → `surfaces-and-loading.md` → custom-shaped overlay recipe.
- Third-party `https://` page → `surfaces-and-loading.md` → external loading and dragging.
- Menu-bar panel or Dock-less background app → `window-patterns.md` → accessory apps.
- Always-on-top inspector or passive overlay → `window-patterns.md`.
- File-backed editor or attached sheet → `window-patterns.md`.
- Multi-page HTML-to-PDF → `pdf-export.md`.

For exact API signatures, consult the runtime SDK symbol map/reference. Use `glaze-component-patterns` for `<Toolbar>` and design-system component usage.
