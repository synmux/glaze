# Permission Diagnostics

Read runtime diagnostics:

```ts
const diagnostics = await window.glazeAPI.permissions.getDiagnostics();
```

Interpret common cases:

- Missing manifest capability → blocked call with the declaration reason. Add the minimum capability/operations and repackage.
- Status is `granted`, but media capture fails → inspect `getUserMedia` errors and device availability; this is not necessarily a permission failure.
- Repeated camera/microphone prompts → verify prompting only occurs for `not-determined`, the native media delegate is present, and app identity/signing is stable. See [media-capture.md](media-capture.md).
- Location fails through browser APIs → browser geolocation is unsupported; use native `getCurrentPosition`. See [location.md](location.md).
- Denied personal-data access → offer `systemPreferences.openPrivacySettings("calendar" | "contacts" | "reminders")`; do not prompt repeatedly.

## Verification checklist

- Manifest includes every used capability and only required operations.
- Prompt occurs only after explicit user action and only for `not-determined`.
- Denied/restricted UI has a concrete recovery path.
- Media streams are ref-held, stopped on cleanup, and guarded against stale async work.
- Location uses native single-shot API, never `navigator.geolocation`.
- Personal data stays in backend APIs with bounded reads and narrow IPC DTOs.
- Event/reminder mutation refs are replaced with authoritative returned refs.
