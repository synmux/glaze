import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "../utils/cn";
import { useWindowFocusState } from "../hooks";

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root>;

function Switch({
  className,
  defaultChecked = false,
  checked: checkedProp,
  onCheckedChange,
  onClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  disabled,
  ...props
}: SwitchProps) {
  const isWindowFocused = useWindowFocusState();

  const isControlled = checkedProp !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
  const checked = isControlled ? checkedProp : uncontrolledChecked;

  const setChecked = React.useCallback(
    (value: boolean) => {
      if (!isControlled) setUncontrolledChecked(value);
      if (value !== checked) onCheckedChange?.(value);
    },
    [isControlled, checked, onCheckedChange],
  );

  const pointerSessionRef = React.useRef<{ pointerId: number; checked: boolean; midpointX: number } | null>(null);
  const shouldSuppressClickRef = React.useRef(false);
  const [dragChecked, setDragChecked] = React.useState<boolean | null>(null);

  const endPointerSession = (event: React.PointerEvent<HTMLButtonElement>) => {
    const session = pointerSessionRef.current;
    if (session?.pointerId !== event.pointerId) return null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    pointerSessionRef.current = null;
    return session;
  };

  // While dragging, show the "would-be" state via Radix's data-state without committing it.
  const displayChecked = dragChecked ?? checked;

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-window-focused={isWindowFocused}
      checked={displayChecked}
      onCheckedChange={setChecked}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        if (shouldSuppressClickRef.current) {
          shouldSuppressClickRef.current = false;
          event.preventDefault();
        }
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (disabled || !event.isPrimary) return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointerSessionRef.current = {
          pointerId: event.pointerId,
          checked,
          midpointX: rect.left + rect.width / 2,
        };
        setDragChecked(null);
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        const session = pointerSessionRef.current;
        if (session?.pointerId !== event.pointerId) return;
        const nextChecked = event.clientX >= session.midpointX;
        if (session.checked === nextChecked) return;
        session.checked = nextChecked;
        shouldSuppressClickRef.current = true;
        void window.glazeAPI?.app?.performHapticFeedback?.({ pattern: "level-change" });
        setDragChecked(nextChecked);
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        const session = endPointerSession(event);
        if (!session) return;
        setDragChecked(null);
        if (session.checked !== checked) setChecked(session.checked);
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        if (!endPointerSession(event)) return;
        setDragChecked(null);
        shouldSuppressClickRef.current = false;
      }}
      className={cn(
        "peer data-[window-focused=true]:data-[state=checked]:bg-accent data-[window-focused=true]:active:data-[state=checked]:bg-accent-hover data-[window-focused=false]:data-[state=checked]:bg-foreground-20 data-[window-focused=false]:data-[state=unchecked]:bg-control group data-[state=unchecked]:bg-control active:data-[state=unchecked]:bg-control-active focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-4 w-9 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 relative",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-white pointer-events-none absolute rounded-full ring-0 transition-all duration-200 ease-out",
          "h-3 top-1/2 -translate-y-1/2",
          "w-5 group-active:w-6",
          "data-[state=unchecked]:left-px",
          "data-[state=checked]:left-[calc(100%-21px)] data-[state=checked]:group-active:left-[calc(100%-25px)]",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
