import * as React from "react";
import { Toggle as TogglePrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils/cn";

/**
 * ToggleButton — single pressed/unpressed button. Use for isolated toggle
 * controls like flip / lock / show-hide, where a `SegmentedControl` with one item
 * would be semantically weird and a plain `Button` doesn't carry pressed state.
 *
 * Wraps Radix `Toggle.Root` — ships `pressed` / `defaultPressed` / `onPressedChange`
 * out of the box along with proper `aria-pressed` and keyboard Space/Enter handling.
 *
 * Chrome mirrors `Button` when unpressed (sizes, radius, icon-only compound) but the
 * `filled` variant's unpressed fill is `control-subtle` — same as `Input` / `Select` /
 * `NumberInput` / `SegmentedControl` filled — so a toggle button sits seamlessly
 * next to those other controls in an inspector row. When pressed, the background
 * switches to the system accent.
 */

const toggleButtonVariants = cva(
  cn(
    "text-regular inline-flex shrink-0 items-center justify-center whitespace-nowrap outline-none",
    "focus-visible:ring-1 focus-visible:ring-ring hover:cursor-default",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        filled:
          "bg-control-subtle text-primary hover:bg-control data-[state=on]:bg-accent data-[state=on]:text-accent-contrast",
        glass: "bg-glass text-primary hover:bg-control data-[state=on]:bg-accent data-[state=on]:text-accent-contrast",
        transparent:
          "text-secondary hover:bg-control hover:text-primary data-[state=on]:bg-accent data-[state=on]:text-accent-contrast",
      },
      // Matches `SegmentedControl` / `Button` size tokens, plus proportional icon
      // sizing so a toggle sits flush with segmented items in the same row.
      size: {
        small: "h-7 px-2 gap-1.5 [&_svg]:size-4",
        medium: "h-8 px-3 gap-1.5 [&_svg]:size-[18px]",
        large: "h-9 px-3 gap-1.5 [&_svg]:size-[18px]",
      },
      iconOnly: {
        true: "p-0",
      },
      radius: {
        full: "rounded-pill",
        rounded: "rounded-control",
      },
    },
    compoundVariants: [
      { size: "small", iconOnly: true, className: "h-7 w-7" },
      { size: "medium", iconOnly: true, className: "h-8 w-8" },
      { size: "large", iconOnly: true, className: "h-9 w-9" },
      // Size-proportional corner — mirror `Button`'s small-rounded.
      { size: "small", radius: "rounded", className: "rounded-lg" },
    ],
    defaultVariants: {
      variant: "filled",
      size: "medium",
      iconOnly: false,
      radius: "full",
    },
  },
);

export interface ToggleButtonProps
  extends Omit<React.ComponentProps<typeof TogglePrimitive.Root>, "size">, VariantProps<typeof toggleButtonVariants> {}

function ToggleButton({ className, variant, size, iconOnly, radius, ...props }: ToggleButtonProps) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle-button"
      className={cn(toggleButtonVariants({ variant, size, iconOnly, radius, className }))}
      {...props}
    />
  );
}
ToggleButton.displayName = "ToggleButton";

export { ToggleButton };
