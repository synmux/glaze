import * as React from "react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";

import { cn } from "../utils/cn";
import { CollapsibleRoot, CollapsibleChevron, CollapsibleContent } from "./collapsible";
import { ScrollArea } from "./scroll-area";

/**
 * Inspector primitives — building blocks for Apple-style inspector panels
 * (Xcode File inspector, Pages Format inspector). Three levels:
 *
 *   - `Inspector`        — top-level wrapper. Bakes in `ScrollArea`, an optional `Toolbar`
 *     (title + actions), and the standard panel padding. The peer of `Sidebar` for
 *     trailing-column inspectors.
 *   - `InspectorSection` — `title` + optional `collapsible` (matches `SidebarListGroup`).
 *     Renders a bold section header and its rows below.
 *   - `InspectorRow`     — optional `label` (matches `Field.label`). With a label the row
 *     is a grid `[label · control]` so labels align across the panel; without, the row is
 *     a flex container that fills the full width.
 *
 * The label column width is driven by a CSS variable `--inspector-label-col` with an
 * 88px default. Override it on `Inspector` (or any ancestor) to retune a specific panel:
 *
 *     <Inspector title="Format" style={{ "--inspector-label-col": "110px" }}>
 */

const LABEL_COL_VAR = "--inspector-label-col";
const LABEL_COL_DEFAULT = "88px";

interface InspectorProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Title rendered as `ToolbarTitle`. Most inspectors only need this. */
  title?: React.ReactNode;
  /** Trailing toolbar actions. Button children are auto-styled `glass`/`large` via `ScrollArea`'s
   *  content-toolbar defaults. The most common action is `<SplitView.InspectorToggle />`, which
   *  portals to the SplitView frame's trailing edge unless `pinned={false}`. */
  actions?: React.ReactNode;
  /** Escape hatch: pass a fully custom Toolbar. Overrides `title` and `actions`. */
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
  scrollEnabled?: boolean;
}

function Inspector({
  children,
  className,
  style,
  title,
  actions,
  toolbar,
  footer,
  scrollEnabled = true,
}: InspectorProps) {
  const content = (
    <div data-slot="inspector" className={cn("flex flex-col gap-3 px-3 pb-6 pt-1", className)} style={style}>
      {children}
    </div>
  );

  if (!scrollEnabled) return content;
  return (
    <ScrollArea toolbar={toolbar} title={title} actions={actions} footer={footer}>
      {content}
    </ScrollArea>
  );
}
Inspector.displayName = "Inspector";

type InspectorSectionOwnProps = {
  /** Section header. Omit to render a group with no visible header. */
  title?: React.ReactNode;
  /** Trailing slot on the header row — e.g. a "+" button that adds a layer (Figma
   *  fill/stroke/effects pattern). Sits to the right of the title; when the section
   *  is also collapsible, it sits before the chevron. */
  actions?: React.ReactNode;
  /** Wrap the section in a Collapsible with a chevron on the header. */
  collapsible?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function InspectorSection({
  className,
  title,
  actions,
  collapsible,
  defaultOpen = true,
  open,
  onOpenChange,
  children,
  ...props
}: React.ComponentProps<"section"> & InspectorSectionOwnProps) {
  const body = <div className="flex flex-col gap-2">{children}</div>;

  // Title typography: `text-strong` (13pt medium) — same as `FieldSet`'s legend —
  // so section titles are visibly larger than row labels (`text-small`, 11pt regular).
  // If they were smaller, the visual hierarchy would invert.
  const titleClass = "m-0 text-strong text-primary truncate";

  const hasHeader = title != null || actions != null;

  // Inner content shared between the collapsible (clickable row) and non-collapsible
  // (plain row) variants so their layout stays identical.
  const headerInner = (
    <>
      {title != null && <h3 className={cn(titleClass, "flex-1 min-w-0 text-left")}>{title}</h3>}
      {actions != null && (
        <div
          data-slot="inspector-section-actions"
          className="flex items-center gap-0.5 shrink-0"
          // Stop-propagation so clicking an action button inside the trigger row
          // doesn't also toggle the section open/closed.
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {actions}
        </div>
      )}
      {collapsible && (
        <span className="flex size-7 shrink-0 items-center justify-center text-tertiary">
          <CollapsibleChevron className="size-3.5" />
        </span>
      )}
    </>
  );

  const header = !hasHeader ? (
    collapsible ? (
      // No title and no actions but still collapsible — render a minimal chevron-only trigger.
      <CollapsiblePrimitive.Trigger
        data-slot="inspector-section-trigger"
        aria-label="Toggle section"
        className="flex size-7 shrink-0 items-center justify-center rounded-lg text-tertiary hover:text-primary outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <CollapsibleChevron className="size-3.5" />
      </CollapsiblePrimitive.Trigger>
    ) : null
  ) : collapsible ? (
    // Full-row trigger — clicking anywhere on the header (title or empty space)
    // toggles the section. `asChild` lets Radix forward its button semantics
    // onto our custom div so we can mix in the actions slot without nesting
    // interactive buttons.
    <CollapsiblePrimitive.Trigger asChild>
      <div
        data-slot="inspector-section-trigger"
        className="flex items-center gap-1.5 cursor-default rounded-md outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {headerInner}
      </div>
    </CollapsiblePrimitive.Trigger>
  ) : (
    <div data-slot="inspector-section-header" className="flex items-center gap-1.5">
      {headerInner}
    </div>
  );

  if (collapsible) {
    return (
      <CollapsibleRoot
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        className="first:[&>[data-slot=inspector-section]]:pt-0"
      >
        {/* Spacing lives inside CollapsibleContent (not as a flex `gap` on the section).
            Radix sets `hidden` on CollapsibleContent after the close animation; a flex gap
            above it would disappear on that frame and produce a visible jump. */}
        <section data-slot="inspector-section" className={cn("flex flex-col pt-3", className)} {...props}>
          {header}
          <CollapsibleContent>
            <div className="flex flex-col gap-2 pt-2">{children}</div>
          </CollapsibleContent>
        </section>
      </CollapsibleRoot>
    );
  }

  return (
    <section data-slot="inspector-section" className={cn("flex flex-col gap-2 pt-3 first:pt-0", className)} {...props}>
      {header}
      {body}
    </section>
  );
}
InspectorSection.displayName = "InspectorSection";

type InspectorRowOwnProps = {
  /** Label text. With a label, the row defaults to a grid `[label · control]`.
   *  Without, the row is full-width flex. */
  label?: React.ReactNode;
  /** Layout when a label is present. Default `"horizontal"` places the label in a
   *  fixed column next to the control. Use `"vertical"` when the control needs the
   *  full row width (multi-option SegmentedControls, wide clusters) — the label
   *  stacks above the control and both span the whole row. */
  orientation?: "horizontal" | "vertical";
};

function InspectorRow({
  className,
  label,
  orientation = "horizontal",
  children,
  style,
  ...props
}: React.ComponentProps<"div"> & InspectorRowOwnProps) {
  if (label == null) {
    return (
      <div
        data-slot="inspector-row"
        data-orientation="full"
        className={cn("flex items-center gap-1.5 *:min-w-0", className)}
        style={style}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (orientation === "vertical") {
    return (
      <div
        data-slot="inspector-row"
        data-orientation="vertical"
        className={cn("flex flex-col gap-1", className)}
        style={style}
        {...props}
      >
        <InspectorRowLabel>{label}</InspectorRowLabel>
        <div className="flex items-center gap-1.5 min-w-0 w-full">{children}</div>
      </div>
    );
  }

  // Inline style for the grid template so it works without relying on Tailwind's
  // arbitrary-value parser to resolve nested `var()` / `minmax()`. The CSS variable
  // is read from any ancestor; falls back to LABEL_COL_DEFAULT.
  const rowStyle: React.CSSProperties = {
    gridTemplateColumns: `var(${LABEL_COL_VAR}, ${LABEL_COL_DEFAULT}) minmax(0, 1fr)`,
    ...style,
  };

  return (
    <div
      data-slot="inspector-row"
      data-orientation="labeled"
      className={cn("grid items-center gap-x-3", className)}
      style={rowStyle}
      {...props}
    >
      <InspectorRowLabel>{label}</InspectorRowLabel>
      <div className="flex items-center gap-1.5 min-w-0">{children}</div>
    </div>
  );
}
InspectorRow.displayName = "InspectorRow";

function InspectorRowLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="inspector-row-label" className={cn("text-small text-secondary truncate", className)} {...props} />
  );
}

export { Inspector, InspectorSection, InspectorRow, InspectorRowLabel };
