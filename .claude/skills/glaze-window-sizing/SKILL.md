---
name: glaze-window-sizing
description: Choose Glaze BrowserWindow width, height, and minimum dimensions for a new app or changed layout. Use during app creation or when editing windowWidth, windowHeight, minWidth, or minHeight in main/index.ts.
---

# Glaze Window Sizing

Set the four existing constants in `main/index.ts`. On a fresh scaffold, their exact lines are supplied in `<app_source_digest>`; patch those anchors without reading the file.

Keep `390 × 456` as the default minimum unless the layout genuinely cannot function there. Preserve intentional existing custom minimums. Keep initial height at or below 850 px so the window fits common displays.

Choose the initial size from the layout:

| Layout                       | Starting size |
| ---------------------------- | ------------- |
| Small utility/timer          | `420 × 500`   |
| Settings or single form      | `520 × 600`   |
| Two-column notes/list-detail | `800 × 650`   |
| Three-column browser         | `1000 × 700`  |
| Dense dashboard/table        | `1100 × 800`  |

Size for the primary workflow, not every possible row. Content lists may scroll; essential controls and the main working regions should fit without horizontal scrolling. Multi-panel dashboards need enough width for their intended responsive breakpoint, while simple utilities should not retain the template's large default.

Only read `main/index.ts` when the digest is absent or the window creation has already been customized and its exact content must be preserved.
