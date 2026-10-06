# Plan: Caffeinate — Keep‑Awake Menu Bar Utility

## Context

The user wants a macOS **status bar (menu bar) app that keeps the Mac awake**, with three modes:
1. **Indefinite** — stay awake until manually disabled.
2. **Until a date/time** — pick an end date & time; sleep re‑enables then.
3. **For a duration** — pick a length of time to stay awake.

Plus: the ability to **hide the Dock icon**, and a **menu bar status** showing whether sleep is denied, including a **countdown** when a time limit is active.

**Implementation choice:** use the SDK‑exported `powerSaveBlocker` (same IOKit power‑assertion mechanism `caffeinate` uses) instead of spawning `caffeinate -disu`. It needs no child process to manage/kill and can't leak an assertion on crash — strictly better here.

**Confirmed with the user:**
- Interface = **menu bar tray + a compact control window** (window opens from the tray/dock).
- Default power behavior = **system only, allow the screen to turn off** (`prevent-app-suspension`), with a menu/window toggle to also **keep the display on** (`prevent-display-sleep`).

The app is the freshly scaffolded template (1000×700 window, sample HomeView). It will be transformed into a tray‑driven utility with a small control window.

## Architecture

Backend owns all state (single source of truth); the tray and the control window are both views of it.

- **Power engine:** `powerSaveBlocker.start(type)` / `.stop(id)` where `type` = `"prevent-app-suspension"` (default) or `"prevent-display-sleep"` (when "keep display on" is enabled). Store the numeric blocker id in module state; guard against double‑start.
- **Timed sessions:** store `endsAt` (epoch ms); a `setTimeout` auto‑stops at the end and posts a native `Notification` ("Your Mac can sleep again"). A 1s `setInterval` updates the tray title countdown while a timed session runs.
- **State model** (backend):
  ```ts
  type Mode = "off" | "indefinite" | "timed";
  interface KeepAwakeState { active: boolean; mode: Mode; keepDisplayAwake: boolean; endsAt: number | null; }
  ```
- **Settings** persisted to `app.getPath("userData")/settings.json` (atomic write): `keepDisplayAwake: boolean` (default false), `hideDockIcon: boolean` (default false). Applied on launch.

### Tray (menu bar)
- Icon = SF Symbol, template rendering (auto light/dark). Inactive: `cup.and.saucer`; active: `cup.and.saucer.fill`. Stable **hardcoded GUID literal** (never generated at runtime).
- Title = countdown when timed (`setTitle("1:23:45", { fontType: "monospacedDigit" })`), empty otherwise. Tooltip summarizes state.
- Context menu (rebuilt on every state change so checkmarks/labels are current):
  - Status line (disabled): "Sleep allowed" / "Keeping awake" / "Awake until 3:45 PM".
  - `Keep Awake Indefinitely` (checkbox → toggles indefinite).
  - `Keep Awake For` (submenu: 15 min / 30 min / 1 hour / 2 hours / 5 hours).
  - `Keep Awake Until…` → opens native `dialog.showDatePicker({ mode: "dateAndTime" })` anchored at `tray.getBounds()`; starts a timed session ending at the chosen time.
  - separator
  - `Keep Display Awake` (checkbox → toggles the power type; restarts blocker if active).
  - `Hide Dock Icon` (checkbox → `app.dock.hide()/show()`, persisted).
  - separator
  - `Open Caffeinate` (shows the control window) · `Quit` (`app.quit()`).

### Control window (repurposed main window)
Compact (~360×520, `minWidth` 360 / `minHeight` 480) — see `glaze-window-sizing`. Not the big split view. Contents:
- Large status header with icon + text ("Sleep Allowed" / "Keeping Awake").
- **Live countdown** when timed (ticked locally in React from `endsAt`, no per‑second IPC).
- Primary Start/Stop control for indefinite keep‑awake.
- Duration buttons (15m / 30m / 1h / 2h / 5h) and an "Until date & time…" button.
- Toggles: "Keep display awake" and "Hide Dock icon".
- Built with `@glaze/core` components per `glaze-component-patterns` (Toolbar, Button, Switch/Segmented, etc.).
- Closing the window does **not** quit (app stays in the tray); reopen via tray "Open Caffeinate" or the Dock.

### IPC contract (custom channels via `glaze.ipc.invoke` — no preload changes needed)
- `keepAwake:getStatus` → `KeepAwakeState`
- `keepAwake:startIndefinite` → starts indefinite
- `keepAwake:startFor` `(durationMs)` → starts timed
- `keepAwake:startUntil` → opens the date picker (anchored at tray), starts timed if a future time chosen; returns updated state
- `keepAwake:stop` → stops
- `keepAwake:setKeepDisplayAwake` `(boolean)` → persists + restarts blocker if active
- `settings:setHideDock` `(boolean)` → `app.dock.hide()/show()` + persists
- **Status push:** backend broadcasts `keepAwake:statusChanged` to open windows on every state change; the control window subscribes via `glazeAPI.glaze.ipc.onNotification`. (Confirm the backend notification‑send API via `glaze-ipc-communication`; if unavailable, fall back to 1s `getStatus` polling while the window is open.)

## Files

**New**
- `main/services/settings.ts` — `SettingsService` (JSON in `userData`, atomic write, ENOENT‑only default). Reuse the reference implementation from the `glaze-data-storage` skill (`references/json-and-secrets.md`).
- `main/services/keep-awake.ts` — the state machine: `powerSaveBlocker` start/stop, timed `setTimeout`, 1s tick, `Notification` on expiry, `getStatus()`, `setKeepDisplayAwake()`, and status broadcast.
- `main/tray/tray-controller.ts` — creates the `Tray`, builds/rebuilds the context menu, updates icon/title/tooltip from state.

**Modified**
- `main/index.ts` — on `ready`: init settings → keep‑awake service → tray; apply `hideDockIcon` (`app.dock.hide()`); create the compact control window (360×520). `activate`: show control window + re‑hide dock if the setting is on (documented macOS re‑show gotcha). `before-quit`/`will-quit`: `powerSaveBlocker.stop`, clear timers, `tray.destroy()`. Keep `window-all-closed` as a no‑op (stay resident in tray). Repoint/trim the App menu "Settings…" to open the control window.
- `main/handlers/index.ts` — register the `keepAwake:*` and `settings:setHideDock` handlers; wire "Open Caffeinate".
- `renderer/main/home-view.tsx` — replace template UI with the control panel.
- `renderer/main/root-view.tsx` — simplify for the compact layout (drop the SplitView scaffold if it doesn't fit).
- (No `preload.ts` change — custom channels ride `glaze.ipc.invoke`; `dialog.showDatePicker` is driven from the backend.)
- (Ignore the scaffold `settings-window.*` / `renderer/settings/*`; the control window is the single UI. Remove their menu wiring rather than leave a redundant empty window.)

**Not changed:** `package.json` activationPolicy stays `regular` (Dock shown by default); the Dock icon is hidden at runtime via `app.dock.hide()` so no bundle/Info.plist update is needed.

## Implementation order
1. `glaze-backend-rules` + `glaze-data-storage` → build `SettingsService`.
2. `keep-awake.ts` power engine + timers + notification.
3. `tray-controller.ts` + wire into `main/index.ts` (tray, dock hide, lifecycle cleanup, compact window).
4. `glaze-ipc-communication` → register handlers + status broadcast.
5. `glaze-component-patterns` + `glaze-window-sizing` → build the control window UI.
6. Build (lint + type‑check + build) and validate.

## Verification
- Build succeeds (lint + type‑check + build), then launch.
- **Indefinite:** toggle on from the window and from the tray menu → tray icon fills, tooltip/status reflect "keeping awake"; confirm a live `powerSaveBlocker` id is held. Toggle off → released.
- **Duration:** pick 15 min → tray title shows a monospaced countdown that decrements; control window shows the same live countdown; menu status shows "Awake until …".
- **Until date/time:** choose a near‑future time via the native picker → timed session starts; choosing a past time or cancel is a no‑op.
- **Expiry:** let a short timer elapse → blocker released, native notification fires, tray returns to inactive.
- **Keep display awake toggle:** flips the power type; when toggled while active, the blocker restarts with the new type.
- **Hide Dock icon:** toggling removes/restores the Dock tile; setting persists across relaunch (re‑applied on launch and on `activate`).
- **Resident behavior:** closing the control window keeps the app alive in the tray; reopen via "Open Caffeinate". Quit from the tray releases the assertion.
- Runtime UI check via live DOM inspection for the control window's status/countdown wiring; confirm settings persist and nothing is written under `.glaze-sources`/`.glaze`.
