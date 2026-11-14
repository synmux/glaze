# Switchcraft

Build a macOS menu bar app that switches my Mac's sound devices between saved presets with one click.

Call the app 'Switchcraft'.

## What it's for

I regularly move between audio setups (for example desk speakers and a mic, versus a headset). Changing several things in System Settings every time is tedious. I want to pick a preset from the menu bar and have the Mac's sound settings change to match.

## Presets

A preset has:

- A short name in slug form: lowercase letters, digits and hyphens, unique, kept short (for example `desk` or `headset`). This is the only name a preset has.
- Main audio output: a specific device, or "No change".
- System alert sounds output (the separate macOS setting for sound effects and notifications): a specific device, "Same as main output", or "No change".
- Audio input: a specific device, or "No change".

"No change" leaves that setting exactly as it is when the preset is applied. "Same as main output" points alerts at whichever device is the main output at the moment the preset is applied. That is a one-off; alerts don't keep tracking the output afterwards.

I can have any number of presets, in an order I choose.

## Volumes (optional)

Each preset has a "Set volumes" switch, off by default. When it's off, the preset never touches any volume.

When it's on, the preset can also set:

- Main output volume: a level from 0 to 100%, or "No change".
- Input volume: a level from 0 to 100%, or "No change".

Alert volume is the Mac's own alert volume slider in System Settings → Sound, and it depends on the main output volume:

- If the main output volume is "No change", there is no alert volume control at all, and applying the preset leaves the alert volume alone.
- If the preset sets a main output volume, an alert volume control appears, linked to the main output volume by default. Linked means the alert volume slider is set to the same level as the main output volume.
- I can unlink it and give the alert volume its own level. The slider is then set to that level.

Output and input volumes apply to whichever device ends up in each role once the preset has been applied. If that device was skipped because it's missing, or it has no adjustable volume, skip that volume too. If the main output volume is skipped, leave the alert volume alone as well.

A preset must change at least one thing, whether a device or a volume.

## Applying a preset

Applying a preset changes the Mac's system-wide sound settings, the same ones shown in System Settings → Sound. It happens immediately, with no confirmation.

If a device in the preset isn't connected, apply everything that is available, skip the missing one, and show a notification saying what was skipped, including any volume that couldn't be set. A fully successful switch needs no notification.

The current preset is the one last applied, for as long as the Mac's sound devices still match it. If the devices are changed some other way (System Settings, something being unplugged), there is no current preset until one is applied again. Volume doesn't count towards this: adjusting volume afterwards doesn't clear the current preset.

## Menu bar

The app lives in the menu bar only, with no Dock icon and no main window. The menu bar item shows an icon, plus the current preset's slug as text beside it when there is a current preset.

Clicking it opens a menu:

- One item per preset, in my order, labelled with its slug. The current preset is ticked. Clicking a preset applies it.
- Under each slug, as smaller secondary lines inside the same menu item if possible, what that preset will switch to: one line each for output, alerts and input, with the volume alongside where the preset sets one, leaving out anything the preset doesn't change. Mark any device that isn't currently connected. A preference turns these lines on or off. This is a nice-to-have. If separate lines inside one item aren't practical, a single compact summary line or the nearest reasonable alternative is fine. Don't sink time into it.
- Preferences… and Quit.

If there are no presets yet, say so in the menu, and open Preferences on first launch.

## Preferences window

- Create, edit, duplicate, delete and reorder presets.
- When editing a preset, each of the three device settings is a picker listing the devices currently available for that role, plus the special options above. A device saved in the preset but not connected right now still appears, marked as not connected, so I can edit presets for gear that's unplugged.
- The "Set volumes" switch, which reveals the volume controls described above.
- A "Use current settings" button fills the pickers from whatever the Mac is using right now, including the current volume levels when "Set volumes" is on.
- Per preset, an optional global keyboard shortcut that applies it from anywhere. Tell me if a shortcut is already taken.
- Per preset, an optional rule to apply it automatically when a device I choose connects. When that device connects, the preset is applied as if I'd clicked it. A device can trigger at most one preset.
- Show device details in the menu: on or off.
- Launch at login: on or off.

Device lists everywhere update on their own as devices connect and disconnect.

## Good to know

- The app only changes which devices the Mac uses and, optionally, their volumes. It never records or plays audio, so it shouldn't ask for microphone access.
- It doesn't connect Bluetooth devices. A device that isn't connected is simply unavailable.
- Everything is stored locally and survives relaunches.

## Slack (later stage)

Slack is connected to this project for a later stage, when people will be able to switch the current preset by sending a Slack message. Don't build any of that yet: no Slack features, no Slack sign-in, no Slack settings. Just be aware it's coming, so that applying a preset by its slug stays one self-contained action that something other than the menu can trigger later.

If anything here is unclear or can't be done as described, ask me before building.
