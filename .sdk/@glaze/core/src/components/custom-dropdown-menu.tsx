"use client";

import * as React from "react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "../utils/cn";

function CustomDropdownMenu(props: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root modal={false} {...props} />;
}

const CustomDropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const CustomDropdownMenuGroup = DropdownMenuPrimitive.Group;

const CustomDropdownMenuPortal = DropdownMenuPrimitive.Portal;

const CustomDropdownMenuSub = DropdownMenuPrimitive.Sub;

const CustomDropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const CustomDropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
    value?: string;
  }
>(({ className, inset, children, value, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "group text-regular flex gap-2 cursor-default select-none items-center rounded-lg px-2 py-1 outline-none pr-8 text-primary focus:bg-accent focus:text-accent-contrast data-[state=open]:not-hover:bg-list-hover",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <div className="absolute right-2 flex gap-1 items-center">
      {value && <span className="text-tertiary">{value}</span>}
      <ChevronRightIcon className="h-4 w-4 text-tertiary group-focus:text-accent-contrast" />
    </div>
  </DropdownMenuPrimitive.SubTrigger>
));
CustomDropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const CustomDropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cn(
        "z-50 min-w-32 overflow-hidden rounded-popover bg-popover ring-1 ring-foreground-20 p-1 opacity-100 shadow-lg",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
CustomDropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const CustomDropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[9.5rem] overflow-hidden rounded-popover bg-popover ring-1 ring-foreground-20 p-1 opacity-100 shadow-lg",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
CustomDropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const CustomDropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      `group text-regular relative gap-2 flex cursor-default select-none items-center rounded-lg px-2 py-1 outline-none
      text-primary focus:bg-accent focus:text-accent-contrast data-disabled:pointer-events-none data-disabled:opacity-50`,
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
CustomDropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const CustomDropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "group text-regular text-tertiary relative flex cursor-default select-none items-center rounded-lg py-1 pl-2 pr-8 outline-none focus:bg-accent focus:text-accent-contrast data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    checked={checked}
    {...props}
  >
    {children}
    <span className="h-[14px] absolute right-2 flex w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <CheckIcon className="h-3.5 w-3.5 text-primary group-focus:text-accent-contrast" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
  </DropdownMenuPrimitive.CheckboxItem>
));
CustomDropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const CustomDropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "group text-regular text-tertiary relative flex cursor-default select-none items-center rounded-lg py-1 pr-8 pl-2 outline-none focus:bg-accent focus:text-accent-contrast data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:text-accent-contrast",
      className,
    )}
    {...props}
  >
    {children}
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <CheckIcon className="h-3.5 w-3.5 group-focus:text-accent-contrast" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
  </DropdownMenuPrimitive.RadioItem>
));
CustomDropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const CustomDropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("text-small px-2 py-1 text-tertiary", inset && "pl-8", className)}
    {...props}
  />
));
CustomDropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const CustomDropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-separator", className)} {...props} />
));
CustomDropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const CustomDropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-small tracking-widest opacity-60", className)} {...props} />;
};
CustomDropdownMenuShortcut.displayName = "CustomDropdownMenuShortcut";

export {
  CustomDropdownMenu,
  CustomDropdownMenuTrigger,
  CustomDropdownMenuContent,
  CustomDropdownMenuItem,
  CustomDropdownMenuCheckboxItem,
  CustomDropdownMenuRadioItem,
  CustomDropdownMenuLabel,
  CustomDropdownMenuSeparator,
  CustomDropdownMenuShortcut,
  CustomDropdownMenuGroup,
  CustomDropdownMenuPortal,
  CustomDropdownMenuSub,
  CustomDropdownMenuSubContent,
  CustomDropdownMenuSubTrigger,
  CustomDropdownMenuRadioGroup,
};
