"use client";

import * as React from "react";
import { showNativeViewMenu, type NativeMenuItem, type NativeMenuIcon } from "../utils/native-menu-helpers";
import { type MenuItemColor } from "../backend/menu.js";

const CONTEXT_MENU_CURSOR_OFFSET = 4;

// These marker components render nothing; the parent reads their props to build the native menu.

interface ContextMenuItemProps {
  icon?: NativeMenuIcon;
  sublabel?: string;
  accelerator?: string;
  disabled?: boolean;
  color?: MenuItemColor;
  iconColor?: MenuItemColor;
  onSelect?: () => void;
  children: React.ReactNode;
}

function ContextMenuItem(_props: ContextMenuItemProps) {
  return null;
}

interface ContextMenuCheckboxItemProps {
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

function ContextMenuCheckboxItem(_props: ContextMenuCheckboxItemProps) {
  return null;
}

function ContextMenuSeparator() {
  return null;
}

interface ContextMenuLabelProps {
  children: React.ReactNode;
}

function ContextMenuLabel(_props: ContextMenuLabelProps) {
  return null;
}

interface ContextMenuSubProps {
  label: string;
  icon?: NativeMenuIcon;
  disabled?: boolean;
  color?: MenuItemColor;
  iconColor?: MenuItemColor;
  children: React.ReactNode;
}

function ContextMenuSub(_props: ContextMenuSubProps) {
  return null;
}

interface ContextMenuGroupProps {
  children: React.ReactNode;
}

function ContextMenuGroup(_props: ContextMenuGroupProps) {
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

    if (child.type === ContextMenuItem) {
      const props = child.props as ContextMenuItemProps;
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
    } else if (child.type === ContextMenuCheckboxItem) {
      const props = child.props as ContextMenuCheckboxItemProps;
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
    } else if (child.type === ContextMenuSeparator) {
      items.push({ type: "separator" });
    } else if (child.type === ContextMenuLabel) {
      const props = child.props as ContextMenuLabelProps;
      items.push({
        type: "normal",
        label: extractLabel(props.children),
        enabled: false,
      });
    } else if (child.type === ContextMenuSub) {
      const props = child.props as ContextMenuSubProps;
      items.push({
        type: "submenu",
        label: props.label,
        icon: props.icon,
        enabled: !props.disabled,
        color: props.color,
        iconColor: props.iconColor,
        submenu: extractMenuItems(props.children),
      });
    } else if (child.type === ContextMenuGroup) {
      const props = child.props as ContextMenuGroupProps;
      items.push(...extractMenuItems(props.children));
    } else if (child.type === React.Fragment) {
      // Handle fragments (from conditional rendering)
      items.push(...extractMenuItems((child.props as { children: React.ReactNode }).children));
    }
  });

  return items;
}

interface ContextMenuContextValue {
  disabled?: boolean;
  onContextMenu: (event: React.MouseEvent) => void;
}

const ContextMenuContext = React.createContext<ContextMenuContextValue | null>(null);

function useContextMenuContext() {
  const context = React.useContext(ContextMenuContext);
  if (!context) {
    throw new Error("ContextMenu components must be used within a ContextMenu");
  }
  return context;
}

interface ContextMenuProps {
  disabled?: boolean;
  highlightTrigger?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  children: React.ReactNode;
}

function ContextMenu({ disabled, highlightTrigger = true, onClose, onOpen, children }: ContextMenuProps) {
  const itemsRef = React.useRef<NativeMenuItem[]>([]);

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const isContent =
      child.type === ContextMenuContent ||
      (typeof child.type === "function" &&
        (child.type as { displayName?: string }).displayName === "ContextMenuContent");
    if (isContent) {
      const props = child.props as ContextMenuContentProps;
      itemsRef.current = extractMenuItems(props.children);
    }
  });

  const handleContextMenu = React.useCallback(
    async (event: React.MouseEvent) => {
      if (disabled) return;

      event.preventDefault();
      event.stopPropagation();

      // Set the highlight attribute imperatively on the DOM element to avoid
      // a React re-render that would interfere with the native menu popup.
      const triggerElement = event.currentTarget as HTMLElement;
      if (highlightTrigger && triggerElement.tagName !== "TR") {
        triggerElement.setAttribute("data-context-menu-open", "");
      }

      try {
        onOpen?.();
        await showNativeViewMenu(itemsRef.current, {
          x: event.clientX + CONTEXT_MENU_CURSOR_OFFSET,
          y: event.clientY + CONTEXT_MENU_CURSOR_OFFSET,
        });
      } finally {
        triggerElement.removeAttribute("data-context-menu-open");
        onClose?.();
      }
    },
    [disabled, highlightTrigger, onOpen, onClose],
  );

  const contextValue = React.useMemo(
    (): ContextMenuContextValue => ({
      disabled,
      onContextMenu: handleContextMenu,
    }),
    [disabled, handleContextMenu],
  );

  return <ContextMenuContext.Provider value={contextValue}>{children}</ContextMenuContext.Provider>;
}

interface ContextMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

function ContextMenuTrigger({ asChild, children }: ContextMenuTriggerProps) {
  const { disabled, onContextMenu } = useContextMenuContext();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onContextMenu?: React.MouseEventHandler }>, {
      onContextMenu: disabled ? undefined : onContextMenu,
    });
  }

  return (
    <span data-slot="context-menu-trigger" onContextMenu={disabled ? undefined : onContextMenu}>
      {children}
    </span>
  );
}
ContextMenuTrigger.displayName = "ContextMenuTrigger";

interface ContextMenuContentProps {
  children: React.ReactNode;
}

function ContextMenuContent(_props: ContextMenuContentProps) {
  return null;
}
ContextMenuContent.displayName = "ContextMenuContent";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuSub,
  ContextMenuGroup,
};

export type { NativeMenuIcon };
