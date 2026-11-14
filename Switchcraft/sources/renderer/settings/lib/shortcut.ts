const MODIFIER_GLYPHS: Record<string, string> = {
  Control: "⌃",
  Alt: "⌥",
  Shift: "⇧",
  Command: "⌘",
};

const KEY_GLYPHS: Record<string, string> = {
  Space: "Space",
  Tab: "⇥",
  Return: "↩",
  Backspace: "⌫",
  Delete: "⌦",
  Up: "↑",
  Down: "↓",
  Left: "←",
  Right: "→",
  Home: "↖",
  End: "↘",
  PageUp: "⇞",
  PageDown: "⇟",
};

const CODE_KEYS: Record<string, string> = {
  Space: "Space",
  Tab: "Tab",
  Enter: "Return",
  NumpadEnter: "Return",
  Backspace: "Backspace",
  Delete: "Delete",
  ArrowUp: "Up",
  ArrowDown: "Down",
  ArrowLeft: "Left",
  ArrowRight: "Right",
  Home: "Home",
  End: "End",
  PageUp: "PageUp",
  PageDown: "PageDown",
};

const MODIFIER_KEYS = new Set([
  "Shift",
  "Control",
  "Alt",
  "Meta",
  "CapsLock",
  "Fn",
]);

/** "Control+Alt+K" → ["⌃", "⌥", "K"] */
export function acceleratorGlyphs(accelerator: string): string[] {
  return accelerator
    .split("+")
    .map((part) => MODIFIER_GLYPHS[part] ?? KEY_GLYPHS[part] ?? part);
}

function keyFromCode(code: string): string | null {
  if (/^Key[A-Z]$/.test(code)) return code.slice(3);
  if (/^Digit[0-9]$/.test(code)) return code.slice(5);
  if (/^F([1-9]|1[0-9]|20)$/.test(code)) return code;
  return CODE_KEYS[code] ?? null;
}

export type RecordedKey =
  | { kind: "modifierOnly" }
  | { kind: "invalid" }
  | { kind: "shortcut"; accelerator: string };

/** Converts a keydown into an accelerator in ⌃⌥⇧⌘ order, using the physical key. */
export function acceleratorFromEvent(event: KeyboardEvent): RecordedKey {
  if (MODIFIER_KEYS.has(event.key)) return { kind: "modifierOnly" };
  const key = keyFromCode(event.code);
  if (!key) return { kind: "invalid" };
  const parts: string[] = [];
  if (event.ctrlKey) parts.push("Control");
  if (event.altKey) parts.push("Alt");
  if (event.shiftKey) parts.push("Shift");
  if (event.metaKey) parts.push("Command");
  parts.push(key);
  return { kind: "shortcut", accelerator: parts.join("+") };
}
