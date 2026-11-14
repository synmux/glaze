# JSON, UI State, and Secrets

- [localStorage for UI preferences](#localstorage-for-ui-preferences)
- [JSON files for durable app data](#json-files-for-durable-app-data)
- [Reusable store shape](#reusable-store-shape)
- [safeStorage for secrets](#safestorage-for-secrets)
- [Suggested file organization](#suggested-file-organization)

## localStorage for UI preferences

Use renderer `localStorage` only for presentation preferences such as panel sizes, selected tabs, filters, and sort order:

```typescript
localStorage.setItem("sidebar-width", "280");
const sidebarWidth = localStorage.getItem("sidebar-width") ?? "250";
```

Keep user-created content and business data in the backend.

## JSON files for durable app data

Use `app.getPath("userData")` for settings, content, history, and caches. Treat only a missing file as first-run state.

```typescript
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { app } from "@glaze/core/backend";

function isFileNotFound(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

class SettingsService {
  private cache: Record<string, unknown> = {};
  private settingsPath: string | null = null;
  private saveQueue: Promise<void> = Promise.resolve();

  private async getSettingsPath(): Promise<string> {
    if (!this.settingsPath) {
      const userDataPath = app.getPath("userData");
      await fs.mkdir(userDataPath, { recursive: true });
      this.settingsPath = path.join(userDataPath, "settings.json");
    }
    return this.settingsPath;
  }

  async load(): Promise<void> {
    try {
      const data = await fs.readFile(await this.getSettingsPath(), "utf-8");
      const parsed: unknown = JSON.parse(data);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("settings.json must contain an object");
      }
      this.cache = parsed as Record<string, unknown>;
    } catch (error) {
      if (!isFileNotFound(error)) throw error;
      this.cache = {};
    }
  }

  get<T>(key: string, defaultValue?: T): T | undefined {
    return (this.cache[key] as T) ?? defaultValue;
  }

  async set(key: string, value: unknown): Promise<void> {
    this.cache[key] = value;
    const snapshot = { ...this.cache };
    const save = this.saveQueue
      .catch(() => undefined)
      .then(async () => {
        const filePath = await this.getSettingsPath();
        const tempPath = `${filePath}.${process.pid}.tmp`;
        try {
          await fs.writeFile(tempPath, JSON.stringify(snapshot, null, 2));
          await fs.rename(tempPath, filePath);
        } finally {
          await fs.rm(tempPath, { force: true });
        }
      });
    this.saveQueue = save;
    await save;
  }
}

export const settingsService = new SettingsService();
```

For arrays or richer objects, validate the parsed shape before assigning it. Do not catch `JSON.parse`, permission, or disk errors as though the file did not exist.

## Reusable store shape

A reusable store should preserve the same properties:

- Lazy `userData` path resolution and recursive directory creation.
- First-run fallback only for `ENOENT`.
- Schema validation or normalization after parsing.
- Atomic temp-file replacement.
- A save queue or other serialization so concurrent writes cannot interleave.
- Narrow typed methods rather than exposing arbitrary file access to the renderer.

Prefer a feature-specific store when data has domain invariants or migrations; a generic `DataStore<T>` cannot validate them automatically.

## safeStorage for secrets

Encrypt API keys, tokens, and other secrets in the backend:

```typescript
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { app, safeStorage } from "@glaze/core/backend";

const userDataPath = app.getPath("userData");
await fs.mkdir(userDataPath, { recursive: true });
const secretsPath = path.join(userDataPath, "secrets.bin");

await fs.writeFile(secretsPath, await safeStorage.encryptString(apiKey));
const decrypted = await safeStorage.decryptString(await fs.readFile(secretsPath));
```

Never send decrypted secrets to the renderer unless a feature cannot work without that boundary, and never persist them in localStorage.

## Suggested file organization

```text
userData/
├── settings.json
├── data.json
├── history.json
├── secrets.bin
└── cache/
    └── api-cache.json
```
