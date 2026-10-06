import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils/cn";
import { useWindowFocusState } from "../hooks";

/**
 * SegmentedControl — pill-style selection control (Apple's `NSSegmentedControl`).
 *
 * Visually related to `ButtonGroup` + `Tabs` — same pill chrome and size tokens — but
 * semantically a form control that holds a value. Use it for mutually exclusive options
 * where every choice should be visible (alignment, size presets), or for multi-select
 * toggle strips (B/I/U/S character styles) via `type="multiple"`.
 *
 * Use `Tabs` when choices should switch content panels; use `ButtonGroup` when the items
 * are independent actions with no shared selection state.
 */

const segmentedControlVariants = cva(
  "inline-flex w-fit items-center justify-center p-0.5 focus:outline-none [&:not(:has([data-separator]))]:gap-0.5",
  {
    variants: {
      variant: {
        filled: "bg-control-subtle",
        glass: "bg-glass dimmable",
        transparent: "p-0 gap-1.5",
      },
      // Size-proportional radius: small gets a rounded-square (inspector density),
      // medium/large keep the classic pill shape. Icon size is also baked in per
      // variant via a simple descendant selector — override per-icon with Tailwind's
      // `!size-X` modifier if you really need a different size in one spot.
      size: {
        small: "h-7 rounded-lg [&_svg]:size-4",
        medium: "h-8 rounded-pill [&_svg]:size-[18px]",
        large: "h-9 p-1 rounded-pill [&_svg]:size-[18px]",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "medium",
    },
  },
);

type BaseRootProps = Omit<
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>,
  "type" | "value" | "defaultValue" | "onValueChange"
>;

type SingleProps = BaseRootProps &
  VariantProps<typeof segmentedControlVariants> & {
    /** Selection mode. Defaults to `"single"` — one item selected at a time. */
    type?: "single";
    /** Allow pressing the selected item again to clear the value. */
    allowEmpty?: boolean;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
  };

type MultipleProps = BaseRootProps &
  VariantProps<typeof segmentedControlVariants> & {
    /** Selection mode — pass `"multiple"` for B/I/U/S-style toggle strips. */
    type: "multiple";
    allowEmpty?: never;
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
  };

export type SegmentedControlProps = SingleProps | MultipleProps;

// Overloads so callers get `value: string` when `type="single"` (or omitted) and
// `value: string[]` when `type="multiple"`, without forcing every single-select
// call site to spell out `type="single"`.
function SegmentedControl(props: SingleProps): React.JSX.Element;
function SegmentedControl(props: MultipleProps): React.JSX.Element;
function SegmentedControl({
  className,
  variant,
  size,
  type = "single",
  allowEmpty = false,
  ...rest
}: SegmentedControlProps): React.JSX.Element {
  const isWindowFocused = useWindowFocusState();

  const singleRest = rest as Omit<SingleProps, "className" | "variant" | "size" | "type">;
  const singleValue = type === "single" ? singleRest.value : undefined;
  const singleDefaultValue = type === "single" ? singleRest.defaultValue : undefined;
  const singleOnValueChange = type === "single" ? singleRest.onValueChange : undefined;
  const [uncontrolledSingleValue, setUncontrolledSingleValue] = React.useState(singleDefaultValue);
  const isSingleValueControlled = singleValue !== undefined;
  const selectedSingleValue = singleValue ?? uncontrolledSingleValue ?? "";

  const handleSingleValueChange = React.useCallback(
    (nextValue: string) => {
      // Radix single ToggleGroup emits "" when the active item is pressed again.
      // SegmentedControl is radio-like by default, but callers can opt into
      // deselection for workflows where an unanswered state is meaningful.
      if (nextValue === "" && !allowEmpty) return;

      if (!isSingleValueControlled) {
        setUncontrolledSingleValue(nextValue);
      }
      singleOnValueChange?.(nextValue);
    },
    [allowEmpty, isSingleValueControlled, singleOnValueChange],
  );

  const { value: _value, defaultValue: _defaultValue, onValueChange: _onValueChange, ...singleRootProps } = singleRest;
  const toggleGroupProps =
    type === "multiple"
      ? { type, ...rest }
      : {
          type,
          ...singleRootProps,
          value: selectedSingleValue,
          onValueChange: handleSingleValueChange,
        };

  return (
    <ToggleGroupPrimitive.Root
      data-slot="segmented-control"
      data-window-focused={isWindowFocused}
      // Exposes the root size to descendant items via `group-data-*` so they can
      // match their corner radius to the track (pill in pill track, rounded in small track).
      data-size={size ?? "medium"}
      // Exposes the variant so items can branch their active styles —
      // glass uses neutral gray instead of accent.
      data-variant={variant ?? "filled"}
      className={cn("group/segmented-control", segmentedControlVariants({ variant, size, className }))}
      {...(toggleGroupProps as React.ComponentProps<typeof ToggleGroupPrimitive.Root>)}
    />
  );
}

interface SegmentedControlItemProps extends React.ComponentProps<typeof ToggleGroupPrimitive.Item> {
  /** Square the item up so an icon child renders with track-matched proportions. */
  iconOnly?: boolean;
}

function SegmentedControlItem({ className, iconOnly, ...props }: SegmentedControlItemProps) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="segmented-control-item"
      data-icon-only={iconOnly || undefined}
      className={cn(
        "text-strong outline-none group-data-[window-focused=true]/segmented-control:data-[state=on]:bg-accent group-data-[window-focused=true]/segmented-control:data-[state=on]:text-accent-contrast group-data-[window-focused=false]/segmented-control:data-[state=on]:bg-foreground-20 data-[state=off]:active:bg-control text-foreground inline-flex h-[calc(100%-1px)] items-center justify-center gap-1.5 border border-transparent px-2 whitespace-nowrap focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        // Glass track keeps the active state neutral — the surrounding glass tint
        // already provides enough chrome, so accent would feel doubly heavy.
        "group-data-[variant=glass]/segmented-control:data-[state=on]:!bg-foreground-20 group-data-[variant=glass]/segmented-control:data-[state=on]:!text-primary",
        // Match item radius to track: pill track → pill items (default);
        // small (rounded-square) track → rounded-md items.
        "rounded-[calc(var(--radius-pill)-2px)] group-data-[size=small]/segmented-control:rounded-md group-data-[size=large]/segmented-control:rounded-[calc(var(--radius-pill)-4px)]",
        // Icon-only items get track-proportional square dimensions so the active
        // fill reads as a balanced rounded square — without text content the
        // default `px-2` + percentage height leaves them lopsided.
        iconOnly && "px-0",
        iconOnly && "group-data-[size=small]/segmented-control:size-6",
        iconOnly && "group-data-[size=medium]/segmented-control:size-7",
        iconOnly && "group-data-[size=large]/segmented-control:size-7",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Thin vertical divider rendered between adjacent `SegmentedControlItem`s — the
 * classic Apple creative-tool look (Pages Format inspector, Keynote, NSSegmentedControl
 * `.rounded`). The separator auto-hides when adjacent to a selected item (the accent
 * fill visually eats it).
 *
 * Omit separators entirely for the simpler "chip row" look — the root drops to a 2px
 * gap between items when no `[data-separator]` child is present.
 */
function SegmentedControlSeparator() {
  return (
    <div
      data-separator
      className="flex items-center justify-center h-full px-px [[data-state=on]+&]:!opacity-0 [&:has(+[data-state=on])]:!opacity-0 [:active+&]:!opacity-0 [&:has(+:active)]:!opacity-0 before:content-[''] before:w-px before:h-3/5 before:bg-separator"
    />
  );
}

export { SegmentedControl, SegmentedControlItem, SegmentedControlSeparator };
