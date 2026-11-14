# Window Patterns

These recipes assume app-owned pages use `getWindowUrl()` and attach `getPreloadPath()` only when they need `window.glazeAPI`. For surface/chrome decisions, read [surfaces-and-loading.md](surfaces-and-loading.md).

## Accessory and menu-bar apps

Use accessory activation only for menu-bar, background monitor, HUD, overlay, or global-shortcut apps whose normal state should stay out of Dock and Cmd+Tab:

```json
{
  "appConfig": {
    "macOS": {
      "activationPolicy": "accessory"
    }
  }
}
```

Do not use it for primary-window, document, editor, or settings-first apps. If an accessory app intentionally needs a temporary Dock tile for About or Settings, call `await app.dock.show()` before showing/focusing it and `app.dock.hide()` when it closes.

For simple commands use a native tray menu. For interactive UI, position a compact custom window from Tray click bounds or `tray.getBounds()`. Do not substitute a persistent top-right HUD unless the user requested an overlay/HUD. Search, text input, and keyboard navigation require a focusable panel that closes on blur or Escape.

Do not unconditionally reopen hidden UI from `app.on("activate", ...)`; track user intent so activation does not undo a Hide action.

## Floating utility

```ts
const win = new BrowserWindow({
  windowKey: "utility",
  width: 360,
  height: 420,
  frame: true,
  alwaysOnTop: true,
  hiddenInMissionControl: true,
  visibleOnAllWorkspaces: true,
  hasShadow: true,
  show: false,
  webPreferences: { preload: getPreloadPath() },
});

win.once("ready-to-show", () => win.show());
await win.loadURL(await getWindowUrl("utility-window.html"));
```

Optional follow-ups:

- `win.setAlwaysOnTop(true, "floating")` for a stronger floating level.
- `win.setFocusable(false)` only for a passive overlay.
- `win.setSkipTaskbar(true)` to keep it out of Dock/task switcher.

Backend `screen` getters such as `screen.getPrimaryDisplay()` are synchronous; use legacy `*Async()` aliases only when specifically needed. Position within a `workArea` using both origin and size (`workArea.x + ...`, `workArea.y + ...`).

## Click-through overlay

This must also follow the custom-shaped transparent surface rules.

```ts
const win = new BrowserWindow({
  windowKey: "pass-through",
  width: 500,
  height: 300,
  frame: false,
  transparent: true,
  backgroundColor: "#00000000",
  alwaysOnTop: true,
  show: false,
  webPreferences: { preload: getPreloadPath() },
});

win.setIgnoreMouseEvents(true, { forward: true });
win.once("ready-to-show", () => win.show());
await win.loadURL(await getWindowUrl("passthrough-window.html"));
```

`forward` is accepted for API compatibility but does not map to a distinct native mode on macOS. Disable ignored mouse events before expecting drag, hover, or clicks to work.

## Document window

```ts
const win = new BrowserWindow({
  windowKey: "editor",
  width: 1000,
  height: 720,
  title: "Notes",
  show: false,
  webPreferences: { preload: getPreloadPath() },
});

win.setRepresentedFilename("/Users/me/Documents/notes.md");
win.setDocumentEdited(true);
win.accessibleTitle = "Notes document window";
win.once("ready-to-show", () => win.show());
await win.loadURL(await getWindowUrl("editor-window.html"));
```

Use `accessibleTitle` when the visible title is too short or ambiguous for assistive technologies.

## Parent window and modal sheet

```ts
const parent = new BrowserWindow({
  windowKey: "editor",
  width: 1000,
  height: 720,
  title: "Editor",
  show: false,
  webPreferences: { preload: getPreloadPath() },
});

const child = new BrowserWindow({
  windowKey: "editor-inspector",
  parent,
  modal: true,
  width: 420,
  height: 320,
  title: "Inspector",
  show: false,
  webPreferences: { preload: getPreloadPath() },
});

parent.once("ready-to-show", () => parent.show());
await parent.loadURL(await getWindowUrl("editor-window.html"));
child.once("ready-to-show", () => child.show());
await child.loadURL(await getWindowUrl("inspector-window.html"));
```

Omit `modal: true` for a regular attached child. `child.setParentWindow(null)` detaches it. `child.getParentWindow()`, `parent.getChildWindows()`, and `child.isModal()` report the current relationship.
