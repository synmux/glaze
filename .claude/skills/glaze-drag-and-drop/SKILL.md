---
name: glaze-drag-and-drop
description: Implement drag-and-drop workflows in Glaze apps, including dropping files from Finder into the app, dragging exported files from the app to Finder, and in-app drag/reorder interactions. Use when building drop zones, drag handles, file import/export UX, or any DnD behavior.
---

# Glaze Drag and Drop

Choose the smallest pattern that matches the direction:

1. **Finder → app:** import native files into renderer UI.
2. **App → Finder:** materialize a file and start a native export drag from the backend.
3. **App → app:** reorder or move items within renderer state.

## Non-negotiable rules

- Finder imports resolve paths with `window.glazeAPI.webUtils.getPathForFile(file)` in the renderer's drop handler. Do not proxy dropped `File` objects across preload or IPC.
- Always call `preventDefault()` in `dragover`; nested zones that exclusively own a drop also stop propagation across the drag lifecycle.
- Finder exports require a real file on disk before `WebContents.startDrag()` runs.
- Use `new WebContents("main")` for export drags from the main window.
- Keep file associations and native open dialogs as fallback path-based flows.

## Read only the file(s) for the task

- Importing files from Finder, resolving dropped paths, or handling nested drop zones: read [finder-import.md](references/finder-import.md).
- Dragging generated or exported files from the app into Finder: read [finder-export.md](references/finder-export.md).
- Reordering or moving items inside renderer UI: read [internal-reorder.md](references/internal-reorder.md).
- Diagnosing missing paths, stale preload wiring, drop events, export failures, or active-window errors: read [troubleshooting.md](references/troubleshooting.md) plus the relevant direction reference.

## Verification

- The selected direction uses its matching renderer/backend boundary.
- Dropped files never rely on a browser-only `file.path`.
- Exported files exist before the native drag begins.
- Nested zones produce one import, not duplicate parent and child actions.
- The app has a fallback when a source cannot provide a native path.

Use `glaze-file-associations` for double-click/Open With registration and `glaze-native-images` for native file icons or thumbnails.
