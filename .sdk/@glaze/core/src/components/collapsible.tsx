"use client";

import * as React from "react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { ChevronRightIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

/** Root publishes its open state so CollapsibleChevron reads the nearest ancestor's value. */
const CollapsibleOpenContext = React.createContext<boolean>(false);

interface CollapsibleRootProps extends React.ComponentProps<typeof CollapsiblePrimitive.Root> {
  /** When `false`, descendant animations/transitions apply with 0ms duration. Default `true`. */
  animated?: boolean;
}

function CollapsibleRoot({
  className,
  animated = true,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  ...props
}: CollapsibleRootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  return (
    <CollapsibleOpenContext.Provider value={open}>
      <CollapsiblePrimitive.Root
        data-slot="collapsible"
        data-instant={animated ? undefined : ""}
        className={cn("flex flex-col", className)}
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </CollapsibleOpenContext.Provider>
  );
}

interface CollapsibleChevronProps extends React.ComponentProps<typeof ChevronRightIcon> {
  onToggle?: () => void;
  /** Override the open state read from the nearest `CollapsibleRoot` context. */
  open?: boolean;
}

function CollapsibleChevron({
  className,
  onToggle,
  open: propOpen,
  strokeWidth = 2.25,
  ...props
}: CollapsibleChevronProps) {
  const contextOpen = React.useContext(CollapsibleOpenContext);
  const interactive = onToggle !== undefined;
  const isOpen = propOpen ?? contextOpen;

  return (
    <ChevronRightIcon
      strokeWidth={strokeWidth}
      aria-hidden={interactive ? undefined : true}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? -1 : undefined}
      aria-label={interactive ? "Toggle" : undefined}
      data-slot="collapsible-chevron"
      onMouseDown={
        interactive
          ? (e) => {
              e.stopPropagation();
              e.preventDefault();
              onToggle!();
            }
          : undefined
      }
      onClick={interactive ? (e) => e.stopPropagation() : undefined}
      className={cn(
        "size-3.5 shrink-0 text-tertiary transition-transform duration-150 [transition-timing-function:cubic-bezier(0.165,0.84,0.44,1)]",
        isOpen ? "rotate-90" : "rotate-0",
        className,
      )}
      {...props}
    />
  );
}

const collapsibleTriggerVariants = cva(
  "flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        row: "text-regular text-primary",
        section: "text-small-strong text-tertiary",
      },
    },
    defaultVariants: {
      variant: "row",
    },
  },
);

export interface CollapsibleTriggerProps
  extends React.ComponentProps<typeof CollapsiblePrimitive.Trigger>, VariantProps<typeof collapsibleTriggerVariants> {}

function CollapsibleTrigger({ className, variant, children, ...props }: CollapsibleTriggerProps) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      className={cn(collapsibleTriggerVariants({ variant, className }))}
      {...props}
    >
      {children}
    </CollapsiblePrimitive.Trigger>
  );
}

function CollapsibleContent({ className, ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Content>) {
  return (
    <CollapsiblePrimitive.Content
      data-slot="collapsible-content"
      className={cn(
        "overflow-hidden data-[state=open]:animate-[collapsible-down_200ms_cubic-bezier(0.165,0.84,0.44,1)] data-[state=closed]:animate-[collapsible-up_150ms_cubic-bezier(0.165,0.84,0.44,1)_forwards]",
        className,
      )}
      {...props}
    />
  );
}

export { CollapsibleRoot, CollapsibleTrigger, CollapsibleChevron, CollapsibleContent };
