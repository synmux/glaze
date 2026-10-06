# ShareSheet

Native macOS share sheet trigger for sharing text or URLs from a visible button. The system sharing picker anchors to the `ShareSheetTrigger`.

## When to Use

- Share links, text, or short messages through the macOS sharing picker.
- Toolbar share buttons that should anchor the sheet to the trigger.
- Use `DropdownMenu` instead when you need a custom list of app actions rather than the OS sharing services.
- Use `clipboard.writeText` directly for copy-only actions.

## Usage Patterns

Import the root and trigger from `@glaze/core/components`.

```tsx
import { Button, ShareSheet, ShareSheetTrigger, toast } from "@glaze/core/components";
import { ShareIcon } from "lucide-react";
```

### Basic

```tsx
<ShareSheet text="https://glaze.app">
  <ShareSheetTrigger asChild>
    <Button iconOnly aria-label="Share">
      <ShareIcon className="size-4" />
    </Button>
  </ShareSheetTrigger>
</ShareSheet>
```

### Fallback on Error

Use `onError` to provide a fallback such as copying the link when the native sheet cannot open.

```tsx
<ShareSheet
  text={shareUrl}
  onOpen={() => trackShare("share_sheet")}
  onError={async () => {
    await clipboard.writeText(shareUrl);
    toast.success("Share link copied to clipboard");
  }}
>
  <ShareSheetTrigger asChild>
    <Button>
      <ShareIcon className="size-4" />
      Share
    </Button>
  </ShareSheetTrigger>
</ShareSheet>
```

### Disabled

```tsx
<ShareSheet text={shareUrl} disabled={!shareUrl}>
  <ShareSheetTrigger asChild>
    <Button disabled={!shareUrl}>Share</Button>
  </ShareSheetTrigger>
</ShareSheet>
```

## Component API

### ShareSheet

Root component that owns the native share request.

| Prop       | Type                                        | Default | Description                                  |
| ---------- | ------------------------------------------- | ------- | -------------------------------------------- |
| `text`     | `string`                                    | -       | Text or URL to share                         |
| `disabled` | `boolean`                                   | `false` | Prevent opening the share sheet              |
| `onOpen`   | `() => void`                                | -       | Called after the native share sheet is shown |
| `onError`  | `(error: unknown) => void \| Promise<void>` | -       | Called when the native share sheet fails     |
| `children` | `ReactNode`                                 | -       | Usually one `ShareSheetTrigger`              |

### ShareSheetTrigger

Button that opens the share sheet. The trigger's bounding rectangle is used as the native anchor.

| Prop      | Type      | Default | Description                            |
| --------- | --------- | ------- | -------------------------------------- |
| `asChild` | `boolean` | `false` | Merge trigger props onto child element |

## Design System Rules

### ✅ Do

- Wrap the visible button in `ShareSheetTrigger asChild`.
- Use a clear share icon or "Share" label.
- Use `onError` when the share action should fall back to copying a link.

### ❌ Don't

- Pass mouse coordinates from click events for toolbar share buttons.
- Use this component for custom action menus; use `DropdownMenu` instead.
- Add a `ShareSheetContent` child. The operating system owns the sheet contents.
