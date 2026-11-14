export const SOUND_OPTIONS = ["none", "gentle", "alarm", "siren", "foghorn"] as const;
export type SoundOption = (typeof SOUND_OPTIONS)[number];

export const SOUND_META: Record<SoundOption, { label: string; description: string }> = {
  none: { label: "None", description: "Silent — the popup still appears." },
  gentle: { label: "Gentle chime", description: "Soft two-tone bell." },
  alarm: { label: "Alarm", description: "Sharp alternating beeps." },
  siren: { label: "Siren", description: "Rising and falling wail." },
  foghorn: { label: "Foghorn", description: "Loud, low, and hard to ignore." },
};

function tone(
  ctx: AudioContext,
  freq: number,
  type: "sine" | "square" | "sawtooth",
  start: number,
  duration: number,
  peakGain: number,
  attack = 0.02,
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(peakGain, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

/** Plays one cycle of `option` starting at `at` and returns how long (seconds) until the next cycle should start. */
export function playSoundCycle(ctx: AudioContext, option: SoundOption, at: number): number {
  switch (option) {
    case "none":
      return 1;

    case "gentle":
      tone(ctx, 880, "sine", at, 0.16, 0.18);
      tone(ctx, 1174, "sine", at + 0.18, 0.16, 0.18);
      return 3;

    case "alarm":
      [1200, 900, 1200, 900].forEach((freq, i) => tone(ctx, freq, "square", at + i * 0.14, 0.11, 0.3, 0.005));
      return 0.9;

    case "siren": {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(650, at);
      osc.frequency.linearRampToValueAtTime(1300, at + 0.75);
      osc.frequency.linearRampToValueAtTime(650, at + 1.5);
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(0.28, at + 0.05);
      gain.gain.setValueAtTime(0.28, at + 1.45);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.6);
      osc.connect(gain).connect(ctx.destination);
      osc.start(at);
      osc.stop(at + 1.65);
      return 1.6;
    }

    case "foghorn": {
      const duration = 1.1;
      [110, 113].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, at);
        gain.gain.linearRampToValueAtTime(0.35, at + 0.08);
        gain.gain.setValueAtTime(0.35, at + duration - 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
        osc.connect(gain).connect(ctx.destination);
        osc.start(at);
        osc.stop(at + duration + 0.05);
      });
      return 2.2;
    }
  }
}

/** Starts a repeating loop of `option` until the returned cleanup function is called. */
export function startSoundLoop(option: SoundOption): () => void {
  if (option === "none") return () => {};

  const ctx = new AudioContext();
  void ctx.resume();
  let timer: ReturnType<typeof setTimeout>;

  const tick = () => {
    const wait = playSoundCycle(ctx, option, ctx.currentTime);
    timer = setTimeout(tick, wait * 1000);
  };
  tick();

  return () => {
    clearTimeout(timer);
    void ctx.close();
  };
}

/** Plays a single cycle of `option` for previewing in the dialog. Returns the playback duration in ms (0 for "none"). */
export function previewSound(option: SoundOption): number {
  if (option === "none") return 0;
  const ctx = new AudioContext();
  void ctx.resume();
  const duration = playSoundCycle(ctx, option, ctx.currentTime);
  const ms = duration * 1000 + 200;
  setTimeout(() => void ctx.close(), ms);
  return ms;
}
