import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@glaze/core/components";

import type { DeviceOption } from "../lib/devices";

interface SpecialOption {
  value: string;
  label: string;
}

interface DeviceSelectProps {
  id?: string;
  value: string;
  special: SpecialOption[];
  options: DeviceOption[];
  onValueChange: (value: string) => void;
}

/** A device picker: special choices first, then devices (with "Not connected" sublabels). */
export function DeviceSelect({
  id,
  value,
  special,
  options,
  onValueChange,
}: DeviceSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        id={id}
        size="small"
        variant="transparent"
        className="max-w-64"
      >
        <SelectValue placeholder="Choose a device" />
      </SelectTrigger>
      <SelectContent>
        {special.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
        {options.length > 0 ? <SelectSeparator /> : null}
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            sublabel={option.sublabel}
            icon={option.icon}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
