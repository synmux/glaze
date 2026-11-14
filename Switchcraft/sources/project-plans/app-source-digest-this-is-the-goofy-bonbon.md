# Switchcraft — implementation plan

## Context

The user switches between audio setups (desk speakers + mic vs headset) and wants one-click presets from the menu bar instead of changing several things in System Settings → Sound. Switchcraft is a menu-bar-only app (no Dock icon, no main window) with a Preferences window for managing presets. Slack triggering comes later. For now, applying a preset by slug must be one self-contained backend action that any trigger can call.

Confirmed decisions:

- **Current preset:** it stays current while every device it _actually set_ is still in that role. Changes to roles it left as "No change" don't clear it. If a device was skipped because it's missing, the preset is still current based on what it did set. If nothing at all could be applied, it does not become current. A volume-only preset stays current until another preset is applied. Volume changes never clear it.
- **Toolchain:** Xcode 27.2 is installed, so a small native Swift helper does the CoreAudio work. No Homebrew dependency.

## Architecture

Backend-owned. The renderer is only the Preferences UI.

```plaintext
Tray menu ─┐
Shortcut ──┼─► applyPresetBySlug(slug, source) ─► audio helper (Swift, CoreAudio)
Auto-apply ┤        │ serialized queue
Prefs ─────┘        ├─► notification if anything skipped
(Slack later)       └─► current-preset tracker ─► tray title/menu + broadcast to Prefs
```

### 1. Native audio helper: `native/switchcraft-audio/` (raw long-lived process)

- `Package.swift` (tools 6.0, macOS 13). Split sources: `main.swift` (stdin loop, JSON-lines protocol, `RunLoop.main.run()`, `setvbuf` line buffering), `Audio.swift`, `AlertVolume.swift`, `SystemShortcuts.swift`.
- Protocol: requests `{"id","method","params"}` → responses `{"id","ok","result"|"error"}`. Push events `{"event":"audioChanged","snapshot":{…}}`, debounced at about 150 ms. stdin is read on a background thread and dispatched to the main queue.
- Methods:
  - `getSnapshot` → devices `[{uid, name, transport, hasOutput, hasInput, canBeDefaultOutput, canBeDefaultInput, canBeSystemOutput, outputVolumeSettable, inputVolumeSettable}]` (hidden devices excluded), `defaults {output, alert, input}` as UIDs, and `volumes {output, input, alert}`.
  - `setDefaultDevice {role, uid}` uses `kAudioHardwarePropertyDefaultOutputDevice`, `…DefaultSystemOutputDevice` or `…DefaultInputDevice`.
  - `setVolume {uid, scope, level}` uses `kAudioHardwareServiceDeviceProperty_VirtualMainVolume` (the same control as the system slider), checked with `IsPropertySettable` first.
  - `getAlertVolume` / `setAlertVolume {level}` use `NSAppleScript` "set volume alert volume N" on the main thread. This is the System Settings alert slider.
  - `checkSystemShortcut {accelerator}` reads the enabled `AppleSymbolicHotKeys` from `com.apple.symbolichotkeys` and maps them to names for common ones (Spotlight, screenshots, Mission Control, input sources), otherwise "a macOS shortcut".
- Listeners: `AudioObjectAddPropertyListenerBlock` on the system object for the device list and the three default-device selectors.
- No audio I/O, so no microphone permission and no usage string.

### 2. Backend services: `main/services/`

- `audio-bridge.ts`: spawns the helper via the `swift:../native/switchcraft-audio` default export. Request/response map by id, event emitter for snapshots, an `error` handler, respawn with backoff on exit, kill on `before-quit`. Caches the latest snapshot.
- `store.ts`: one JSON file in `app.getPath("userData")`, written atomically (temp file + rename). Shape: `{version, presets[], settings {showDeviceDetails}, lastApplied {presetId, expected {output?, alert?, input?}} | null, launchedBefore}`.
- `presets.ts`: model, CRUD, duplicate (slug gets a `-copy` / `-2` suffix), reorder, validation:
  - Slug matches `^[a-z0-9]+(-[a-z0-9]+)*$`, max 24 characters, unique.
  - The preset must change at least one device or volume.
  - A trigger device can belong to only one preset.
  - Model: `output: noChange | device{uid,name}`; `alert: noChange | sameAsOutput | device`; `input: noChange | device`; `volumes {enabled, output: number|null, input: number|null, alert {linked, level}}`; `shortcut: string|null`; `autoApplyDevice: {uid,name}|null`. Device refs keep the last-known name so unplugged gear still shows up.
- `apply-preset.ts`: **`applyPresetBySlug(slug, source)`** is the single entry point (plus `applyPresetById` for internal callers). It runs on a serialized queue and returns a structured `ApplyResult {applied[], skipped[{what, reason}]}`. Steps:
  1. Fresh snapshot.
  2. Output: set it if connected, otherwise skip as missing.
  3. Alerts: `sameAsOutput` resolves to the _final_ output UID (one-off, no tracking). A specific device is set if connected and allowed as a system-output device.
  4. Input: set it if connected, otherwise skip.
  5. Volumes, only if enabled. The output volume goes to the final output device and is skipped if that device was missing or has no volume control. The alert volume is set only if the output volume was actually set (linked → same level, unlinked → its own level). The input volume follows the same rule as output.
  6. If anything was skipped, show a `Notification`, e.g. "Switched to desk — AirPods Pro isn't connected (output); output volume not set". No notification on full success.
  7. Record `lastApplied.expected` = the roles actually set → tracker.
- `current-preset.ts`: on every `audioChanged` event (ignored while an apply is running), clear current if any expected role's default UID differs. Re-validated at launch. Editing the current preset's devices re-checks the match. Deleting it clears it.
- `shortcuts.ts`: registers each preset's accelerator with `globalShortcut.register` → `applyPresetById`. Keeps per-preset status (`ok` / `taken`).
  - `check(accelerator, presetId)` reports conflicts in this order: another preset ("Used by headset"), a macOS system shortcut (from the helper), then a failed register ("Already taken by another app").
  - Requires ⌘, ⌃ or ⌥, except F-keys.
  - `setSuspended(true)` while Preferences is recording. `unregisterAll` on `will-quit`.
- `auto-apply.ts`: compares device UID sets between snapshots (never on the first snapshot). For a newly connected UID with a rule, it waits about 1.5 s so macOS's own auto-switch settles, then applies with `source: "device"`. Only real connects while running trigger it, not devices already present at launch.
- `tray.ts`: `new Tray(<speaker SF Symbol>, {guid: <fixed UUID>})`. `setTitle(currentSlug ?? "")`. The menu is rebuilt with `setContextMenu` (no click handler) whenever presets, current preset, devices or settings change:
  - One `checkbox` item per preset in order, checked if current. Its global shortcut is shown with `registerAccelerator: false`.
  - `sublabel` (when "Show device details" is on) holds one line each for Output, Alerts and Input, plus volume where set, joined with `\n`, with "(not connected)" marks. If multi-line rendering looks wrong, a single helper switches to one compact `·` line.
  - "No presets yet" (disabled) when the list is empty.
  - Separator, "Preferences…" (⌘,), "Quit Switchcraft" (`app.quit()`).
- `login-item.ts`: `app.setLoginItemSettings({openAtLogin})` / `getLoginItemSettings()`.

### 3. IPC: `main/handlers/switchcraft.ts`, registered from `main/handlers/index.ts`

Handlers:

- `presets:list`, `presets:create`, `presets:update`, `presets:duplicate`, `presets:delete`, `presets:reorder`, `presets:apply`
- `audio:getSnapshot`, `audio:getCurrentSettings` (devices plus volume levels, for "Use current settings")
- `shortcuts:check`, `shortcuts:setRecording`
- `prefs:get`, `prefs:set` (showDeviceDetails, launchAtLogin)

Broadcasts `switchcraft:changed` (presets, current preset, snapshot, shortcut statuses) so Preferences updates live.

### 4. App shell: `main/index.ts`, `main/windows/settings-window.ts`, `package.json`

- `package.json`: `appConfig.macOS.activationPolicy: "accessory"` (then refresh the bundle metadata).
- `main/index.ts`: remove main-window creation. Start the store, audio bridge, tray, shortcuts and auto-apply on ready. If there are no presets at launch, open Preferences. `activate` (app reopened from Finder) opens Preferences. `window-all-closed` does nothing. Clean up on `before-quit`/`will-quit`. The app menu item becomes "Preferences…" (⌘,).
- Remove `main-window.html` and `renderer/main/*` if the build doesn't require them, otherwise leave them as an unused stub.
- `settings-window.ts`: title "Switchcraft Preferences". Size it to the preset editor (sized at implementation, around 820×580, min ~700×480). Call `app.focus({steal: true})` before showing so the Dock-less app's window comes to the front. No temporary Dock icon.

### 5. Preferences UI: `renderer/settings/`

Native-style split layout.

- **Sidebar:** a "General" row, then a "Presets" section listing slugs. Drag to reorder, with a context menu offering Duplicate, Delete, Move Up and Move Down. Footer has + and − buttons. Presets with a taken shortcut show a warning mark.
- **Preset editor** (form sections):
  - **Name:** slug field with inline validation.
  - **Devices:** pickers for Output, Alerts and Input. Each lists currently available devices for that role plus the special options. A saved but disconnected device appears marked "Not connected". A "Use current settings" button fills the pickers, and the volume levels too when Set volumes is on. If the current alert volume equals the output volume it is set as linked, otherwise unlinked with its level.
  - **Volumes:** "Set volumes" switch. When on, it reveals Output and Input volume, each a "No change" option or a 0–100% slider. Alert volume appears only when an output volume is set, with a "Linked to output volume" toggle (default on). Unlinking reveals its own slider.
  - **Triggers:**
    - Keyboard shortcut recorder (click to record, Esc to cancel, clear button, inline "already taken" message; a taken shortcut isn't saved).
    - "Apply when this device connects" picker listing all known devices. Devices used by another preset are disabled with a "Used by …" label.
  - "Apply Now" button.
- **Editing model:** auto-save. Edits that fail validation (bad or duplicate slug, nothing to change) show an inline error and aren't saved until fixed. A new preset gets a unique `preset-N` slug and its devices pre-filled from current settings, so it is valid immediately.
- **General pane:** "Show device details in menu" and "Launch at login" switches.
- **Data:** React Query over IPC, invalidated by the `switchcraft:changed` broadcast, so device lists update live.
- Files: `settings-view.tsx` (shell) plus `components/` (sidebar, preset-editor, device-picker, volume-controls, shortcut-recorder, general-pane) and `hooks/use-switchcraft.ts`. Types shared with the backend come from one types module, or are mirrored if the tsconfigs keep them apart.

## Execution order

1. Swift helper, backend services, IPC and app shell in one batch.
2. Preferences UI.
3. Build (compiles the helper), refresh the bundle for the accessory policy, launch, then verify.
4. Write `.glaze_memory/PROJECT-CONTEXT.md` and add `.gitignore` entries (`native/*/.build/`, `main/glaze-swift.d.ts`).

## Verification

- The build is green, including the Swift helper. Backend logs show the helper's first snapshot with real devices and defaults.
- Live-inspect the Preferences window. Check that:
  - the device pickers are populated
  - - creates a pre-filled preset
  - slug validation errors appear
  - Set volumes reveals the controls, and alert link/unlink behaves as specified
  - the shortcut recorder reports conflicts (e.g. ⌘Space → macOS Spotlight)
  - reorder and duplicate work
  - the General toggles work
- Exercise the apply path safely: apply a preset created from "Use current settings" (an effectively no-op switch) and confirm in logs that it becomes current and the tray title updates. Live switching between real devices, unplug behaviour, tray menu appearance (native menu, which can't be DOM-inspected) and launch at login (may only take effect in the installed app) are left for the user to try. The report will say so.

## Known limits to tell the user

- "Shortcut already taken" detection covers other presets, macOS system shortcuts, and shortcuts the system refuses to register. Some third-party apps' shortcuts can't be detected by any public API.
- Auto-apply fires only when the device connects while Switchcraft is running.
