export const SOUND_OPTIONS = ["none", "gentle", "alarm", "siren", "foghorn"] as const;
export type SoundOption = (typeof SOUND_OPTIONS)[number];

const INTENSITY: Record<SoundOption, number> = {
  none: 0,
  gentle: 1,
  alarm: 2,
  siren: 3,
  foghorn: 4,
};

export function isSoundOption(value: unknown): value is SoundOption {
  return typeof value === "string" && (SOUND_OPTIONS as readonly string[]).includes(value);
}

/** Older saved watches stored `sound` as a boolean; map that to a sane default. */
export function coerceSoundOption(value: unknown): SoundOption {
  if (isSoundOption(value)) return value;
  return value === false ? "none" : "gentle";
}

/** When several pending alerts disagree, play the most attention-grabbing one. */
export function pickLoudestSound(sounds: SoundOption[]): SoundOption {
  return sounds.reduce<SoundOption>((loudest, s) => (INTENSITY[s] > INTENSITY[loudest] ? s : loudest), "none");
}
