"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

function TabsRoot({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col gap-2", className)} {...props} />;
}

const tabsVariants = cva(
  `inline-flex w-fit items-center justify-center rounded-pill focus:outline-none p-0.5 [&:not(:has([data-separator]))]:gap-0.5`,
  {
    variants: {
      variant: {
        filled: "bg-control-subtle",
        glass: "bg-glass",
        transparent: "p-0 gap-1.5",
      },
      size: {
        small: "h-7",
        medium: "h-8",
        large: "h-9 p-1",
      },
    },
    defaultVariants: {
      variant: "glass",
      size: "medium",
    },
  },
);

export interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.List>, VariantProps<typeof tabsVariants> {}

function Tabs({ className, variant, size, ...props }: TabsProps) {
  return (
    <TabsPrimitive.List data-slot="tabs-list" className={cn(tabsVariants({ variant, size, className }))} {...props} />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "text-strong outline-none hover:bg-control-subtle text-secondary data-[state=active]:bg-control data-[state=active]:text-primary inline-flex h-[calc(100%-1px)] items-center justify-center gap-1.5 rounded-[calc(var(--radius-pill)-2px)] border border-transparent px-2 py-1 whitespace-nowrap focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none focus-visible:ring-1 focus-visible:ring-ring", className)}
      {...props}
    />
  );
}

function TabsSeparator() {
  return (
    <div
      data-separator
      className="flex items-center justify-center h-full px-px hover:opacity-0 [button:not(:disabled):hover+&]:opacity-0 has-[+button:not(:disabled):hover]:opacity-0 [[data-state=active]+&]:!opacity-0 [&:has(+[data-state=active])]:!opacity-0 before:content-[''] before:w-px before:h-3/5 before:bg-separator"
    />
  );
}

export { TabsRoot, Tabs, TabsTrigger, TabsSeparator, TabsContent };
