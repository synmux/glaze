"use client";

import * as React from "react";
import { ContextMenu as ContextMenuPrimitive } from "radix-ui";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "../utils/cn";

const CustomContextMenu = ContextMenuPrimitive.Root;

const CustomContextMenuTrigger = ContextMenuPrimitive.Trigger;

const CustomContextMenuGroup = ContextMenuPrimitive.Group;

const CustomContextMenuPortal = ContextMenuPrimitive.Portal;

const CustomContextMenuSub = ContextMenuPrimitive.Sub;

const CustomContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

const CustomContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
    value?: string;
  }
>(({ className, inset, children, value, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "text-regular flex gap-2 cursor-default select-none items-center rounded-lg px-2 py-1 outline-none pr-8 text-primary focus:bg-list-hover data-[state=open]:bg-list-hover",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <div className="absolute right-2 flex gap-1 items-center">
      {value && <span className="text-tertiary">{value}</span>}
      <ChevronRightIcon className="h-4 w-4 text-tertiary" />
    </div>
  </ContextMenuPrimitive.SubTrigger>
));
CustomContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

const CustomContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.SubContent
      ref={ref}
      className={cn("z-50 min-w-32 overflow-hidden rounded-popover bg-glass p-1", className)}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
CustomContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

const CustomContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn("z-50 min-w-[9.5rem] overflow-hidden rounded-popover bg-glass p-1", className)}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
CustomContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

const CustomContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      `text-regular relative gap-2 flex cursor-default select-none items-center rounded-lg px-2 py-1 outline-none
      text-primary focus:bg-list-hover data-disabled:pointer-events-none data-disabled:opacity-50`,
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
CustomContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

const CustomContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "text-regular text-tertiary relative flex cursor-default select-none items-center rounded-lg py-1 pl-2 pr-8 outline-none focus:bg-list-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    checked={checked}
    {...props}
  >
    {children}
    <span className="h-[14px] absolute right-2 flex w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <CheckIcon className="h-3.5 w-3.5 text-primary" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
  </ContextMenuPrimitive.CheckboxItem>
));
CustomContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;

const CustomContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "text-regular text-tertiary relative flex cursor-default select-none items-center rounded-lg py-1 pr-8 pl-2 outline-none focus:bg-list-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[state=checked]:text-primary",
      className,
    )}
    {...props}
  >
    {children}
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <CheckIcon className="h-3.5 w-3.5" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
  </ContextMenuPrimitive.RadioItem>
));
CustomContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

const CustomContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn("text-small px-2 py-1 text-tertiary", inset && "pl-8", className)}
    {...props}
  />
));
CustomContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

const CustomContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-separator", className)} {...props} />
));
CustomContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

const CustomContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-small tracking-widest opacity-60", className)} {...props} />;
};
CustomContextMenuShortcut.displayName = "CustomContextMenuShortcut";

export {
  CustomContextMenu,
  CustomContextMenuTrigger,
  CustomContextMenuContent,
  CustomContextMenuItem,
  CustomContextMenuCheckboxItem,
  CustomContextMenuRadioItem,
  CustomContextMenuLabel,
  CustomContextMenuSeparator,
  CustomContextMenuShortcut,
  CustomContextMenuGroup,
  CustomContextMenuPortal,
  CustomContextMenuSub,
  CustomContextMenuSubContent,
  CustomContextMenuSubTrigger,
  CustomContextMenuRadioGroup,
};
