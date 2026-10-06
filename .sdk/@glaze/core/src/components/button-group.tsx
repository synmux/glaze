import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import * as React from "react";
import { ButtonGroupContext } from "./button-group-context";

export function ButtonGroupSeparator() {
  return (
    <div
      data-separator
      className="flex items-center justify-center h-full px-px hover:opacity-0 [button:not(:disabled):hover+&]:opacity-0 has-[+button:not(:disabled):hover]:opacity-0 before:content-[''] before:w-px before:h-3/5 before:bg-separator"
    />
  );
}

// ButtonGroup sizes match Button sizes so they align in toolbars.
// Child buttons are forced smaller to create inner padding.
// small:  h-7 (28px) — minimal padding, child buttons h-6 (24px)
// medium: h-8 (32px) — child buttons h-7 (28px), 2px padding
// large:  h-9 (36px) — child buttons h-7 (28px), 4px padding
const buttonGroupVariants = cva(
  `group inline-flex w-fit items-center justify-center rounded-pill p-0.5 [&>button]:text-regular [&>button]:rounded-[calc(var(--radius-pill)-2px)]`,
  {
    variants: {
      variant: {
        glass: "bg-glass dimmable",
        transparent: "gap-1.5 p-0",
        filled: "bg-control-subtle",
      },
      size: {
        small: "h-7 [&_button]:!h-6 [&_button]:!w-auto [&_button]:!min-w-6",
        medium: "h-8 [&_button]:!h-7 [&_button]:!w-auto [&_button]:!min-w-7",
        large:
          "h-9 p-1 [&_button]:!h-7 [&_button]:!w-auto [&_button]:!min-w-7 [&>button]:rounded-[calc(var(--radius-pill)-4px)]",
      },
    },
    defaultVariants: {
      variant: "transparent",
      size: "medium",
    },
  },
);

export interface ButtonGroupProps extends React.ComponentProps<"div">, VariantProps<typeof buttonGroupVariants> {}

export function ButtonGroup({ children, variant, size, className }: ButtonGroupProps) {
  return (
    <ButtonGroupContext.Provider value={true}>
      <div className={cn(buttonGroupVariants({ variant, size }), className)}>{children}</div>
    </ButtonGroupContext.Provider>
  );
}
