---
name: glaze-native-permissions
description: Implement camera, microphone, location, motion, calendar, reminders, and contacts permission flows in Glaze apps using dedicated backend APIs, systemPreferences APIs, capability manifests, and native/WebKit-safe UX. Use this when adding native capability checks, personal-data access, permission prompts, diagnostics, or troubleshooting repeated permission dialogs.
---

# Glaze Native Permissions

Use this skill for camera, microphone, screen capture, location, headphone motion, calendar, reminders, contacts, or permission diagnostics.

## Non-negotiable rules

- Declare every used permission in `package.json` under `glaze.capabilities`; undeclared calls fail with `GLAZE_CAPABILITY_NOT_DECLARED`.
- Check status first. Prompt only from an explicit user action and only while status is `not-determined`; denied/restricted states need recovery guidance, not repeated prompts.
- Location must use `window.glazeAPI.location.getCurrentPosition(...)`. Never use `navigator.geolocation` in Glaze. Native location is single-shot; continuous `watchPosition` is not supported.
- Headphone motion must use `motion` from `@glaze/core/backend`. Start it only from an explicit user action, stop it when tracking ends, and keep posture/alert logic in the backend so it can continue without an open window.
- Camera/microphone use browser capture only after native permission checks. Their asynchronous capture lifecycle must be StrictMode-safe.
- Calendar, reminders, and contacts are backend-only. Return narrow DTOs through app IPC; bound all queries, project contact fields, and fetch photos separately.
- Treat native event/reminder references as opaque and replace stale refs with each mutation result.
- Ask for confirmation immediately before destructive or broad recurring mutations.

## Read only the file(s) for the task

- Declaring any permission, understanding available APIs, or implementing the shared status/prompt contract: read [capabilities-and-prompts.md](references/capabilities-and-prompts.md).
- Camera or microphone permission/capture, `getUserMedia`, StrictMode `AbortError`, or repeated media prompts: read [media-capture.md](references/media-capture.md). Also read `references/capabilities-and-prompts.md` when adding/changing declarations.
- Location status, current position, fallback UX, or continuous tracking requirements: read [location.md](references/location.md). Also read `references/capabilities-and-prompts.md` when adding/changing declarations.
- AirPods/headphone attitude, posture tracking, Core Motion status, or continuous motion updates: read [motion.md](references/motion.md). Also read `references/capabilities-and-prompts.md` when adding/changing declarations.
- Calendar, reminders, contacts, EventKit refs, recurrence, projections, or personal-data CRUD: read [personal-data.md](references/personal-data.md). Also read `references/capabilities-and-prompts.md` when adding/changing declarations.
- Diagnosing a blocked call, mismatched granted state, or repeated prompts: read [diagnostics.md](references/diagnostics.md), then the relevant domain file above.

## API map

- `window.glazeAPI.systemPreferences`: media status/prompts, authorization status, screen capture request, privacy settings.
- `window.glazeAPI.location`: single-shot current position.
- `motion` from `@glaze/core/backend`: continuous motion-capable headphone samples and connection state.
- `window.glazeAPI.permissions`: runtime diagnostics.
- `calendar`, `reminders`, `contacts` from `@glaze/core/backend`: backend personal-data APIs.
