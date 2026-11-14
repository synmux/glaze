# Preload Security

Glaze uses context isolation: the preload exposes a controlled API to the renderer through `window.glazeAPI`. The exposed surface remains callable if renderer content or a renderer dependency is compromised.

## Default exposure

Safe defaults include:

- User-mediated native dialogs.
- `shell.beep`.
- App-specific `glaze.ipc` wrappers whose handlers you control.

Treat these as sensitive and expose them only when required:

- Clipboard reads and writes.
- `shell.openExternal` and `shell.openPath`.
- Arbitrary file reads.
- Screen information or capture.

## Add only the required method

Edit the existing `glazeAPI` object in `renderer/preload.ts` and expose a narrow wrapper rather than a generic bridge. The omitted entries below remain unchanged:

```typescript
import { contextBridge, ipcRenderer } from "@glaze/core/preload";

const glazeAPI = {
  // ...existing safe APIs...
  shell: {
    // ...existing shell methods...
    // Fixed-purpose wrapper: the renderer cannot choose an arbitrary URL.
    openDocumentation: () => ipcRenderer.invoke("shell:openExternal", "https://docs.example.com"),
  },
  // Expose only the clipboard direction the feature needs.
  clipboard: {
    writeText: (text: string) => ipcRenderer.invoke("clipboard:writeText", text),
  },
  // ...existing glaze.ipc wrapper...
};

contextBridge.exposeInMainWorld("glazeAPI", glazeAPI);
```

Do not expose a general shell, file, or arbitrary-channel function for a feature that needs one fixed action. Validate URLs, paths, and other user-controlled arguments again in the backend/native handler.

Extend `renderer/types.d.ts` for every custom property. Base types come from `@glaze/core/global.d.ts`; do not redeclare the entire API.

## Review checklist

- Can the renderer use the method to read unrelated data, launch arbitrary paths, or navigate to an unsafe URL?
- Is a generic argument avoidable through a feature-specific wrapper?
- Does the backend validate the argument rather than trusting the preload?
- Is the method still needed, or can its exposure be removed?
