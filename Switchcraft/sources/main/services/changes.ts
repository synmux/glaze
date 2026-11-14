/**
 * A tiny coalescing change signal. Anything that alters presets, the current preset,
 * devices or settings calls emitChange(); listeners (tray + Preferences broadcast) run once.
 */
import { EventEmitter } from "events";

const emitter = new EventEmitter();
let pending: NodeJS.Timeout | null = null;

export function emitChange(): void {
  if (pending) return;
  pending = setTimeout(() => {
    pending = null;
    emitter.emit("change");
  }, 25);
}

export function onChange(listener: () => void): void {
  emitter.on("change", listener);
}
