# Capabilities and Prompt Contract

Permission APIs are manifest-gated. Declare only the capabilities and operations the feature uses:

```json
{
  "glaze": {
    "capabilities": {
      "camera": { "usage": "Capture video" },
      "microphone": { "usage": "Capture audio input" },
      "screen": { "usage": "Request and read screen recording permission state" },
      "location": { "usage": "Read current location" },
      "motion": { "usage": "Monitor posture using connected headphones" },
      "calendar": {
        "permission": "full",
        "operations": ["read", "write"],
        "usage": "Show upcoming meetings and add events you confirm"
      },
      "contacts": {
        "operations": ["read", "write"],
        "usage": "Find and update people you choose"
      },
      "reminders": {
        "operations": ["read", "write"],
        "usage": "Show and update your reminders"
      }
    }
  }
}
```

Missing declarations fail with `GLAZE_CAPABILITY_NOT_DECLARED`. Calendar, reminders, and contacts also enforce `operations`. Calendar requests cannot exceed `calendar.permission`: use `"write-only"` with `["write"]` for create-only apps and `"full"` for any calendar/event read. Repackage after declaration changes so the signed bundle gets matching privacy usage descriptions.

## Supported renderer APIs

`window.glazeAPI.systemPreferences`:

- `getMediaAccessStatus("camera" | "microphone" | "screen")`
- `askForMediaAccess("camera" | "microphone")`
- `getAuthorizationStatus("contacts" | "calendar" | "reminders" | "location")`
- `requestScreenCaptureAccess()`
- `openPrivacySettings("calendar" | "contacts" | "reminders")`

Glaze-specific:

- `window.glazeAPI.location.getCurrentPosition(options?)`
- `window.glazeAPI.permissions.getDiagnostics()`

The media and authorization methods follow Electron `systemPreferences` semantics; verify exact installed SDK signatures before use.

## Universal prompt flow

1. Read status without prompting.
2. If `not-determined`, request access only after an explicit user action.
3. If `denied` or `restricted`, do not prompt again; offer settings/recovery guidance.
4. Start the protected operation only after access is granted.

Camera/microphone example:

```ts
async function ensureMediaPermission(mediaType: "camera" | "microphone") {
  const status = await window.glazeAPI.systemPreferences.getMediaAccessStatus(mediaType);
  if (status === "denied" || status === "restricted") {
    throw new Error(`${mediaType} access is denied or restricted.`);
  }
  if (status === "not-determined") {
    const granted = await window.glazeAPI.systemPreferences.askForMediaAccess(mediaType);
    if (!granted) throw new Error(`${mediaType} permission was not granted.`);
  }
}
```

Personal-data reads never prompt. Call each API's `status()` and `requestAccess()` explicitly, and handle typed `PersonalDataError.code` values.

Headphone motion is backend-only. `motion.status()` never prompts; `motion.start()` may prompt and must follow an explicit user action.
