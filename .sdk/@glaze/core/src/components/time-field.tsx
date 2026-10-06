import * as React from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "../utils/cn";
import { prefersHour12 } from "../utils/locale";
import { timeFieldVariants } from "./time-field-variants";

/**
 * TimeField — segmented, typable time input with stepper arrows.
 * Modeled on the time field in Apple's Reminders / Calendar: each segment
 * (hour, minute, AM/PM) is separately focusable, accepts typed digits, and
 * responds to the arrow keys and the `NSStepper`-style buttons.
 *
 * Prefer this over `NativeDatePicker` with `type="time"` for time-only input —
 * the native picker renders a graphical clock face that cannot be typed into.
 *
 * Whether an AM/PM segment is shown follows the user's macOS 24-hour-time
 * setting (via the bridged system locale), overridable with `hour12`.
 * The value is always emitted on a 24-hour clock as `HH:mm`, independent of
 * how it is displayed.
 */

type TimeSegment = "hour" | "minute" | "meridiem";

interface TimeParts {
  hour: number | null;
  minute: number | null;
}

const EMPTY_PARTS: TimeParts = { hour: null, minute: null };

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function parseTime(value: string | undefined): TimeParts {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value?.trim() ?? "");
  if (!match) return EMPTY_PARTS;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return EMPTY_PARTS;

  return { hour, minute };
}

/** Serializes to the 24-hour `HH:mm` wire format, or `""` while incomplete. */
function formatWire({ hour, minute }: TimeParts): string {
  if (hour == null || minute == null) return "";
  return `${pad(hour)}:${pad(minute)}`;
}

function toHour24(displayHour: number, meridiem: "AM" | "PM"): number {
  return (displayHour % 12) + (meridiem === "PM" ? 12 : 0);
}

function wrap(value: number, length: number): number {
  return ((value % length) + length) % length;
}

type TimeFieldOwnProps = {
  /** Current time as 24-hour `HH:mm` (e.g. `"14:30"`). Omit for uncontrolled mode. */
  value?: string;
  /** Initial time (uncontrolled), same `HH:mm` format. */
  defaultValue?: string;
  /** Fires with the new 24-hour `HH:mm` value, or `""` while a segment is empty. */
  onValueChange?: (value: string) => void;
  /** Force a 12-hour (AM/PM) or 24-hour clock. Defaults to the user's system setting. */
  hour12?: boolean;
  /** Increment applied to the minute segment by the arrow keys and steppers. Defaults to `1`. */
  minuteStep?: number;
  /** Show/hide the stepper arrows. Defaults to `true`. */
  steppers?: boolean;
  disabled?: boolean;
};

export interface TimeFieldProps
  extends
    Omit<React.ComponentProps<"div">, "size" | "value" | "defaultValue" | "onChange">,
    VariantProps<typeof timeFieldVariants>,
    TimeFieldOwnProps {}

function TimeField({
  className,
  variant,
  size,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  hour12: hour12Prop,
  minuteStep = 1,
  steppers = true,
  disabled = false,
  "aria-invalid": ariaInvalid,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: TimeFieldProps) {
  const isControlled = controlledValue !== undefined;

  // Resolved once per mount. The host bakes `window.systemLocale` into a user script
  // when the webview is created, so it is fixed for this window's lifetime — a reload
  // replays the same literal; only a relaunch or a new window re-reads the system value.
  const systemHour12 = React.useMemo(() => prefersHour12(), []);
  const hour12 = hour12Prop ?? systemHour12;

  // Parts are held locally rather than derived from `value` so a half-typed time
  // ("10:--") survives, even though it serializes to `""`.
  const [parts, setParts] = React.useState<TimeParts>(() => parseTime(isControlled ? controlledValue : defaultValue));
  const wire = formatWire(parts);

  // Adopt controlled values that disagree with what we hold — including a parent
  // rejecting or normalizing an edit. Incomplete entry emits `""`, which matches
  // the parent's echoed value, so typing is not interrupted.
  React.useEffect(() => {
    if (!isControlled || controlledValue === wire) return;
    setParts(parseTime(controlledValue));
  }, [isControlled, controlledValue, wire]);

  const segments: TimeSegment[] = hour12 ? ["hour", "minute", "meridiem"] : ["hour", "minute"];
  const segmentRefs = React.useRef<Partial<Record<TimeSegment, HTMLDivElement | null>>>({});

  // Digits typed so far in the segment being edited, so "1" then "0" reads as 10.
  const [buffer, setBuffer] = React.useState<{ segment: TimeSegment; digits: string } | null>(null);
  const [focusedSegment, setFocusedSegment] = React.useState<TimeSegment | null>(null);

  const meridiem: "AM" | "PM" = (parts.hour ?? 0) >= 12 ? "PM" : "AM";
  const displayHour = parts.hour == null ? null : hour12 ? parts.hour % 12 || 12 : parts.hour;

  const update = (next: TimeParts) => {
    setParts(next);
    const nextWire = formatWire(next);
    if (nextWire !== wire) onValueChange?.(nextWire);
  };

  const focusSegment = (segment: TimeSegment | undefined) => {
    if (segment) segmentRefs.current[segment]?.focus();
  };

  const moveFocus = (from: TimeSegment, direction: 1 | -1) => {
    focusSegment(segments[segments.indexOf(from) + direction]);
  };

  const setMeridiem = (next: "AM" | "PM") => {
    if (next === meridiem) return;
    // With no hour yet, land on 12 AM / 12 PM rather than silently doing nothing.
    update({ ...parts, hour: parts.hour == null ? toHour24(12, next) : toHour24(parts.hour % 12 || 12, next) });
  };

  const step = (segment: TimeSegment, direction: 1 | -1) => {
    setBuffer(null);

    if (segment === "meridiem") {
      setMeridiem(meridiem === "AM" ? "PM" : "AM");
      return;
    }

    if (segment === "hour") {
      // Stepping the absolute hour flips AM/PM across noon/midnight, matching NSDatePicker.
      update({ ...parts, hour: parts.hour == null ? 0 : wrap(parts.hour + direction, 24) });
      return;
    }

    update({ ...parts, minute: parts.minute == null ? 0 : wrap(parts.minute + direction * minuteStep, 60) });
  };

  const clear = (segment: TimeSegment) => {
    setBuffer(null);
    if (segment === "hour") update({ ...parts, hour: null });
    else if (segment === "minute") update({ ...parts, minute: null });
  };

  const typeDigit = (segment: TimeSegment, digit: number) => {
    const isHour = segment === "hour";
    const max = isHour ? (hour12 ? 12 : 23) : 59;
    const previous = buffer?.segment === segment ? buffer.digits : "";

    let digits = previous + String(digit);
    // Overflowing the segment restarts entry from the digit just typed, so typing
    // 5 then 9 in a 12-hour field reads as 9 rather than being rejected.
    if (Number(digits) > max) digits = String(digit);

    const candidate = Number(digits);

    // "0" is not a valid 12-hour hour on its own — hold it for a second digit.
    if (isHour && hour12 && candidate === 0) {
      setBuffer({ segment, digits: "0" });
      return;
    }

    update(
      isHour
        ? { ...parts, hour: hour12 ? toHour24(candidate, meridiem) : candidate }
        : {
            ...parts,
            minute: candidate,
          },
    );

    // Advance once the segment can take no further digit.
    if (digits.length >= 2 || candidate * 10 > max) {
      setBuffer(null);
      moveFocus(segment, 1);
    } else {
      setBuffer({ segment, digits });
    }
  };

  const handleKeyDown = (segment: TimeSegment) => (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        step(segment, 1);
        return;
      case "ArrowDown":
        event.preventDefault();
        step(segment, -1);
        return;
      case "ArrowLeft":
        event.preventDefault();
        moveFocus(segment, -1);
        return;
      case "ArrowRight":
        event.preventDefault();
        moveFocus(segment, 1);
        return;
      case "Backspace":
      case "Delete":
        event.preventDefault();
        clear(segment);
        return;
    }

    if (segment === "meridiem") {
      const key = event.key.toLowerCase();
      if (key === "a" || key === "p") {
        event.preventDefault();
        setMeridiem(key === "a" ? "AM" : "PM");
      }
      return;
    }

    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      typeDigit(segment, Number(event.key));
    }
  };

  const renderSegment = (segment: TimeSegment) => {
    const isMeridiem = segment === "meridiem";
    const numericValue = segment === "hour" ? displayHour : parts.minute;
    const isEmpty = !isMeridiem && numericValue == null;

    let text: string;
    if (isMeridiem) text = meridiem;
    else if (numericValue == null) text = "--";
    else text = pad(numericValue);

    const bounds = segment === "hour" ? { min: hour12 ? 1 : 0, max: hour12 ? 12 : 23 } : { min: 0, max: 59 };

    return (
      <div
        key={segment}
        ref={(node) => {
          segmentRefs.current[segment] = node;
        }}
        role="spinbutton"
        tabIndex={disabled ? -1 : 0}
        aria-label={segment === "meridiem" ? "AM/PM" : segment}
        aria-valuenow={isMeridiem ? undefined : (numericValue ?? undefined)}
        aria-valuemin={isMeridiem ? undefined : bounds.min}
        aria-valuemax={isMeridiem ? undefined : bounds.max}
        aria-valuetext={text}
        aria-disabled={disabled || undefined}
        data-slot={`time-field-${segment}`}
        onKeyDown={handleKeyDown(segment)}
        onFocus={() => setFocusedSegment(segment)}
        onBlur={() => {
          setFocusedSegment((current) => (current === segment ? null : current));
          setBuffer(null);
        }}
        className={cn(
          "rounded-[4px] px-0.5 tabular-nums outline-none select-none",
          "focus:bg-accent focus:text-accent-contrast",
          isEmpty && "text-placeholder",
        )}
      >
        {text}
      </div>
    );
  };

  return (
    <div
      aria-invalid={ariaInvalid}
      // `htmlFor` cannot reach this widget: neither the group nor its spinbutton
      // segments are labelable elements, so a visible label is associated with
      // `aria-labelledby`. Only fall back to a generic name when neither is given.
      aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : "Time")}
      aria-labelledby={ariaLabelledBy}
      role="group"
      data-slot="time-field"
      data-disabled={disabled ? "" : undefined}
      className={cn(timeFieldVariants({ variant, size }), className)}
      {...props}
    >
      <div
        data-slot="time-field-segments"
        className={cn("flex items-center", size === "small" ? "pl-1.5" : "pl-3", {
          "pr-1.5": !steppers && size === "small",
          "pr-3": !steppers && size !== "small",
        })}
      >
        {renderSegment("hour")}
        <span aria-hidden className="text-secondary">
          :
        </span>
        {renderSegment("minute")}
        {hour12 && (
          <>
            <span aria-hidden className="w-1" />
            {renderSegment("meridiem")}
          </>
        )}
      </div>

      {steppers && (
        <div
          data-slot="time-field-steppers"
          className="my-1 mr-1 ml-1.5 flex shrink-0 flex-col self-stretch overflow-hidden rounded-pill bg-control"
        >
          {([1, -1] as const).map((direction) => (
            <React.Fragment key={direction}>
              {direction === -1 && (
                <div aria-hidden className="mx-0.5 h-px bg-separator [@media(min-resolution:2dppx)]:h-[0.5px]" />
              )}
              <button
                type="button"
                tabIndex={-1}
                aria-label={direction === 1 ? "Increment" : "Decrement"}
                disabled={disabled}
                onMouseDown={(event) => {
                  // Keep focus on the segment being stepped rather than the button.
                  event.preventDefault();
                  const target = focusedSegment ?? "hour";
                  step(target, direction);
                  focusSegment(target);
                }}
                className={cn(
                  "flex flex-1 items-center justify-center text-secondary outline-none active:bg-control-active active:text-primary",
                  size === "large" ? "px-1" : size === "medium" ? "px-[3px]" : "px-0.5",
                )}
              >
                {direction === 1 ? (
                  <ChevronUpIcon className="size-2" strokeWidth={2.25} />
                ) : (
                  <ChevronDownIcon className="size-2" strokeWidth={2.25} />
                )}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
TimeField.displayName = "TimeField";

export { TimeField };
