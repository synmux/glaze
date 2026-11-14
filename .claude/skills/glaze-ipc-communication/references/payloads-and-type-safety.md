# Payloads and Type Safety

## Keep recurring payloads lightweight

IPC values are serialized through the native bridge. Large values multiplied by polling or broadcast frequency cause memory pressure.

- Never put base64 or binary data in polled, listed, or broadcast responses.
- Return lightweight identifiers and metadata in lists.
- Fetch selected details on demand.
- Use `glaze-protocol-large-files` for binary data above 100 KB.

```typescript
// Wrong: every poll transfers every thumbnail.
ipcMain.handle("items:list", async () =>
  items.map((item) => ({ name: item.name, thumbnail: await getBase64Image(item.path) })),
);

// Correct: list metadata, then fetch or serve selected detail separately.
ipcMain.handle("items:list", async () => items.map((item) => ({ id: item.id, name: item.name, status: item.status })));
ipcMain.handle("items:getDetail", async (_event, params: { id: string }) => ({
  thumbnailUrl: await getCachedThumbnailUrl(params.id),
}));
```

## Share request and result types

Define channel contracts in a shared type-only module available to backend and renderer:

```typescript
export type IPCChannels = {
  "settings:get": {
    params: { key: string };
    result: unknown;
  };
  "settings:set": {
    params: { key: string; value: unknown };
    result: void;
  };
  "notes:create": {
    params: { title: string; content: string };
    result: Note;
  };
};
```

Keep the runtime handler and renderer call aligned with the same contract. Do not send `{ posthogApiKey }` to a handler expecting `{ key, value }`; the mismatch can compile through untyped wrappers and fail silently.

Types do not replace runtime validation. Validate untrusted IDs, URLs, paths, enum values, and object shapes in the backend before side effects.

## Debug mismatches

When a request appears to do nothing:

1. Confirm the handler registered exactly once.
2. Compare the renderer request object with the backend parameter type.
3. Check that the preload forwards the exact channel and params without reshaping.
4. Inspect backend logs using a static message and structured metadata.
5. Confirm the result is cloneable and does not contain class instances, native objects, or oversized binary values.
