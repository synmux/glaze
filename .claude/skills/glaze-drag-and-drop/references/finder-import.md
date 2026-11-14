# Finder-to-App Import

Use standard renderer drag events. Resolve native paths in the page-world drop handler with `window.glazeAPI.webUtils.getPathForFile(file)`.

```tsx
import { useCallback } from "react";

const handleDrop = useCallback((event: React.DragEvent) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (!file) return;

  const filePath = window.glazeAPI.webUtils.getPathForFile(file);
  const reader = new FileReader();
  reader.onload = (loadEvent) => {
    const content = loadEvent.target?.result as string;
    // Update state with the file name, path, and content.
  };
  reader.readAsText(file);
}, []);
```

## Path contract

- Native Finder drops normally return a filesystem path.
- Non-file drops, non-Finder sources, and browser-only contexts can return an empty string.
- Path resolution depends on current host and preload support.
- Do not expose the dropped `File` through a custom bridge; it cannot be serialized safely across that boundary.
- For large or binary files, send the resolved path to a narrow backend handler instead of reading the whole file into renderer memory.
- Use a native open dialog or file association as a path-based fallback.

## Nested zones

If a child drop zone exclusively owns a drop, call `stopPropagation()` in its `dragenter`, `dragleave`, `dragover`, and `drop` handlers. Otherwise both child and parent may import the same file.
