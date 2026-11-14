---
name: glaze-native-images
description: Build, review, or debug Glaze features that display native macOS application icons, file icons, or Quick Look thumbnails. Use for app launchers, installed-app lists, file browsers, icon or thumbnail grids, image-size and scale controls, backend NativeImage manipulation, API or documentation friction reports, or diagnosing blurry, cropped, oversized, missing, stale, or slow native images. Reload this skill when a follow-up asks to evaluate the implementation or guidance.
---

# Glaze Native Images

Use renderer URL helpers for display. Keep paths and metadata in list IPC responses, and reserve backend `NativeImage` objects or data URLs for explicit manipulation and small diagnostic/detail requests.

This is agent guidance, not an SDK file. Read or reload this skill from the project's configured skill directory; do not search `sdk/current/@glaze/core` for `SKILL.md`. When reviewing prior work, compare claims against this file before reporting missing guidance.

## Choose the API

```tsx
import { getFileIconUrl, getFileThumbnailUrl } from "@glaze/core/utils";

getFileIconUrl(appPath, { size: 64, scaleFactor: 2 });
getFileIconUrl(filePath, { size: 64, scaleFactor: 2 });
getFileThumbnailUrl(filePath, { size: 128, scaleFactor: 2, fallback: "icon" });
```

- Use `getFileIconUrl()` for the native icon associated with any file, folder, or application bundle.
- Use `getFileThumbnailUrl()` for a Quick Look preview. It falls back to the native file icon by default.
- Use `fallback: "none"` when the UI must distinguish a real Quick Look preview from icon fallback.
- Use backend `app.getFileIcon()` or `nativeImage.createThumbnailFromPath()` only when manipulating pixels or returning narrowly scoped diagnostics.

Do not spawn `osascript`, JXA, `sips`, or another extraction process. Do not read `CFBundleIconFile`; it misses asset-catalog icons.

## Preserve Size Semantics

Treat `size` as logical CSS points and `scaleFactor` as source pixel density:

- Icon URLs default to 32 pt and thumbnails default to 128 pt. Pass `size` explicitly whenever layout depends on it; app launchers typically need a larger value than the icon default.
- Rectangular sizes are bounding boxes, not stretching instructions. Icons are centered and aspect-fitted on a transparent canvas; Quick Look previews preserve their native aspect ratio and may return a smaller logical width or height.
- Each logical dimension must be greater than 0 and no greater than 1024 pt.
- `scaleFactor` must be greater than 0 and no greater than 4. Automatic scale uses the display density, capped at 4, or 2 outside a renderer.
- 64 pt at 1x produces about 64x64 natural pixels.
- 64 pt at 2x produces about 128x128 natural pixels.
- Render a 64 pt icon in a 64x64 CSS box unless the product intentionally separates requested and displayed sizes.

Wire controls to both the URL and the rendered box. Do not clamp, replace, or merely record the selected value.

```tsx
type ScaleChoice = "auto" | "1" | "2";

function scaleFactorFor(choice: ScaleChoice): number | undefined {
  return choice === "auto" ? undefined : Number(choice);
}

const scaleFactor = scaleFactorFor(scaleChoice);
const src = getFileIconUrl(app.path, {
  size: iconSize,
  ...(scaleFactor ? { scaleFactor } : {}),
});

<img
  key={`${app.path}:${iconSize}:${scaleChoice}:${reloadNonce}`}
  src={src}
  alt={`${app.name} icon`}
  width={iconSize}
  height={iconSize}
  className="shrink-0 object-contain"
  loading="lazy"
  decoding="async"
  draggable={false}
  onContextMenu={(event) => event.preventDefault()}
/>;
```

Keep the image key dependent on every URL-affecting size, scale, and reload value. Rapid size changes can otherwise leave a reused image element temporarily showing stale or blank content. For a fixed-size image, a remount key is unnecessary.

If the requested and displayed sizes intentionally differ, name and show both values. Ensure the source has enough physical pixels for the rendered CSS size at the current display density; never report one size while requesting another.

## Render App Icons Faithfully

Use `object-contain` and show the complete native icon. Transparent pixels and rounded corners are part of the returned artwork.

Never try to make an app icon look larger by:

- switching a square icon to `object-cover`;
- applying a CSS scale transform inside an overflow-hidden box;
- scanning alpha and trimming the bitmap;
- cropping or resizing every icon in a backend handler;
- returning per-item base64 images for a list or grid.

For square image data in a square box, `object-cover` and `object-contain` use the same geometric scale; `object-cover` cannot remove transparent pixels inside the bitmap. Custom trimming easily crops asymmetric artwork and destroys multi-representation sharpness.

Fix perceived size through the surrounding layout: choose an appropriate CSS icon size, column width, gap, and label placement. Do not put a small fixed-size icon inside a much larger visible backing square just to fill a grid cell. For launcher-style layouts, let the icon's transparent canvas blend with the window and derive the cell or column size from the selected icon size.

## Compose `Grid` Correctly

Put only the visual inside `Grid.ItemContent`. Keep the title and description as siblings. `Grid.ItemAccessory` is absolutely positioned in the top-right; use it only for a small overlay status.

```tsx
<Grid.Item item={app} onAction={openApp}>
  <Grid.ItemContent>
    <img
      key={`${app.path}:${iconSize}`}
      src={getFileIconUrl(app.path, { size: iconSize })}
      width={iconSize}
      height={iconSize}
      className="object-contain"
      loading="lazy"
      decoding="async"
      draggable={false}
      onContextMenu={(event) => event.preventDefault()}
    />
  </Grid.ItemContent>
  <Grid.ItemTitle>{app.name}</Grid.ItemTitle>
  <Grid.ItemDescription>{app.location}</Grid.ItemDescription>
</Grid.Item>
```

Do not place the title, dimensions, description, or category badge inside `Grid.ItemContent`. Do not override its square aspect to compensate for incorrect composition. Use a plain CSS grid instead when the design does not fit `Grid`'s selection and visual-cell model.

## Keep Lists Lightweight

Return metadata only from discovery or polling handlers:

```ts
type AppEntry = {
  name: string;
  path: string;
  bundleIdentifier?: string;
};
```

Generate the URL in the renderer from `path`. The runtime caches and coalesces native image requests. A grid must not make one IPC request per icon or transfer data URLs for all items.

For narrowly scoped backend work:

```ts
import { app, nativeImage } from "@glaze/core/backend";

const icon = await app.getFileIcon(appPath, { size: "large" });
// small = 16 pt, normal = 32 pt, large = 128 pt
const scales = icon.getScaleFactors();
const png2x = icon.toDataURL({ scaleFactor: 2 });

const thumbnail = await nativeImage.createThumbnailFromPath(filePath, {
  width: 128,
  height: 128,
});
```

Keep data URLs limited to a selected detail view, export, clipboard operation, or diagnostic probe.

## Handle Missing Artwork and Paths

- For an existing path, `getFileIconUrl()` uses the system-associated file icon. An application bundle without custom artwork therefore receives the generic system app icon rather than a blank image.
- A missing path or native image-generation failure rejects the URL load and fires the image element's `onError` handler.
- The URL helpers do not accept a custom placeholder option. Use component state plus `onError` when the product needs branded fallback artwork; avoid replacing the `src` repeatedly after the fallback also fails.
- Quick Look has a separate fallback contract: `fallback: "icon"` uses the system file icon when no preview exists, while `fallback: "none"` rejects the load.

## Test Quick Look Truthfully

Do not call a fallback result a Quick Look preview.

```ts
const previewOnly = getFileThumbnailUrl(path, {
  size: 128,
  fallback: "none",
});
```

- Treat a successful `fallback: "none"` load as a real preview.
- Treat a failed `fallback: "none"` load plus a successful `fallback: "icon"` load as icon fallback.
- Expect some file types, folders, and application bundles to have no distinct Quick Look preview.
- Test missing paths and unsupported files without crashing the app.

For file selection and Finder drops, also load the `glaze-drag-and-drop` skill.

## Measure Without Lying

On image load, record:

- `naturalWidth` and `naturalHeight` for source pixels;
- `getBoundingClientRect()` for rendered CSS dimensions;
- the exact requested logical size and scale factor;
- load duration, success/failure, and fallback mode.

Reset or scope samples when size, scale, filter, or test run changes. For a warm-cache test, remount image elements while keeping identical URLs. Do not label a load cold when the URL did not change.

## Debugging Order

Menu bar (tray) icons are not renderer images — there is no `<img>` and no URL parameters, so none of the steps below apply. A blurry tray icon means the `NativeImage` reached `Tray` without a 2x representation; load the `glaze-app-lifecycle` skill instead.

When an icon looks wrong:

1. Inspect the actual screenshot at full resolution.
2. Verify the `<img>` box dimensions and computed `object-fit`/`object-position`.
3. Verify the URL's `width`, `height`, and `scale` query values match the UI.
4. Compare natural pixels with rendered CSS pixels and display density.
5. Remove transforms, overflow cropping, custom bitmap trimming, and hard-coded size clamps.
6. Check `Grid` composition and surrounding padding/gaps.
7. Test multiple visually different apps; never generalize from one icon.

Prefer the simplest renderer-only fix. If DOM measurements and the user's screenshot disagree, do not declare the screenshot stale or the UI correct; reproduce at full resolution and inspect visible pixels before changing architecture.

## Verification Checklist

- [ ] Size and scale controls change the actual URL parameters.
- [ ] 64 pt at 1x loads about 64 pixels; 64 pt at 2x loads about 128 pixels.
- [ ] App icons are complete, centered by layout, sharp, and not zoomed or cropped.
- [ ] `Grid.ItemContent` contains only the visual; labels are siblings.
- [ ] Variable-size grid images key on URL-affecting controls and use `loading="lazy"` plus `decoding="async"`.
- [ ] Grid images use `draggable={false}` and suppress the chrome-image context menu.
- [ ] App/file list IPC contains paths and metadata, not base64 images.
- [ ] Quick Look is tested with `fallback: "none"` before claiming preview support.
- [ ] Cold/warm metrics are scoped to the current configuration.
- [ ] Missing paths and unavailable previews show a stable failure state.
- [ ] Build, lint, and type-check pass; inspect the running app at every supported size.
