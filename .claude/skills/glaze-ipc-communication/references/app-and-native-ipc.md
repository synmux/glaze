# App and Native IPC

## App-specific request/response

Register a feature-prefixed handler in the backend:

```typescript
// main/handlers/data.ts
import { ipcMain } from "@glaze/core/backend";

ipcMain.handle("data:fetch", async (_event, params: { id: string }) => {
  return { id: params.id, value: "example" };
});
```

Invoke it through the preload surface:

```typescript
const result = await window.glazeAPI.glaze.ipc.invoke("data:fetch", { id: "123" });
```

Do not use SDK-owned prefixes such as `clipboard:`, `dialog:`, `shell:`, `screen:`, `nativeTheme:`, `Menu:`, `systemPreferences:`, `location:`, or `glaze:`. Duplicate registration can crash startup.

## Backend notifications

Use a notification when backend state changes after the renderer's initial query. Subscribe through `window.glazeAPI.glaze.ipc.onNotification`, validate the payload shape, and always return the unsubscribe function from the owning effect's cleanup.

Keep the initial query as the source of truth so a renderer mounting after a notification can still recover current state.

## Native APIs

Use the safe APIs already exposed on `window.glazeAPI`:

```typescript
const openResult = await window.glazeAPI.dialog.showOpenDialog({
  title: "Select images",
  filters: [
    { name: "Images", extensions: ["jpg", "png", "gif"] },
    { name: "All Files", extensions: ["*"] },
  ],
  properties: ["openFile", "multiSelections"],
});

if (!openResult.canceled) {
  const selectedPaths = openResult.filePaths;
}

const saveResult = await window.glazeAPI.dialog.showSaveDialog({
  title: "Save document",
  filters: [{ name: "Text Files", extensions: ["txt"] }],
});

if (!saveResult.canceled && saveResult.filePath) {
  const outputPath = saveResult.filePath;
}

window.glazeAPI.shell.beep();
```

Clipboard, external URL, path-opening, file, and screen APIs require deliberate preload exposure. Load [preload-security.md](preload-security.md) before enabling them.
