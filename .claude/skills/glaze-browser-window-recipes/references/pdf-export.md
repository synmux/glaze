# Paginated PDF Export

Use `webContents.printToPDF()` for a local, multi-page PDF that preserves HTML text and images. Prefer a dedicated export document over temporarily hiding the live UI.

```ts
import * as fs from "fs";
import { pathToFileURL } from "url";

import { BrowserWindow } from "@glaze/core/backend";

const printWindow = new BrowserWindow({
  windowKey: "pdf-export",
  show: false,
  width: 794,
  height: 1123,
});

try {
  await printWindow.loadURL(pathToFileURL(htmlPath).href);
  await Promise.race([
    printWindow.webContents
      .executeJavaScript(
        `
      Promise.all([
        document.fonts?.ready,
        ...Array.from(document.images, (image) =>
          image.complete && image.naturalWidth > 0
            ? Promise.resolve()
            : image.decode().catch(() => undefined)
        ),
      ])
    `,
      )
      .catch(() => undefined),
    new Promise((resolve) => setTimeout(resolve, 2000)),
  ]);

  const pdf = await printWindow.webContents.printToPDF({
    pageSize: "A4",
    printBackground: true,
    margins: { top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 },
  });
  fs.writeFileSync(outputPath, pdf);
} finally {
  if (!printWindow.isDestroyed()) printWindow.destroy();
}
```

## Required constraints

- A self-contained local HTML document is a supported exception to `getWindowUrl()` and needs no app preload.
- Resolve custom image protocols and vault-relative paths before loading. Data URLs are reliable for self-contained exports.
- Build a continuous export-only document with stable block sizing. The current macOS paginator slices rendered flow into pages and does not honor `@page`, `break-before`, or `break-after`.
- Hidden windows may throttle `requestAnimationFrame`; reload can invalidate page scripts. Do not use animation frames as the readiness signal. Keep font/image readiness best-effort behind a backend timeout.
- Keep generation in the backend behind narrow IPC. Never expose unrestricted filesystem paths or `BrowserWindow` access to the renderer.

## Validation

Do not treat a returned buffer or toast as proof. Export content longer than three pages and inspect page count, first/last markers, and images. Also export a short document from a fresh hidden window taller than one paper page, include fixed/sticky chrome, and verify there is no blank trailing page.

Use simple ASCII marker tokens without punctuation for automated placement checks. Quartz may render Cyrillic/CJK correctly while extracting equivalent-looking but different Unicode code points. Verify those glyphs in rendered page images and report extraction fidelity separately; an exact `pdftotext` mismatch is not automatically a rendering or pagination failure.
