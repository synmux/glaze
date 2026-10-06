import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";

import { cn } from "../utils/cn";
import { useWindowFocusState } from "../hooks";

type SliderSize = "small" | "medium" | "large";
type SliderContent = React.ReactNode | ((value: number) => React.ReactNode);

type BaseSliderProps = Omit<React.ComponentProps<typeof SliderPrimitive.Root>, "size">;

interface DefaultSliderProps extends BaseSliderProps {
  /**
   * `default` — slim 6px track with a visible white thumb (form / inspector slider).
   */
  variant?: "default";
}

interface FilledSliderProps extends BaseSliderProps {
  /**
   * `filled` — iOS volume-style pill: tall pill track that matches `Input variant="filled"`
   * height + radius. Drag anywhere on the track; thumb is a small pill anchored just inside
   * the filled edge.
   */
  variant: "filled";
  /** Matches `Input` / `Select` `size` so the slider stacks neatly alongside them. */
  size?: SliderSize;
  /**
   * Content rendered at the leading edge of the track (icon, label, etc.). Pass a
   * `(value) => node` function to format the live value (single-thumb only).
   */
  startContent?: SliderContent;
  /** Trailing-edge counterpart to `startContent` — typically the current value. */
  endContent?: SliderContent;
  /**
   * Fill anchor for single-thumb sliders. By default the range fills from the start
   * (left/bottom) to the thumb. Pass a value (e.g. `0` on a `-100…100` adjustment) to
   * make the fill grow from that point in either direction — Photos / Lightroom style.
   */
  origin?: number;
  /**
   * Render evenly-spaced tick marks along the track (Apple Photos / Logic style).
   * Pass `true` for a sensible default count, or a number to set the tick count
   * explicitly.
   */
  ticks?: boolean | number;
}

export type SliderProps = DefaultSliderProps | FilledSliderProps;

// Loose internal shape used inside the function body — has every prop so
// destructuring + comparisons type-check. The public `SliderProps` union still
// constrains callers (a default-variant slider can't be given filled-only props).
type SliderInternalProps = BaseSliderProps & {
  variant?: "default" | "filled";
  size?: SliderSize;
  startContent?: SliderContent;
  endContent?: SliderContent;
  origin?: number;
  ticks?: boolean | number;
};

function Slider(props: SliderProps) {
  const {
    className,
    defaultValue,
    value,
    min = 0,
    max = 100,
    variant = "default",
    size = "medium",
    orientation = "horizontal",
    startContent,
    endContent,
    origin,
    ticks,
    step = 1,
    onValueChange,
    ...rest
  } = props as SliderInternalProps;
  // Mirror the current value locally so the custom Range and overlay layers update
  // when an uncontrolled slider is dragged — Radix manages the value internally and
  // doesn't push it back through props in that mode.
  const [internalValue, setInternalValue] = React.useState<number[]>(() => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(defaultValue)) return defaultValue;
    return [min];
  });
  const _values = Array.isArray(value) ? value : internalValue;

  const handleValueChange = React.useCallback(
    (next: number[]) => {
      if (!Array.isArray(value)) setInternalValue(next);
      onValueChange?.(next);
    },
    [value, onValueChange],
  );

  const isFilled = variant === "filled";
  const isVertical = orientation === "vertical";
  const hasOverlay = isFilled && !isVertical && (startContent != null || endContent != null);
  const hasCustomOrigin = origin != null && _values.length === 1;
  const isWindowFocused = useWindowFocusState();
  // Derive a default tick count from the range — one tick per step, capped so dense
  // ranges (e.g. -100…100, step=1) don't produce hundreds of ticks. Pass a number to
  // override.
  const numericTickCount = typeof ticks === "number" && Number.isFinite(ticks) ? Math.floor(ticks) : 0;
  let tickCount =
    ticks === true
      ? Math.min(50, Math.max(2, Math.round((max - min) / step)))
      : numericTickCount > 0
        ? Math.max(2, numericTickCount)
        : 0;
  // For origin-anchored sliders, the origin should fall exactly on a tick so the
  // major tick visually centers on the handle. Currently handles the symmetric
  // (origin in the middle) case by forcing an odd tick count.
  if (tickCount > 0 && hasCustomOrigin) {
    const originPercent = ((origin! - min) / (max - min)) * 100;
    if (Math.abs(originPercent - 50) < 0.5 && tickCount % 2 === 0) tickCount += 1;
  }
  // Index of the tick that sits on the origin (used to anchor the major-tick pattern).
  const originTickIndex =
    hasCustomOrigin && tickCount > 0 ? Math.round(((origin! - min) / (max - min)) * (tickCount - 1)) : 0;

  const resolveContent = (content: SliderContent): React.ReactNode =>
    typeof content === "function" ? content(_values[0]) : content;

  // Compute fill region [start, end] as percentages of the track length so the overlay
  // clip-path and (when needed) a custom Range div both line up. With a custom `origin`,
  // the fill grows from `origin` toward `value` in either direction.
  const toPercent = (v: number) => Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));
  let fillStartPercent = 0;
  let fillEndPercent = 0;
  if (_values.length === 1) {
    const valuePercent = toPercent(_values[0]);
    if (hasCustomOrigin) {
      const originPercent = toPercent(origin!);
      fillStartPercent = Math.min(originPercent, valuePercent);
      fillEndPercent = Math.max(originPercent, valuePercent);
    } else {
      fillEndPercent = valuePercent;
    }
  }

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      data-variant={variant}
      data-window-focused={isWindowFocused}
      defaultValue={defaultValue}
      value={value}
      onValueChange={handleValueChange}
      min={min}
      max={max}
      step={step}
      orientation={orientation}
      className={cn(
        "group/slider relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        // Clip the handle by the track's rounded corners on the filled variant — the
        // Thumb is a sibling of the Track in Radix, so we move the clip up to the Root.
        isFilled && "overflow-hidden",
        isFilled && size === "small" && "rounded-lg",
        isFilled && (size === "medium" || size === "large") && "rounded-control",
        className,
      )}
      {...rest}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full",
          isFilled
            ? cn(
                "bg-control-subtle",
                size === "small" && "rounded-lg data-[orientation=horizontal]:h-7 data-[orientation=vertical]:w-7",
                size === "medium" &&
                  "rounded-control data-[orientation=horizontal]:h-8 data-[orientation=vertical]:w-8",
                size === "large" && "rounded-control data-[orientation=horizontal]:h-9 data-[orientation=vertical]:w-9",
              )
            : "bg-control rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5",
        )}
      >
        {hasCustomOrigin ? (
          <div
            aria-hidden
            data-slot="slider-range"
            className={cn(
              "absolute",
              isVertical ? "w-full" : "h-full",
              isFilled
                ? "group-data-[window-focused=true]/slider:bg-accent/30 group-data-[window-focused=false]/slider:bg-control-subtle"
                : "group-data-[window-focused=true]/slider:bg-accent group-data-[window-focused=false]/slider:bg-foreground-20",
            )}
            style={
              isVertical
                ? { bottom: `${fillStartPercent}%`, height: `${fillEndPercent - fillStartPercent}%` }
                : { left: `${fillStartPercent}%`, width: `${fillEndPercent - fillStartPercent}%` }
            }
          />
        ) : (
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={cn(
              "absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
              // Photos / Lightroom pattern: faded fill so the bright handle bar at the
              // value boundary reads as the dominant indicator. Unfocused windows fall
              // back to gray so the slider doesn't fight the desaturated chrome.
              isFilled
                ? "group-data-[window-focused=true]/slider:bg-accent/30 group-data-[window-focused=false]/slider:bg-control-subtle"
                : "group-data-[window-focused=true]/slider:bg-accent group-data-[window-focused=false]/slider:bg-foreground-20",
            )}
          />
        )}
        {tickCount > 0 && !isVertical && (
          <div
            aria-hidden
            data-slot="slider-ticks"
            className="pointer-events-none absolute inset-x-0 top-0 h-2 opacity-0 transition-opacity duration-150 group-hover/slider:opacity-100 group-has-[:focus-visible]/slider:opacity-100"
          >
            {Array.from({ length: tickCount }, (_, i) => {
              // Major ticks pivot around the origin tick (or index 0 when no origin)
              // so the tall tick lines up with the handle on centered sliders.
              const isMajor = (((i - originTickIndex) % 5) + 5) % 5 === 0;
              // Place each tick at its exact value-percentage position so they line
              // up with the handle's `transform: translateX(-50%)` placement.
              return (
                <span
                  key={i}
                  className={cn("absolute top-0 w-px -translate-x-1/2 bg-foreground-20", isMajor ? "h-full" : "h-1")}
                  style={{ left: `${(i / (tickCount - 1)) * 100}%` }}
                />
              );
            })}
          </div>
        )}
      </SliderPrimitive.Track>
      {hasOverlay && (
        <div
          aria-hidden
          data-slot="slider-overlay"
          className={cn(
            "pointer-events-none absolute inset-0 flex items-center justify-between text-primary",
            size === "small" ? "px-2 text-small" : "px-3 text-regular",
          )}
        >
          <span className="truncate">{resolveContent(startContent)}</span>
          <span className="tabular-nums shrink-0">{resolveContent(endContent)}</span>
        </div>
      )}
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            "group/thumb block shrink-0 outline-none focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
            isFilled
              ? cn(
                  // Filled thumbs span the full track height so the inner bar can run
                  // edge-to-edge (Photos handle look).
                  !isVertical && size === "small" && "h-7",
                  !isVertical && size === "medium" && "h-8",
                  !isVertical && size === "large" && "h-9",
                  isVertical && size === "small" && "w-7",
                  isVertical && size === "medium" && "w-8",
                  isVertical && size === "large" && "w-9",
                )
              : "h-4 w-5 rounded-full border-none bg-white shadow-sm ring-ring/50 focus-visible:ring-4 active:ring-4",
          )}
        >
          {isFilled &&
            (() => {
              // Hide the handle until hovered/focused — the fill itself shows state. The
              // one exception is an origin-anchored slider sitting exactly at its origin,
              // where the fill is empty and the handle is the only visible indicator.
              const valueAtOrigin = hasCustomOrigin && _values.length === 1 && _values[0] === origin;
              return (
                <span
                  aria-hidden
                  className={cn(
                    "block group-data-[window-focused=true]/slider:bg-accent/70 group-data-[window-focused=false]/slider:bg-foreground-40 group-focus-visible/thumb:ring-2 group-focus-visible/thumb:ring-ring/40 group-focus-visible/thumb:ring-offset-1",
                    isVertical ? "h-1 w-full" : "h-full w-1",
                    !valueAtOrigin &&
                      "opacity-0 transition-opacity duration-150 group-hover/slider:opacity-100 group-has-[:focus-visible]/slider:opacity-100",
                  )}
                />
              );
            })()}
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
