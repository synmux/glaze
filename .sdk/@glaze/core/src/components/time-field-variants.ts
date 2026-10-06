import { cva } from "class-variance-authority";

import { cn } from "../utils/cn";

export const timeFieldVariants = cva(
  cn(
    "inline-flex w-fit items-center overflow-hidden transition-[color,border-color,background-color]",
    "aria-invalid:ring-support-red/20 aria-invalid:border-support-red/40",
    "data-disabled:pointer-events-none data-disabled:opacity-50",
  ),
  {
    variants: {
      variant: {
        // Bordered, transparent fill — the standalone form-field look. Mirrors `Input`.
        default: "border border-field bg-transparent focus-within:border-foreground-40",
        // Filled chrome for dense inspector panels. Keep the transparent border so
        // invalid/focus border colors can still be surfaced.
        filled: "border border-transparent bg-control-subtle focus-within:bg-control",
      },
      // Size-proportional radius, matching `Input` / `NumberInput`: small (inspector
      // density) gets a subtle rounded-square, medium/large keep `rounded-control`.
      size: {
        small: "h-7 text-regular rounded-lg",
        medium: "h-8 text-regular rounded-control",
        large: "h-9 text-regular rounded-control",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "medium",
    },
  },
);
