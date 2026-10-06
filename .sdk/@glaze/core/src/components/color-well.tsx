import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils/cn";

/**
 * ColorWell — a small interactive swatch that opens the browser's native color
 * picker. Modeled on Apple's `NSColorWell`. Compact enough to sit inside an
 * `InspectorRow` next to other filled controls.
 *
 * Implementation is a visually-styled swatch with an overlaid invisible
 * `<input type="color">`. Clicking anywhere on the well opens the native picker.
 */

/**
 * Theme-aware checker palette exposed as CSS custom properties. `swatchBackground`
 * reads `var(--checker-a)` (base / "holes") and `var(--checker-b)` (tile squares).
 * In dark mode both tokens shift to a pair of dark grays so the empty state and
 * alpha checker don't blaze bright-white over a dark panel.
 */
const CHECKER_VARS =
  "[--checker-a:#f3f4f6] [--checker-b:#d1d5db] dark:[--checker-a:#27272a] dark:[--checker-b:#18181b]";

const swatchSizeVariants = cva(
  cn("shrink-0 transition-[box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-ring", CHECKER_VARS),
  {
    variants: {
      size: {
        // Matches `h-7 / h-8 / h-9` on Button / Input / NumberInput so a ColorWell
        // sits flush with them in an InspectorRow. Radius scales with size —
        // smaller wells use tighter corners to feel sharp at inspector density,
        // larger wells get a touch more softness. Always stays a rounded square.
        small: "size-7 rounded-md",
        medium: "size-8 rounded-lg",
        large: "size-9 rounded-control",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  },
);

/**
 * Swatch background styling. Three cases:
 *
 *   1. No color (empty state)    → checkerboard only, light-gray base
 *   2. Opaque color              → single flat `background-color`, no checker
 *      (avoids sub-pixel stripe artifacts where the solid overlay meets the checker)
 *   3. Color with alpha channel  → color layer on top of checker so transparency shows
 */
function swatchBackground(value: string | null | undefined): React.CSSProperties {
  if (!value) {
    return {
      backgroundColor: "var(--checker-a)",
      backgroundImage: CHECKER_LAYERS,
      backgroundSize: "8px 8px, 8px 8px",
      backgroundPosition: "0 0, 4px 4px",
    };
  }

  if (!hasAlpha(value)) {
    return { backgroundColor: value };
  }

  return {
    backgroundColor: "var(--checker-a)",
    backgroundImage: `linear-gradient(${value}, ${value}), ${CHECKER_LAYERS}`,
    backgroundSize: "100% 100%, 8px 8px, 8px 8px",
    backgroundPosition: "0 0, 0 0, 4px 4px",
  };
}

const CHECKER_LAYERS =
  "linear-gradient(45deg, var(--checker-b) 25%, transparent 25%, transparent 75%, var(--checker-b) 75%)," +
  "linear-gradient(45deg, var(--checker-b) 25%, transparent 25%, transparent 75%, var(--checker-b) 75%)";

/** True when the CSS color string carries a transparency / alpha channel. */
function hasAlpha(value: string): boolean {
  const v = value.trim().toLowerCase();
  if (v === "transparent") return true;
  const hex = v.match(/^#([0-9a-f]{6})([0-9a-f]{2})$/);
  if (hex) return hex[2] !== "ff";
  if (/^(rgba|hsla)\(/.test(v)) {
    const m = v.match(/[,\s]([\d.]+%?)\s*\)$/);
    if (m) {
      const raw = m[1];
      const n = raw.endsWith("%") ? parseFloat(raw) / 100 : parseFloat(raw);
      return !Number.isNaN(n) && n < 1;
    }
  }
  return false;
}

/** Normalize any CSS color string to a 6-char hex so `<input type="color">` accepts it. */
function toHex6(value: string | null | undefined): string {
  if (!value) return "#000000";
  const m = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (!m) return "#000000";
  const hex = m[1];
  if (hex.length === 3) {
    return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }
  return `#${hex.slice(0, 6)}`;
}

type ColorWellProps = Omit<React.ComponentProps<"input">, "onChange" | "value" | "type" | "size"> &
  VariantProps<typeof swatchSizeVariants> & {
    /** CSS color value — hex (`#RRGGBB` / `#RRGGBBAA`) or any CSS color. Omit / pass
     *  `null` for the empty state (renders just the checkerboard). */
    value?: string | null;
    /** Fires when the user picks a new color. Omit to render a read-only swatch. */
    onChange?: (value: string) => void;
    /** Display-only swatch; no picker, not focusable. */
    readOnly?: boolean;
  };

function ColorWell({ value, onChange, size, readOnly, className, ...props }: ColorWellProps) {
  if (readOnly) {
    return (
      <span
        data-slot="color-well"
        aria-label={props["aria-label"] ?? (value ? `Color ${value}` : "No color")}
        className={cn("inline-block", swatchSizeVariants({ size, className }), "cursor-default")}
        style={swatchBackground(value)}
      />
    );
  }

  const labelSuffix = value ? `, current ${value}` : "";

  return (
    <span
      data-slot="color-well"
      className={cn("relative inline-block", swatchSizeVariants({ size, className }))}
      style={swatchBackground(value)}
    >
      {/* Invisible `<input type="color">` overlaying the swatch. Clicking anywhere
          on the well opens the browser's native picker. */}
      <input
        type="color"
        value={toHex6(value)}
        onChange={(e) => onChange?.(e.target.value)}
        aria-label={props["aria-label"] ?? `Pick color${labelSuffix}`}
        className="absolute inset-0 w-full h-full rounded-[inherit] opacity-0 cursor-default"
        {...props}
      />
    </span>
  );
}
ColorWell.displayName = "ColorWell";

export { ColorWell };
