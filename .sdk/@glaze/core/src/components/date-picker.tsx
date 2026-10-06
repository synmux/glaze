import * as React from "react";
import { Slot as SlotPrimitive } from "radix-ui";
import { cn } from "../utils/cn";
import { getSystemLocale } from "../utils/locale";
import { cva, VariantProps } from "class-variance-authority";

type NativeDatePickerType = "date" | "time" | "dateAndTime";

interface NativeDatePickerContextValue {
  value: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  type: NativeDatePickerType;
  disabled: boolean;
  openPicker: () => void;
}

const NativeDatePickerContext = React.createContext<NativeDatePickerContextValue | null>(null);

function useNativeDatePickerContext() {
  const context = React.useContext(NativeDatePickerContext);
  if (!context) {
    throw new Error("NativeDatePicker components must be used within a NativeDatePicker.Root");
  }
  return context;
}

interface NativeDatePickerRootProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  type?: NativeDatePickerType;
  disabled?: boolean;
  min?: string;
  max?: string;
  children: React.ReactNode;
}

function NativeDatePickerRoot({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  type = "date",
  disabled = false,
  min,
  max,
  children,
}: NativeDatePickerRootProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const triggerRef = React.useRef<HTMLElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const setValue = React.useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange],
  );

  const nativePickerRef = React.useRef({ type, value, min, max, setValue });
  nativePickerRef.current = { type, value, min, max, setValue };

  const openPicker = React.useCallback(() => {
    if (disabled) return;

    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const { type: mode, value: currentValue, min: minVal, max: maxVal, setValue: setVal } = nativePickerRef.current;
    window.glazeAPI.dialog
      .showDatePicker({
        mode: mode,
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        initialValue: currentValue || undefined,
        min: minVal,
        max: maxVal,
      })
      .then((result) => {
        if (!result.canceled && result.value) {
          setVal(result.value);
        }
      });
  }, [disabled]);

  const contextValue = React.useMemo(
    () => ({ value, triggerRef, type, disabled, openPicker }),
    [value, type, disabled, openPicker],
  );

  return (
    <NativeDatePickerContext.Provider value={contextValue}>
      <div data-slot="date-picker" className="relative inline-flex">
        {children}
      </div>
    </NativeDatePickerContext.Provider>
  );
}

const nativeDatePickerTriggerVariants = cva(
  "text-regular flex w-fit items-center justify-between gap-2 rounded-control whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[2px] ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "border border-field hover:border-foreground-40 focus-visible:border-foreground-40",
        transparent: "bg-transparent hover:bg-control-subtle",
        glass: "bg-glass hover:bg-control-subtle",
      },
      size: {
        small: "h-7 px-2",
        medium: "h-8 px-3",
        large: "h-9 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "medium",
    },
  },
);

interface NativeDatePickerTriggerProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">,
    VariantProps<typeof nativeDatePickerTriggerVariants> {
  asChild?: boolean;
}

function NativeDatePickerTrigger({
  className,
  children,
  size,
  variant,
  asChild = false,
  ...props
}: NativeDatePickerTriggerProps) {
  const { openPicker, disabled, triggerRef } = useNativeDatePickerContext();
  const Comp = (asChild ? SlotPrimitive.Slot : "button") as React.ElementType;

  return (
    <Comp
      ref={triggerRef}
      type="button"
      data-slot="date-picker-trigger"
      className={cn(!asChild && nativeDatePickerTriggerVariants({ variant, size }), className)}
      onClick={openPicker}
      disabled={disabled}
      {...props}
    >
      {children}
    </Comp>
  );
}

interface NativeDatePickerValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
  format?: (value: string, type: NativeDatePickerType) => string;
}

function defaultFormat(value: string, type: NativeDatePickerType): string {
  if (!value) return "";
  // Pass the bridged system locale, not `undefined` — the WebView's default locale
  // ignores the user's macOS 24-hour-time setting.
  const locale = getSystemLocale();
  switch (type) {
    case "date": {
      const date = new Date(value + "T00:00:00");
      return date.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
    }
    case "time": {
      const [hours, minutes] = value.split(":");
      const date = new Date();
      date.setHours(Number(hours), Number(minutes), 0);
      return date.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
    }
    case "dateAndTime": {
      const date = new Date(value);
      return date.toLocaleString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    }
    default:
      return value;
  }
}

function NativeDatePickerValue({ placeholder, format, className, ...props }: NativeDatePickerValueProps) {
  const { value, type } = useNativeDatePickerContext();
  const formatter = format ?? defaultFormat;
  const displayValue = value ? formatter(value, type) : null;

  return (
    <span
      data-slot="date-picker-value"
      data-placeholder={!displayValue ? "" : undefined}
      className={cn("data-[placeholder]:opacity-50", className)}
      {...props}
    >
      {displayValue ?? placeholder}
    </span>
  );
}

export {
  NativeDatePickerRoot,
  NativeDatePickerTrigger,
  NativeDatePickerValue,
  type NativeDatePickerType,
  type NativeDatePickerRootProps,
  type NativeDatePickerTriggerProps,
  type NativeDatePickerValueProps,
};
