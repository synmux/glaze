---
name: glaze-live-inspection
description: Verify a running Glaze app through targeted DOM inspection, element inspection, pointer interaction, JavaScript evaluation, or visual capture. Use for new interactive flows, concrete runtime questions code/build/logs cannot answer, layout-sensitive behavior, user-requested previews, or any fix the user reports is still broken.
---

# Inspect the Running App

Live inspection validates changed behavior; it is not initial code exploration or a routine post-edit ritual. The harness requires one initial DOM snapshot and permits at most five total live-inspection calls per successful changed-source build, with at most three validation cycles for the entire user turn.

Tool names are internal—never tell the user to call them. Say "Open the app" or refer to the Open App button.

## Decide Whether to Inspect

- Live inspections are expensive: every probe adds tool latency and result context. Scope output narrowly, combine a click with its resulting DOM, and stop once the concrete question is answered.
- Inspect newly added interactive flows before claiming completion.
- Inspect multi-panel layouts, navigation, forms with validation, sheets/popovers, runtime-only behavior, and layout-sensitive media when correctness is not deterministic from code.
- Inspect every new scrollable shell with header chrome. Its first snapshot must establish a real `[data-toolbar]` root and header bounds that clear the window-control inset; use a preview when overlap or progressive blur remains a visual question.
- Skip deterministic copy, token, class-name, and one-line logic changes unless the user asks for inspection.
- Use build output and logs—not live inspection—for build failures, stale bundles, and startup errors.

## Inspection Sequence

1. Read the relevant code and logs first; define the exact runtime question.
2. Build successfully. When inspection will follow, set `launchIfNeeded: true` and act on the returned readiness instead of preflighting status.
3. Take one initial structured DOM snapshot, scoped to the smallest useful selector. Enable styles or layout only when the question needs them. For a new scrollable shell with header chrome, include layout and verify `[data-toolbar]` plus title/action bounds before checking feature data. Use the result to choose unique semantic targets.
4. Exercise the flow with pointer clicks. Prefer `{ role: "button", name: "Save" }` or another unique role/name target. Set `observeSelector` to the panel, dialog, or region expected to change so the click result includes the relevant post-click DOM. Do not follow a click with a snapshot of the same scope.
5. Use a targeted element inspection or DOM snapshot only for a concrete question the existing output cannot answer. Use JavaScript evaluation last and keep each script to one DOM-only question. Capture a preview only for pixels the DOM cannot validate well.
6. Stop when the requested behavior has evidence. The initial snapshot and every subsequent status, snapshot, inspection, click, evaluation, or preview attempt share the five-call budget. Runtime failures consume a call; malformed selectors, targets, and scripts rejected before execution do not.
7. Build again only after inspection identifies a concrete source fix. A changed-source build unlocks the next cycle, but the turn allows only three cycles total: the initial implementation and at most two evidence-driven corrections. Once exhausted, stop inspecting and state any remaining uncertainty.

Never edit source solely to add test selectors, obtain another inspection cycle, or reset the budget. Prefer existing accessible names, roles, and stable product attributes. Add accessibility metadata only when the app genuinely needs it for users, not as a validation escape hatch. Never manufacture an unrelated polish change to obtain another build revision.

## Unsupported Probes

The harness rejects these immediately instead of spending a runtime round trip on evidence it cannot produce:

- Synthetic file drops using `File`, `DataTransfer`, or `DragEvent`. Verify the rendered drop target and report native Finder import as requiring manual validation.
- Native open/save dialog automation. Verify the control that opens it and report the native dialog interaction as requiring manual validation.
- React private fields such as `__reactFiber$`, `__reactProps$`, or root internals. Assert observable DOM, text, visibility, attributes, or layout instead.
- Page/preload API probes such as `window.glazeAPI` from JavaScript evaluation. Evaluation runs in an isolated world where page globals are unavailable.
- `element.click()` evaluation. Use the pointer-click tool, which dispatches the full pointer sequence and reports the resulting DOM.
- Playwright/jQuery text pseudo-selectors such as `:has-text(...)` and `:contains(...)`. Use a semantic role/name click target or a standard CSS selector instead.

Status tools are not routine preflights: inspection tools already reject with readiness reasons. Use detailed status only when diagnosing attachment/readiness or obtaining another window ID.

Previews show page content, not reliable native frame, titlebar, traffic lights, shadow, vibrancy, or focused-window appearance. Never claim those properties from a preview.
