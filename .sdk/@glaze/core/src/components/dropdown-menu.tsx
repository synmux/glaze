"use client";

import * as React from "react";
import { Slot } from "radix-ui";
import {
  useNativeDropdownMenu,
  type NativeMenuItem,
  type NativeMenuIcon,
  type DropdownMenuSide,
  type DropdownMenuAlign,
} from "../hooks/use-native-dropdown-menu";
import { type MenuItemColor } from "../backend/menu.js";

// These marker components render nothing; the parent reads their props to build the native menu.

interface DropdownMenuItemProps {
  icon?: NativeMenuIcon;
  sublabel?: string;
  accelerator?: string;
  disabled?: boolean;
  color?: MenuItemColor;
  iconColor?: MenuItemColor;
  onSelect?: () => void;
  children: React.ReactNode;
}

function DropdownMenuItem(_props: DropdownMenuItemProps) {
  return null;
}

interface DropdownMenuCheckboxItemProps {
  icon?: NativeMenuIcon;
  sublabel?: string;
  accelerator?: string;
  disabled?: boolean;
  color?: MenuItemColor;
  iconColor?: MenuItemColor;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children: React.ReactNode;
}

function DropdownMenuCheckboxItem(_props: DropdownMenuCheckboxItemProps) {
  return null;
}

function DropdownMenuSeparator() {
  return null;
}

interface DropdownMenuLabelProps {
  children: React.ReactNode;
}

function DropdownMenuLabel(_props: DropdownMenuLabelProps) {
  return null;
}

interface DropdownMenuSubProps {
  label: string;
  icon?: NativeMenuIcon;
  disabled?: boolean;
  color?: MenuItemColor;
  iconColor?: MenuItemColor;
  children: React.ReactNode;
}

function DropdownMenuSub(_props: DropdownMenuSubProps) {
  return null;
}

interface DropdownMenuGroupProps {
  children: React.ReactNode;
}

function DropdownMenuGroup(_props: DropdownMenuGroupProps) {
  return null;
}

function extractLabel(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractLabel).join("");
  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode };
    if (props.children) {
      return extractLabel(props.children);
    }
  }
  return "";
}

function extractMenuItems(children: React.ReactNode): NativeMenuItem[] {
  const items: NativeMenuItem[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === DropdownMenuItem) {
      const props = child.props as DropdownMenuItemProps;
      items.push({
        type: "normal",
        label: extractLabel(props.children),
        sublabel: props.sublabel,
        icon: props.icon,
        accelerator: props.accelerator,
        enabled: !props.disabled,
        color: props.color,
        iconColor: props.iconColor,
        onSelect: props.onSelect,
      });
    } else if (child.type === DropdownMenuCheckboxItem) {
      const props = child.props as DropdownMenuCheckboxItemProps;
      items.push({
        type: "checkbox",
        label: extractLabel(props.children),
        sublabel: props.sublabel,
        icon: props.icon,
        accelerator: props.accelerator,
        enabled: !props.disabled,
        color: props.color,
        iconColor: props.iconColor,
        checked: props.checked,
        onCheckedChange: props.onCheckedChange,
      });
    } else if (child.type === DropdownMenuSeparator) {
      items.push({ type: "separator" });
    } else if (child.type === DropdownMenuLabel) {
      const props = child.props as DropdownMenuLabelProps;
      items.push({
        type: "normal",
        label: extractLabel(props.children),
        enabled: false,
      });
    } else if (child.type === DropdownMenuSub) {
      const props = child.props as DropdownMenuSubProps;
      items.push({
        type: "submenu",
        label: props.label,
        icon: props.icon,
        enabled: !props.disabled,
        color: props.color,
        iconColor: props.iconColor,
        submenu: extractMenuItems(props.children),
      });
    } else if (child.type === DropdownMenuGroup) {
      const props = child.props as DropdownMenuGroupProps;
      items.push(...extractMenuItems(props.children));
    } else if (child.type === React.Fragment) {
      // Handle fragments (from conditional rendering)
      const fragmentProps = child.props as { children?: React.ReactNode };
      if (fragmentProps.children) {
        items.push(...extractMenuItems(fragmentProps.children));
      }
    }
  });

  return items;
}

interface DropdownMenuContextValue {
  disabled?: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
  triggerProps: ReturnType<typeof useNativeDropdownMenu>["triggerProps"];
  openMenu: ReturnType<typeof useNativeDropdownMenu>["openMenu"];
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenu components must be used within a DropdownMenu");
  }
  return context;
}

interface DropdownMenuProps {
  /** Element whose bounds position the menu. Falls back to the trigger when omitted or unavailable. */
  anchorRef?: React.RefObject<HTMLElement | null>;
  disabled?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  children: React.ReactNode;
}

function DropdownMenu({ anchorRef, disabled, onClose, onOpen, children }: DropdownMenuProps) {
  let items: NativeMenuItem[] = [];
  let side: DropdownMenuSide = "bottom";
  let align: DropdownMenuAlign = "start";
  let sideOffset = 8;
  let alignOffset = 0;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    // Check by type reference or displayName (handles bundling edge cases)
    const isContent =
      child.type === DropdownMenuContent ||
      (typeof child.type === "function" &&
        (child.type as { displayName?: string }).displayName === "DropdownMenuContent");
    if (isContent) {
      const props = child.props as DropdownMenuContentProps;
      items = extractMenuItems(props.children);
      if (props.side) side = props.side;
      if (props.align) align = props.align;
      if (props.sideOffset !== undefined) sideOffset = props.sideOffset;
      if (props.alignOffset !== undefined) alignOffset = props.alignOffset;
    }
  });

  const { triggerProps, triggerRef, openMenu } = useNativeDropdownMenu({
    items,
    anchorRef,
    disabled,
    side,
    align,
    sideOffset,
    alignOffset,
    onClose,
    onOpen,
  });

  const contextValue = React.useMemo(
    (): DropdownMenuContextValue => ({
      disabled,
      triggerRef,
      triggerProps,
      openMenu,
    }),
    [disabled, triggerRef, triggerProps, openMenu],
  );

  return <DropdownMenuContext.Provider value={contextValue}>{children}</DropdownMenuContext.Provider>;
}

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ asChild, children, ...props }, forwardedRef) => {
    const { disabled, triggerRef, triggerProps } = useDropdownMenuContext();

    const mergedRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [triggerRef, forwardedRef],
    );

    const Comp = (asChild ? Slot.Slot : "button") as React.ElementType;

    return (
      <Comp
        ref={mergedRef}
        type={asChild ? undefined : "button"}
        data-slot="dropdown-menu-trigger"
        disabled={disabled}
        {...triggerProps}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

interface DropdownMenuContentProps {
  side?: DropdownMenuSide;
  align?: DropdownMenuAlign;
  sideOffset?: number;
  alignOffset?: number;
  children: React.ReactNode;
}

function DropdownMenuContent(_props: DropdownMenuContentProps) {
  return null;
}
DropdownMenuContent.displayName = "DropdownMenuContent";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuGroup,
};

export type { NativeMenuIcon, DropdownMenuSide, DropdownMenuAlign };
