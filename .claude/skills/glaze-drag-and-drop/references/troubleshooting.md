# Drag-and-Drop Troubleshooting

## Dropped file has no path

- Confirm the source is Finder rather than an in-page or browser-only drag.
- Rebuild and fully restart after SDK/runtime or preload changes.
- Older apps may have stale `renderer/preload.ts` wiring. Verify it imports `createWebUtilsAPI` from `@glaze/core/preload`, creates the API, and exposes `webUtils` through `window.glazeAPI`.
- Do not add another bridge for dropped `File` objects.
- Offer `dialog.showOpenDialog` or file associations as fallback.

## Drop never fires

Ensure `onDragOver` calls `preventDefault()`.

## Drag-out does nothing

- Confirm the file exists before `startDrag()`.
- Use `new WebContents("main")` for the main window.
- Ensure an explicit icon path exists, or fall back to a generated thumbnail or empty native image.

## No active window

Do not discover the main window through `BrowserWindow.getAllWindows()`. Address its web contents directly with `new WebContents("main")`.

## Both Open With and drag/drop are required

Use this skill for drag behavior and `glaze-file-associations` for macOS registration and the `open-file` lifecycle.
