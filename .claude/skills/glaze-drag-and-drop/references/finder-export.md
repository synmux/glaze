# App-to-Finder Export

Create the exported file first, then start the native drag in the backend through `WebContents.startDrag()`.

```typescript
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { app, ipcMain, nativeImage, WebContents } from "@glaze/core/backend";

ipcMain.handle("drag:startFileExport", async (_event, params: { fileName: string; content: string }) => {
  const webContents = new WebContents("main");
  const fileName = path.basename(params.fileName);
  if (!fileName || fileName === "." || fileName === "..") {
    throw new Error("A valid export file name is required");
  }
  const filePath = path.join(app.getPath("temp"), fileName);
  await fs.writeFile(filePath, params.content, "utf-8");

  let icon;
  try {
    icon = await nativeImage.createThumbnailFromPath(filePath, { width: 64, height: 64 });
  } catch {
    icon = nativeImage.createEmpty();
  }

  webContents.startDrag({ file: filePath, icon });
});
```

Trigger it early enough for the native drag to begin:

```tsx
import { Button } from "@glaze/core/components";

function ExportHandle({ item }: { item: { name: string; content: string } }) {
  const handleMouseDown = () => {
    void window.glazeAPI.glaze.ipc.invoke("drag:startFileExport", {
      fileName: item.name,
      content: item.content,
    });
  };

  return (
    <Button onMouseDown={handleMouseDown} variant="transparent" className="cursor-grab select-none">
      Drag to export
    </Button>
  );
}
```

Prefer `onMouseDown` or `onPointerDown` so backend preparation begins before browser drag behavior. Provide a normal keyboard-accessible Export action as an alternative because native drag itself is pointer-driven. Generate the drag icon from the validated output file and fall back to `createEmpty()`.
