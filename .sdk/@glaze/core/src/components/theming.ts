/**
 * Theme model and injection.
 *
 * A theme is a flat object of metadata + primary colors + support colors.
 * Applying a theme injects one class-scoped CSS rule that overrides the
 * seed variables (`--bg`, `--fg`, …) everything else derives from. The
 * static `:root`/`.dark` values in styles.css are the default light/dark
 * themes and act as fallbacks when no theme is injected.
 *
 * Accent precedence is a pure CSS fallback chain:
 *   --accent: var(--color-system-accent, var(--theme-accent));
 * Themes write `--theme-accent`; the system accent (when injected) wins,
 * including over an active theme's accent.
 */

export type ColorHex = string;

export type Appearance = "light" | "dark";

export type ThemeMetadata = {
  id: string;
  name: string;
  isBundled?: boolean;
  appearance: Appearance;
};

export type ThemePrimaryColors<C = ColorHex> = {
  background: C;
  backgroundSecondary: C;
  foreground: C;
  accent: C;
  selection: C;
  loader: C;
};

export type PrimaryColorKey = keyof ThemePrimaryColors;

export type ThemeSupportColors<C = ColorHex> = {
  red: C;
  orange: C;
  yellow: C;
  green: C;
  blue: C;
  purple: C;
  magenta: C;
};

export type SupportColorKey = keyof ThemeSupportColors;

export type Theme<C = ColorHex> = ThemeMetadata & ThemePrimaryColors<C> & ThemeSupportColors<C>;

/** Matches the static `:root` seed values in styles.css. */
export const DEFAULT_LIGHT_THEME: Theme = {
  id: "default-light",
  name: "Glaze Light",
  isBundled: true,
  appearance: "light",
  background: "#ffffff",
  backgroundSecondary: "#ffffff",
  foreground: "#000000",
  accent: "#138af2",
  selection: "#000000",
  loader: "#000000",
  red: "#b12424",
  orange: "#c75d07",
  yellow: "#f8a300",
  green: "#006b4f",
  blue: "#138af2",
  purple: "#6a3dec",
  magenta: "#9a1b6e",
};

/** Matches the static `.dark` seed values in styles.css. */
export const DEFAULT_DARK_THEME: Theme = {
  id: "default-dark",
  name: "Glaze Dark",
  isBundled: true,
  appearance: "dark",
  background: "#000000",
  backgroundSecondary: "#000000",
  foreground: "#ffffff",
  accent: "#4fa3f8",
  selection: "#ffffff",
  loader: "#ffffff",
  red: "#ff6363",
  orange: "#ff9217",
  yellow: "#ffc531",
  green: "#59d499",
  blue: "#56c2ff",
  purple: "#a485ff",
  magenta: "#cf2f98",
};

export function isDefaultTheme(theme: Theme): boolean {
  return theme.id === DEFAULT_LIGHT_THEME.id || theme.id === DEFAULT_DARK_THEME.id;
}

export const ACTIVE_THEME_CLASS = "active-theme";
export const ACTIVE_THEME_STYLE_ELEMENT_ID = "active-theme";

/** Black for light/yellow accents, white for everything else. */
export function computeAccentContrastColor(hex: ColorHex): ColorHex {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const isYellow = r > 180 && g > 140 && b < 130;
  return isYellow ? "#000000" : "#ffffff";
}

/**
 * Builds the seed-variable override rule for a theme. Scoped as
 * `:root.<className>` so it beats the static `:root`/`.dark` defaults
 * regardless of stylesheet order (important for pre-paint injection,
 * where the rule is inserted before the bundled CSS).
 */
export function makeThemeCssRule(theme: Theme, className: string = ACTIVE_THEME_CLASS): string {
  return `
:root.${className} {
  /* primary colors */
  --bg: ${theme.background};
  --bg-secondary: ${theme.backgroundSecondary};
  --fg: ${theme.foreground};
  --theme-accent: ${theme.accent}; /* --accent resolves via var(--color-system-accent, var(--theme-accent)) */
  --accent-contrast: ${computeAccentContrastColor(theme.accent)};
  --selection: ${theme.selection};
  --loader: ${theme.loader};

  /* support colors */
  --red: ${theme.red};
  --orange: ${theme.orange};
  --yellow: ${theme.yellow};
  --green: ${theme.green};
  --blue: ${theme.blue};
  --purple: ${theme.purple};
  --magenta: ${theme.magenta};
}`;
}

function getActiveThemeStyleElement(): HTMLStyleElement {
  const existing = document.getElementById(ACTIVE_THEME_STYLE_ELEMENT_ID);
  if (existing instanceof HTMLStyleElement) return existing;
  const element = document.createElement("style");
  element.id = ACTIVE_THEME_STYLE_ELEMENT_ID;
  document.head.appendChild(element);
  return element;
}

/**
 * Applies a theme to this window: injects the seed override rule and
 * syncs the `dark` class to the theme's appearance. The caller is
 * responsible for switching the native window appearance (so the
 * material behind the WebView matches) — e.g. via nativeTheme.setThemeSource.
 */
export function injectActiveTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.add(ACTIVE_THEME_CLASS);
  root.classList.toggle("dark", theme.appearance === "dark");
  getActiveThemeStyleElement().textContent = makeThemeCssRule(theme);
  // The system accent persists over the theme accent.
  injectSystemAccentColorIfAvailable();
}

/** Removes any injected theme, falling back to the static default light/dark seeds. */
export function clearActiveTheme(): void {
  const root = document.documentElement;
  root.classList.remove(ACTIVE_THEME_CLASS);
  document.getElementById(ACTIVE_THEME_STYLE_ELEMENT_ID)?.remove();
  // `injectActiveTheme` forced the `dark` class from the theme's appearance;
  // re-sync it to the actual appearance instead of relying on a later
  // prefers-color-scheme change event (which won't fire if the appearance
  // doesn't change).
  root.classList.toggle("dark", window.matchMedia("(prefers-color-scheme: dark)").matches);
}

let systemAccentColor: ColorHex | null = null;

/**
 * Injects (or clears) the system accent color. It feeds the `--accent`
 * fallback chain and wins over the active theme's accent.
 */
export function applySystemAccentColor(hex: ColorHex | null): void {
  const root = document.documentElement;
  systemAccentColor = hex;
  if (hex) {
    root.style.setProperty("--color-system-accent", hex);
    root.style.setProperty("--accent-contrast", computeAccentContrastColor(hex));
  } else {
    root.style.removeProperty("--color-system-accent");
    root.style.removeProperty("--accent-contrast");
  }
}

/**
 * Re-syncs the inline accent properties to the last known system accent
 * (used after theme injection). Also runs when no accent is known —
 * `null` means macOS "Multicolour" and any stale inline accent (e.g. from
 * a pre-paint script) must be cleared so the theme's accent wins.
 */
export function injectSystemAccentColorIfAvailable(): void {
  applySystemAccentColor(systemAccentColor);
}
