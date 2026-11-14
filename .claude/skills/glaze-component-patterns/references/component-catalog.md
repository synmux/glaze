# Component Catalog

Import components from `@glaze/core/components`, hooks from `@glaze/core/hooks`, and utilities from `@glaze/core/utils`.

```typescript
import { Button, Dialog, Panel, Sidebar } from "@glaze/core/components";
import { useConnection, useEnvironment, useTheme } from "@glaze/core/hooks";
import { cn, initLogging } from "@glaze/core/utils";
```

Before writing the selected components, read all needed linked docs, up to nine at once. Use one deferred `GetComponentDocs` call when available; otherwise resolve each linked filename under `../../.sdk/@glaze/core/src/components/` and read it directly.

| Pattern | Component(s) | Doc |
| --- | --- | --- |
| **Layout** |  |  |
| App shell | `SplitView` | `split-view.md` |
| Custom resizable panels | `PanelGroup`, `Panel` | `panel.md` |
| Application sidebar | `Sidebar`, `SidebarList`, `SidebarListItem`, `SidebarListGroup`, `SidebarFooter`, `SidebarListItemContent/Title/Subtitle/Accessory` | `sidebar.md` |
| Scrollable view + standard header | `ScrollArea` with `title`, `subtitle`, `actions`, `leading` | `scroll-area.md` |
| Custom/multi-row top or bottom toolbar | `Toolbar`, `ToolbarRow`, `ToolbarActions`, `ToolbarContent`, `ToolbarTitle`, `ToolbarDescription` | `toolbar.md` |
| Toolbar search | `ToolbarSearchButton` inside a complete `Toolbar` | `toolbar.md` |
| Detail-page back button | `ToolbarBackButton`, preferably via `ScrollArea.leading` | `toolbar.md` |
| Grid with keyboard navigation | `Grid.Root`, `Grid.Item` | `grid.md` |
| Vertical list with selection | `List.Root`, `List.Item`, `List.ItemTitle` | `list.md` |
| Inspector/detail panel | `Inspector`, `InspectorRow`, `InspectorSection`, `InspectorToggle` | `inspector.md` |
| Expandable section | `CollapsibleRoot`, `CollapsibleTrigger`, `CollapsibleContent`, `CollapsibleChevron` | `collapsible.md` |
| Visual divider | `Separator` | `separator.md` |
| **Forms** |  |  |
| Text input | `Input` | `input.md` |
| Multi-line text | `Textarea` | `textarea.md` |
| Numeric input | `NumberInput` | `number-input.md` |
| Time input (hour/minute) | `TimeField` | `time-field.md` |
| Date, or date + time picker | `NativeDatePickerRoot`, `NativeDatePickerTrigger`, `NativeDatePickerValue` | `date-picker.md` |
| Color picker | `ColorWell` | `color-well.md` |
| Dropdown select | `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` | `select.md` |
| Dropdown with custom children | `CustomSelect`, its trigger/content/item primitives | `custom-select.md` |
| Boolean checkbox | `Checkbox` | `checkbox.md` |
| Boolean switch | `Switch` | `switch.md` |
| Radio group | `RadioGroup`, `RadioGroupItem` | `radio-group.md` |
| Range slider | `Slider` | `slider.md` |
| Form field wrapper | `FieldSet`, `Field` | `field.md` |
| Form label | `Label` | `label.md` |
| **Actions** |  |  |
| Button | `Button` | `button.md` |
| Grouped buttons | `ButtonGroup`, `ButtonGroupSeparator` | `button-group.md` |
| Back/forward navigation | `NavigationButtonGroup` | `button-group.md` |
| Pressed-state button | `ToggleButton` | `toggle-button.md` |
| Dropdown menu | `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem` | `dropdown-menu.md` |
| Native share sheet | `ShareSheet`, `ShareSheetTrigger` | `share-sheet.md` |
| Custom-child dropdown | `CustomDropdownMenu` and its primitives | `custom-dropdown-menu.md` |
| Command palette | `Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandItem` | `command.md` |
| Right-click menu | `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem` | `context-menu.md` |
| Custom-child context menu | `CustomContextMenu` and its primitives | `custom-context-menu.md` |
| **Dialogs and overlays** |  |  |
| Modal dialog | `Dialog` and its primitives | `dialog.md` |
| Must-decide dialog | `AlertDialog` | `alert-dialog.md` |
| Hover tooltip | `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` | `tooltip.md` |
| **Feedback** |  |  |
| Toast | `Toaster`, `toast()` | `sonner.md` |
| Live status | `Status` | `status.md` |
| New/unseen indicator | `NotificationDot` | `notification-dot.md` |
| Inline notice/banner | `Callout` | `callout.md` |
| Empty content | `EmptyState` and its title/description/actions/media | `empty-state.md` |
| Error fallback | `ErrorBoundaryView` | `error-boundary-view.md` |
| Edge blur | `ProgressiveBlur` | `progressive-blur.md` |
| **AI chat** |  |  |
| Complete AI chat family | `AIChat` | `ai-chat.md` |
| Prompt composer | `AIChat.Composer.Root`, `AIChat.Composer.Surface`, `AIChat.Composer.Input`, `AIChat.Composer.Control`, `AIChat.Composer.Actions`, `AIChat.Composer.Submit` | `composer.md` |
| Chat attachments | `AIChat.Attachments.Root`, `AIChat.Attachments.Item`, `AIChat.Attachments.Preview`, `AIChat.Attachments.Info`, `AIChat.Attachments.Remove` | `attachments.md` |
| Conversation transcript | `ScrollArea`, `AIChat.Conversation.Content`, `AIChat.Conversation.Anchor`; controlled virtualizers can add `AIChat.Conversation.Root` and `AIChat.Conversation.ScrollToBottom` | `conversation.md` |
| User/assistant/system message | `AIChat.Message.Root`, `AIChat.Message.Content`, `AIChat.Message.Actions`, `AIChat.Message.Action` | `message.md` |
| Long-form response | `AIChat.Response` | `response.md` |
| Markdown response | `Markdown` | `markdown.md` |
| Code presentation | `CodeBlock`, `InlineCode` | `code-block.md` |
| Reasoning disclosure | `AIChat.Reasoning.Root`, `AIChat.Reasoning.Trigger`, `AIChat.Reasoning.Content` | `reasoning.md` |
| Tool invocation | `AIChat.Tool.Root`, `AIChat.Tool.Trigger`, `AIChat.Tool.Name`, `AIChat.Tool.Summary`, `AIChat.Tool.Content` | `tool.md` |
| Grouped tool calls | `AIChat.ToolGroup.Root`, `AIChat.ToolGroup.Trigger`, `AIChat.ToolGroup.Content` | `tool-group.md` |
| Task progress | `AIChat.TaskList.Root`, `AIChat.TaskList.Item` | `task-list.md` |
| **Data display** |  |  |
| Text | `Text` | `text.md` |
| Avatar/stack | `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarBadge`, `AvatarStack` | `avatar.md` |
| Static label/tag/count | `Badge` | `badge.md` |
| Data table | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` | `table.md` |
| Tabs | `TabsRoot`, `Tabs`, `TabsTrigger`, `TabsSeparator`, `TabsContent` | `tabs.md` |
| Segmented control | `SegmentedControl`, `SegmentedControlItem`, `SegmentedControlSeparator` | `segmented-control.md` |
| Shortcut hint | `Key`, `KeyGroup` | `key.md` |

## Raw element replacements

Use `Button` for `<button>`, `Input` for text input, `Checkbox`/`RadioGroup`/`Slider`/`NumberInput` for typed inputs, `Select` for `<select>`, `Textarea`, `Table`, `Dialog`, `List` for interactive lists, `Sidebar` for navigation, and `Label`/`Field` for form structure.

## Hooks and utilities

| Symbol                | Purpose                                                                   |
| --------------------- | ------------------------------------------------------------------------- |
| `useTheme`            | Apply theme to the document                                               |
| `useConnection`       | Track IPC connection                                                      |
| `useEnvironment`      | Read app environment information                                          |
| `useWindowFocusState` | Track window focus                                                        |
| `useGlazeAI`          | Run renderer-triggered Glaze AI; pair it with `AIChat` using `ai-chat.md` |
| `cn`                  | Merge class names                                                         |
| `initLogging`         | Initialize renderer logging                                               |
