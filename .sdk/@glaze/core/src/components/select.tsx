"use client";

import * as React from "react";
import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import {
  useNativeSelect,
  type NativeSelectItem as NativeSelectItemType,
  type NativeSelectGroup as NativeSelectGroupType,
  type NativeSelectOption,
} from "../hooks/use-native-select";
import { type NativeMenuIcon } from "../utils/native-menu-helpers";
import { useNativeMenuIcon, type NativeMenuIconData } from "../hooks/use-native-menu-icon";

// These marker components render nothing; the parent reads their props to build the native menu.

interface SelectItemProps {
  /** Value for this item */
  value: string;
  /** Secondary text displayed below the label */
  sublabel?: string;
  /** Icon (SF Symbol name or image path) */
  icon?: NativeMenuIcon;
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Display text (children) */
  children: React.ReactNode;
}

function SelectItem(_props: SelectItemProps) {
  return null;
}

interface SelectGroupProps {
  children: React.ReactNode;
}

function SelectGroup(_props: SelectGroupProps) {
  return null;
}

interface SelectLabelProps {
  children: React.ReactNode;
}

function SelectLabel(_props: SelectLabelProps) {
  return null;
}

function SelectSeparator() {
  return null;
}

interface SelectContentProps {
  children: React.ReactNode;
}

function SelectContent(_props: SelectContentProps) {
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

function extractSelectItems(children: React.ReactNode): NativeSelectOption[] {
  const items: NativeSelectOption[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === SelectItem) {
      const props = child.props as SelectItemProps;
      items.push({
        value: props.value,
        label: extractLabel(props.children),
        sublabel: props.sublabel,
        icon: props.icon,
        disabled: props.disabled,
      });
    } else if (child.type === SelectSeparator) {
      items.push("separator");
    } else if (child.type === SelectGroup) {
      const groupProps = child.props as SelectGroupProps;
      const groupItems: NativeSelectItemType[] = [];
      let groupLabel: string | undefined;

      React.Children.forEach(groupProps.children, (groupChild) => {
        if (!React.isValidElement(groupChild)) return;

        if (groupChild.type === SelectLabel) {
          const labelProps = groupChild.props as SelectLabelProps;
          groupLabel = extractLabel(labelProps.children);
        } else if (groupChild.type === SelectItem) {
          const itemProps = groupChild.props as SelectItemProps;
          groupItems.push({
            value: itemProps.value,
            label: extractLabel(itemProps.children),
            sublabel: itemProps.sublabel,
            icon: itemProps.icon,
            disabled: itemProps.disabled,
          });
        }
      });

      if (groupItems.length > 0) {
        items.push({
          label: groupLabel,
          items: groupItems,
        } as NativeSelectGroupType);
      }
    } else if (child.type === React.Fragment) {
      // Handle fragments (from conditional rendering)
      const fragmentProps = child.props as { children?: React.ReactNode };
      if (fragmentProps.children) {
        items.push(...extractSelectItems(fragmentProps.children));
      }
    }
  });

  return items;
}

interface SelectContextValue {
  disabled?: boolean;
  selectedItem?: NativeSelectItemType;
  triggerRef: React.RefObject<HTMLElement | null>;
  triggerProps: ReturnType<typeof useNativeSelect>["triggerProps"];
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within a Select");
  }
  return context;
}

interface SelectProps {
  /** Currently selected value (controlled) */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Children (SelectTrigger and SelectContent) */
  children: React.ReactNode;
}

function Select({ value, defaultValue, onValueChange, disabled, children }: SelectProps) {
  let items: NativeSelectOption[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === SelectContent) {
      const props = child.props as SelectContentProps;
      items = extractSelectItems(props.children);
    }
  });

  const { selectedItem, triggerProps, triggerRef } = useNativeSelect({
    value,
    defaultValue,
    onValueChange,
    items,
    disabled,
  });

  const contextValue = React.useMemo(
    (): SelectContextValue => ({
      disabled,
      selectedItem,
      triggerRef,
      triggerProps,
    }),
    [disabled, selectedItem, triggerRef, triggerProps],
  );

  return <SelectContext.Provider value={contextValue}>{children}</SelectContext.Provider>;
}

const selectTriggerVariants = cva(
  "text-regular data-[placeholder]:text-placeholder [&_svg:not([class*='text-'])]:text-tertiary-solid aria-invalid:ring-support-red flex w-fit max-w-full overflow-hidden items-center justify-between gap-2 whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[2px] ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[size=medium]:h-8 data-[size=sm]:h-7 data-[size=large]:h-9 *:data-[slot=select-value]:min-w-0 *:data-[slot=select-value]:overflow-hidden *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "border border-field hover:border-foreground-40 focus-visible:border-foreground-40 px-3 py-2",
        // Filled chrome that matches `SegmentedControl` filled / `Input` / `NumberInput`.
        filled:
          "bg-control-subtle text-primary border border-transparent active:bg-control data-[state='open']:bg-control",
        transparent: "bg-transparent hover:bg-control-subtle -my-2",
        glass: "bg-glass hover:bg-control-subtle",
      },
      size: {
        small: "h-7 px-2",
        medium: "h-8 px-3",
        large: "h-9 px-3",
      },
      shape: {
        default: "",
        pill: "rounded-pill",
      },
    },
    compoundVariants: [
      { size: "small", shape: "default", class: "rounded-lg" },
      { size: ["medium", "large"], shape: "default", class: "rounded-control" },
    ],
  },
);

interface SelectTriggerProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "onKeyDown" | "size">,
    VariantProps<typeof selectTriggerVariants> {
  /** Hide the built-in chevron indicator */
  hideChevron?: boolean;
  /** Shape of the trigger */
  shape?: "default" | "pill";
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  (
    { className, children, size = "medium", variant = "default", shape = "default", hideChevron, ...props },
    forwardedRef,
  ) => {
    const { disabled, triggerRef, triggerProps } = useSelectContext();

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

    return (
      <button
        ref={mergedRef}
        type="button"
        data-slot="select-trigger"
        data-size={size}
        className={cn(selectTriggerVariants({ variant, size, shape }), className)}
        disabled={disabled}
        {...triggerProps}
        {...props}
      >
        {children}
        {!hideChevron && (
          <div
            className={cn(
              "shrink-0",
              variant === "transparent" && "bg-control rounded-pill size-4 grid place-items-center",
            )}
          >
            <ChevronsUpDownIcon
              className={cn("size-4 text-quaternary", variant === "transparent" && "size-3 text-primary relative")}
            />
          </div>
        )}
      </button>
    );
  },
);
SelectTrigger.displayName = "SelectTrigger";

/** Renders an icon that adapts to light/dark mode using CSS mask */
function SelectValueIcon({ iconData }: { iconData: NativeMenuIconData }) {
  if (iconData.isTemplate) {
    // Template icons use mask-image so they inherit the current text color
    return (
      <span
        className="inline-block h-3.5 w-3.5 shrink-0 bg-current mask-contain mask-no-repeat mask-center"
        style={{ maskImage: `url(${iconData.dataUrl})` }}
        aria-hidden="true"
      />
    );
  }
  // Non-template icons render as regular images with their original colors
  return <img src={iconData.dataUrl} alt="" className="h-3.5 w-auto shrink-0" aria-hidden="true" />;
}

interface SelectValueProps {
  /** Placeholder text when no value is selected */
  placeholder?: string;
  /** Custom className */
  className?: string;
}

function SelectValue({ placeholder, className }: SelectValueProps) {
  const { selectedItem } = useSelectContext();
  const iconData = useNativeMenuIcon(selectedItem?.icon);
  const hasIcon = !!selectedItem?.icon;

  return (
    <span data-slot="select-value" data-placeholder={!selectedItem ? "" : undefined} className={className}>
      {iconData ? (
        <SelectValueIcon iconData={iconData} />
      ) : (
        hasIcon && <span className="inline-block h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      )}
      <span className="truncate min-w-0">{selectedItem?.label ?? placeholder}</span>
    </span>
  );
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel, SelectSeparator };
