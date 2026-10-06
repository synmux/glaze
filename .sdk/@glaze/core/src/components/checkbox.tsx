import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { CheckIcon } from "lucide-react";

import { cn } from "../utils/cn";
import { useWindowFocusState } from "../hooks";

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const isWindowFocused = useWindowFocusState();
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-window-focused={isWindowFocused}
      className={cn(
        "peer bg-control active:bg-control-active data-[window-focused=true]:data-[state=checked]:bg-accent data-[window-focused=false]:bg-control-subtle data-[window-focused=true]:active:data-[state=checked]:bg-accent-hover data-[window-focused=true]:data-[state=checked]:text-accent-contrast focus-visible:ring-ring/50 aria-invalid:ring-support-red aria-invalid:border-support-red/60 size-4 shrink-0 rounded-[6px] shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
