import * as React from "react";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils/cn";

/**
 * NumberInput — compact numeric input with optional unit suffix and stepper arrows.
 * Modeled on Apple's `NSStepper` + `NSTextField` combo seen throughout Xcode / Pages
 * inspectors.
 *
 * Uses a real `<input type="number">` under the hood so browser number semantics
 * (keyboard arrows, scroll wheel, min/max clamping, locale formatting) still apply.
 * The visible stepper buttons are sugar on top — both surfaces round-trip through
 * the same `onValueChange` callback with a parsed number.
 *
 * When a NumberInput is placed in an `InspectorRow`, keep `size="small"` for the
 * Pages-style density. Use `medium` (default) in standalone forms.
 */

const numberInputVariants = cva(
  cn(
    "flex items-center min-w-0 overflow-hidden transition-[color,border-color,background-color]",
    "aria-invalid:ring-support-red/20 aria-invalid:border-support-red/40",
    "has-[input:disabled]:pointer-events-none has-[input:disabled]:opacity-50",
  ),
  {
    variants: {
      variant: {
        default: "border border-field bg-transparent focus-within:border-foreground-40",
        // Keep a transparent border so invalid/focus border colors can be surfaced.
        filled: "border border-transparent bg-control-subtle focus-within:bg-control",
      },
      // Size-proportional radius: small (inspector density) → subtle rounded-square,
      // medium/large keep the roomier `rounded-control`.
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

type NumberInputOwnProps = {
  /** Current value. Omit to use uncontrolled mode (e.g. `defaultValue`). Pass `null` for empty controlled state. */
  value?: number | null;
  /** Fires whenever the user changes the number. `null` when the input is cleared. */
  onValueChange?: (value: number | null) => void;
  /** Suffix rendered inside the input, to the right of the value (e.g. "pt", "px", "%"). */
  unit?: React.ReactNode;
  /** Show/hide the stepper arrows. Defaults to `true`. */
  steppers?: boolean;
};

export interface NumberInputProps
  extends
    Omit<React.ComponentProps<"input">, "size" | "value" | "onChange" | "type">,
    VariantProps<typeof numberInputVariants>,
    NumberInputOwnProps {}

function NumberInput({
  className,
  size,
  variant,
  value,
  onValueChange,
  unit,
  steppers = true,
  min,
  max,
  step = 1,
  disabled,
  "aria-invalid": ariaInvalid,
  ref,
  ...props
}: NumberInputProps & { ref?: React.Ref<HTMLInputElement> }) {
  const innerRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

  const isControlled = value !== undefined;
  const inputValue = isControlled ? (value == null ? "" : String(value)) : undefined;

  const clamp = React.useCallback(
    (next: number) => {
      let result = next;
      if (typeof min === "number" && result < min) result = min;
      if (typeof max === "number" && result > max) result = max;
      return result;
    },
    [min, max],
  );

  const nudge = (direction: 1 | -1) => {
    if (disabled) return;
    const stepValue = typeof step === "number" ? step : Number(step) || 1;

    if (isControlled) {
      const base = value == null ? 0 : value;
      onValueChange?.(clamp(base + direction * stepValue));
      innerRef.current?.focus();
      return;
    }

    const input = innerRef.current;
    if (input == null) return;

    const base = input.value === "" ? 0 : Number(input.value);
    const next = clamp((Number.isNaN(base) ? 0 : base) + direction * stepValue);
    input.value = String(next);
    onValueChange?.(next);
    innerRef.current?.focus();
  };

  return (
    <div
      aria-invalid={ariaInvalid}
      className={cn(numberInputVariants({ variant, size }), className)}
      data-slot="number-input"
    >
      <input
        ref={innerRef}
        type="number"
        value={inputValue}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") {
            onValueChange?.(null);
            return;
          }
          const parsed = Number(raw);
          if (!Number.isNaN(parsed)) {
            onValueChange?.(parsed);
          }
        }}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        data-slot="number-input-field"
        className={cn(
          "min-w-0 flex-1 bg-transparent outline-none tabular-nums",
          // Size-aware horizontal padding — small (inspector density) gets a tighter
          // `px-1.5` so the digits don't float in a sea of whitespace inside the
          // narrow rounded-square chrome.
          size === "small" ? "pl-1.5" : "pl-3",
          // Right-align digits so they abut the trailing unit instead of being
          // stranded at the left edge with a pool of empty space between.
          unit != null ? "text-right" : "text-left",
          "placeholder:text-placeholder selection:bg-selection-40 selection:text-primary",
          // Hide the native browser steppers — we render our own.
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        )}
        {...props}
      />
      {unit != null && (
        <span
          aria-hidden
          data-slot="number-input-unit"
          className={cn(
            "pointer-events-none text-tertiary text-regular tabular-nums select-none",
            // Tight left-side gutter — the input's `text-right` pushes digits
            // against this edge, so only a tiny visual breather is needed.
            "pl-0.5",
            size === "small" ? "pr-1.5" : "pr-2",
          )}
        >
          {unit}
        </span>
      )}
      {steppers && (
        <div
          data-slot="number-input-steppers"
          className="flex shrink-0 flex-col self-stretch my-1 mr-1 overflow-hidden rounded-pill bg-control"
        >
          <button
            type="button"
            tabIndex={-1}
            aria-label="Increment"
            disabled={disabled}
            onMouseDown={(e) => {
              e.preventDefault();
              nudge(1);
            }}
            className={cn(
              "flex flex-1 items-center justify-center text-secondary active:bg-control-active active:text-primary focus-visible:ring-1 focus-visible:ring-ring outline-none",
              size === "large" ? "px-1" : size === "medium" ? "px-[3px]" : "px-0.5",
            )}
          >
            <ChevronUpIcon className="size-2" strokeWidth={2.25} />
          </button>
          <div aria-hidden className="h-px mx-0.5 bg-separator [@media(min-resolution:2dppx)]:h-[0.5px]" />
          <button
            type="button"
            tabIndex={-1}
            aria-label="Decrement"
            disabled={disabled}
            onMouseDown={(e) => {
              e.preventDefault();
              nudge(-1);
            }}
            className={cn(
              "flex flex-1 items-center justify-center text-secondary active:bg-control-active active:text-primary focus-visible:ring-1 focus-visible:ring-ring outline-none",
              size === "large" ? "px-1" : size === "medium" ? "px-[3px]" : "px-0.5",
            )}
          >
            <ChevronDownIcon className="size-2" strokeWidth={2.25} />
          </button>
        </div>
      )}
    </div>
  );
}
NumberInput.displayName = "NumberInput";

export { NumberInput };
