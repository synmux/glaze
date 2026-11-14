import { Slider, Text } from "@glaze/core/components";

interface LevelSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

/** A 0–100% level with a live readout. */
export function LevelSlider({ label, value, onChange }: LevelSliderProps) {
  return (
    <div className="flex w-60 items-center gap-3">
      <Slider
        aria-label={label}
        value={[value]}
        min={0}
        max={100}
        step={1}
        onValueChange={(next) => onChange(next[0] ?? value)}
        className="flex-1"
      />
      <Text color="secondary" className="w-10 shrink-0 text-right tabular-nums">
        {value}%
      </Text>
    </div>
  );
}
