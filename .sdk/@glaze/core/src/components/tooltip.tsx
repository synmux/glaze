"use client";

import * as React from "react";
import { useOnWindowFocusStateChange } from "../hooks/use-window-focus";
import { cn } from "../utils/cn";
import { glazeTooltipTrace } from "../utils/trace";
import { Key, KeyGroup } from "./key";
import { type NativeViewHandle, type NativeWindow, NativeView } from "./native-view";

export type TooltipReferencePosition = {
  x: number;
  y: number;
};

export type TooltipReference = TooltipReferencePosition & {
  width: number;
  height: number;
};

export type TooltipSide = "top" | "bottom" | "left" | "right";

export interface TooltipWindow extends NativeWindow {}

export interface TooltipNativeViewHandle extends NativeViewHandle<TooltipWindow> {}

type TooltipNativeViewProps = Omit<React.ComponentProps<typeof NativeView>, "ref" | "feature"> & {
  ref?: React.Ref<TooltipNativeViewHandle>;
  reference: TooltipReference;
  side: TooltipSide;
};

function TooltipNativeView({ reference, side, ...props }: TooltipNativeViewProps) {
  const queryParams = {
    referenceX: String(reference.x),
    referenceY: String(reference.y),
    referenceWidth: String(reference.width),
    referenceHeight: String(reference.height),
    side,
  };
  return <NativeView<TooltipWindow> feature="tooltip" queryParams={queryParams} {...props} />;
}
TooltipNativeView.displayName = "TooltipNativeView";

const INSTANT_OPEN_GRACE_PERIOD_MS = 700;
const POINTER_REST_MS = 200;

type TooltipProviderContextType = {
  shouldOpenInstantly: () => boolean;
  addActiveTooltip: (id: string) => void;
  removeActiveTooltip: (id: string) => void;
};

const TooltipProviderContext = React.createContext<TooltipProviderContextType>({
  shouldOpenInstantly: () => false,
  addActiveTooltip: () => {},
  removeActiveTooltip: () => {},
});

function TooltipProvider({ children }: { children: React.ReactNode }) {
  const activeTooltipSet = React.useRef<Set<string>>(new Set());
  const shouldOpenInstantlyRef = React.useRef(false);
  const clearInstantOpenTimeoutRef = React.useRef<number | null>(null);

  const addActiveTooltip = React.useCallback((id: string) => {
    activeTooltipSet.current.add(id);
    shouldOpenInstantlyRef.current = true;
    if (clearInstantOpenTimeoutRef.current !== null) {
      window.clearTimeout(clearInstantOpenTimeoutRef.current);
      clearInstantOpenTimeoutRef.current = null;
    }
  }, []);

  const removeActiveTooltip = React.useCallback((id: string) => {
    activeTooltipSet.current.delete(id);
    if (activeTooltipSet.current.size === 0) {
      clearInstantOpenTimeoutRef.current = window.setTimeout(() => {
        shouldOpenInstantlyRef.current = false;
      }, INSTANT_OPEN_GRACE_PERIOD_MS);
    }
  }, []);

  const shouldOpenInstantly = React.useCallback(() => {
    return shouldOpenInstantlyRef.current;
  }, []);

  const contextValue: TooltipProviderContextType = React.useMemo(
    () => ({
      shouldOpenInstantly,
      addActiveTooltip,
      removeActiveTooltip,
    }),
    [shouldOpenInstantly, addActiveTooltip, removeActiveTooltip],
  );

  return <TooltipProviderContext value={contextValue}>{children}</TooltipProviderContext>;
}

type TooltipState = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  controlledRef: React.RefObject<boolean | undefined>;
  triggerRef: React.RefObject<HTMLElement | null>;
  triggerElement: HTMLElement | null;
  setTriggerRef: (node: HTMLElement | null) => void;
  nativeViewRef: React.RefObject<TooltipNativeViewHandle | null>;
};

const TooltipInternalContext = React.createContext<TooltipState | null>(null);

function Tooltip({ children, open: controlledOpen }: { children: React.ReactNode; open?: boolean }) {
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);
  const controlledRef = React.useRef(controlledOpen);
  controlledRef.current = controlledOpen;

  const isOpen = controlledOpen ?? internalIsOpen;

  const setIsOpen = React.useCallback((value: boolean) => {
    if (controlledRef.current !== undefined) return;
    setInternalIsOpen(value);
  }, []);

  const triggerRef = React.useRef<HTMLElement | null>(null);
  const [triggerElement, setTriggerElement] = React.useState<HTMLElement | null>(null);
  const setTriggerRef = React.useCallback((node: HTMLElement | null) => {
    triggerRef.current = node;
    setTriggerElement(node);
  }, []);
  const nativeViewRef = React.useRef<TooltipNativeViewHandle | null>(null);

  const state = React.useMemo<TooltipState>(
    () => ({ isOpen, setIsOpen, controlledRef, triggerRef, triggerElement, setTriggerRef, nativeViewRef }),
    [isOpen, setIsOpen, triggerElement, setTriggerRef],
  );

  return <TooltipInternalContext value={state}>{children}</TooltipInternalContext>;
}

function TooltipTrigger({
  children,
  asChild,
  ...props
}: { children: React.ReactNode; asChild?: boolean } & React.HTMLAttributes<HTMLElement>) {
  const ctx = React.useContext(TooltipInternalContext);
  const { shouldOpenInstantly } = React.useContext(TooltipProviderContext);
  const showTimeoutRef = React.useRef<number | null>(null);

  // Keep refs to the latest `ctx` and `children` so the combined ref callback
  // passed to cloneElement can stay stable across renders. An inline ref here
  // would detach/reattach on every render (React calls old(null), new(node)),
  // which churns the trigger element state and can unmount the tooltip's
  // native portal mid-creation.
  const ctxRef = React.useRef(ctx);
  ctxRef.current = ctx;
  const childrenRef = React.useRef(children);
  childrenRef.current = children;

  const cancelTimeout = React.useCallback(() => {
    if (showTimeoutRef.current !== null) {
      window.clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
  }, []);

  const open = React.useCallback(() => {
    if (!ctx) return;
    glazeTooltipTrace("open", { isControlled: ctx.controlledRef.current !== undefined });
    ctx.nativeViewRef.current?.getWindow()?.cancelAnimateOut?.();
    ctx.setIsOpen(true);
  }, [ctx]);

  const close = React.useCallback(
    (animated = true) => {
      cancelTimeout();
      if (!ctx) return;
      glazeTooltipTrace("close", { animated, isControlled: ctx.controlledRef.current !== undefined });
      if (animated) {
        const animateOut = ctx.nativeViewRef.current?.getWindow()?.animateOut;
        if (animateOut) {
          try {
            animateOut();
          } catch {
            // Native window may have been closed externally (e.g. before a native menu)
            ctx.setIsOpen(false);
            return;
          }
          // Fallback: if onAnimateOutComplete never fires (e.g. native window was
          // destroyed mid-animation), force close after the animation duration
          showTimeoutRef.current = window.setTimeout(() => ctx.setIsOpen(false), 400);
        } else {
          ctx.setIsOpen(false);
        }
      } else {
        ctx.setIsOpen(false);
      }
    },
    [cancelTimeout, ctx],
  );

  const scheduleOpen = React.useCallback(
    (delayMs: number) => {
      cancelTimeout();
      showTimeoutRef.current = window.setTimeout(open, delayMs);
    },
    [cancelTimeout, open],
  );

  useOnWindowFocusStateChange({
    onLoss: () => {
      glazeTooltipTrace("windowBlur close");
      close(false);
    },
  });

  React.useEffect(() => {
    return () => cancelTimeout();
  }, [cancelTimeout]);

  React.useEffect(() => {
    const trigger = ctx?.triggerRef.current;
    if (!trigger) return;

    const handleScroll = (event: Event) => {
      if (ctx.controlledRef.current !== undefined) return;
      const target = event.target as HTMLElement;
      if (target?.contains(trigger)) close(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    return () => window.removeEventListener("scroll", handleScroll, { capture: true });
  }, [ctx, close]);

  const isControlled = () => ctx?.controlledRef.current !== undefined;

  const eventHandlers = {
    onPointerEnter: () => {
      if (isControlled()) return;
      glazeTooltipTrace("pointerEnter", { instant: shouldOpenInstantly() });
      if (shouldOpenInstantly()) scheduleOpen(50);
      else scheduleOpen(POINTER_REST_MS);
    },
    onPointerLeave: () => {
      if (isControlled()) return;
      glazeTooltipTrace("pointerLeave");
      close();
    },
    onPointerDown: () => {
      if (isControlled()) return;
      glazeTooltipTrace("pointerDown");
      close(false);
    },
  };

  // Stable combined ref callback — forwards the node to both the tooltip
  // context and any ref on the child element. Returning a stable identity
  // prevents ref churn on every parent re-render.
  const combinedRef = React.useCallback((node: HTMLElement | null) => {
    ctxRef.current?.setTriggerRef(node);
    const child = childrenRef.current;
    const childRef = React.isValidElement(child) ? (child.props as { ref?: React.Ref<HTMLElement> }).ref : undefined;
    if (typeof childRef === "function") childRef(node);
    else if (childRef && typeof childRef === "object")
      (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
  }, []);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      ref: combinedRef,
      ...eventHandlers,
      ...props,
    });
  }

  return (
    <span ref={combinedRef} {...eventHandlers} {...props}>
      {children}
    </span>
  );
}

type TooltipContentBaseProps = {
  className?: string;
  side?: TooltipSide;
};
type TooltipContentProps = TooltipContentBaseProps &
  ({ children: React.ReactNode; shortcut?: string[] } | { children?: React.ReactNode; shortcut: string[] });

function fitBalancedTooltipWidth(element: HTMLDivElement) {
  element.style.removeProperty("width");

  const style = element.ownerDocument.defaultView?.getComputedStyle(element);

  // Uncapped content already has the correct intrinsic width via `w-max`. Only capped tooltips can
  // wrap and need balancing; shrinking a single-line tooltip can omit its trailing padding in WebKit.
  if (!style || style.whiteSpace === "nowrap" || style.maxWidth === "none") return;

  const initialRect = element.getBoundingClientRect();
  if (initialRect.width === 0 || initialRect.height === 0 || element.scrollWidth > element.clientWidth) return;

  const targetHeight = initialRect.height;
  let lowerWidth = 0;
  let upperWidth = initialRect.width;

  while (upperWidth - lowerWidth > 1) {
    const candidateWidth = (lowerWidth + upperWidth) / 2;
    element.style.width = `${candidateWidth}px`;

    const isTaller = element.getBoundingClientRect().height > targetHeight + 0.5;
    const overflows = element.scrollWidth > element.clientWidth;
    if (isTaller || overflows) {
      lowerWidth = candidateWidth;
    } else {
      upperWidth = candidateWidth;
    }
  }

  element.style.width = `${Math.ceil(upperWidth)}px`;
}

function TooltipContent({ children, className, shortcut, side = "top" }: TooltipContentProps) {
  const ctx = React.useContext(TooltipInternalContext);
  const { addActiveTooltip, removeActiveTooltip } = React.useContext(TooltipProviderContext);
  const tooltipId = React.useId();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const shouldBalanceText =
    !shortcut &&
    React.Children.toArray(children).every((child) => typeof child === "string" || typeof child === "number");

  const setContentRef = React.useCallback(
    (element: HTMLDivElement | null) => {
      contentRef.current = element;
      if (!element) return;

      element.style.removeProperty("width");
      if (!shouldBalanceText) return;

      fitBalancedTooltipWidth(element);
      void element.ownerDocument.fonts.ready.then(() => {
        if (contentRef.current !== element) return;
        element.ownerDocument.defaultView?.requestAnimationFrame(() => {
          if (contentRef.current === element) fitBalancedTooltipWidth(element);
        });
      });
    },
    [shouldBalanceText, children, className],
  );

  React.useEffect(() => {
    if (!ctx?.isOpen || ctx.controlledRef.current !== undefined) return;
    addActiveTooltip(tooltipId);
    return () => removeActiveTooltip(tooltipId);
  }, [ctx?.isOpen, ctx?.controlledRef, tooltipId, addActiveTooltip, removeActiveTooltip]);

  if (!ctx?.isOpen) return null;

  const trigger = ctx.triggerElement;
  if (!trigger) return null;

  const rect = trigger.getBoundingClientRect();
  const reference: TooltipReference = { x: rect.x, y: rect.y, width: rect.width, height: rect.height };

  // The `-mr-1` margin and tighter horizontal padding only make sense when a label is paired with
  // the shortcut (keys hug the right edge of a wider tooltip). Shortcut-only tooltips need normal
  // padding on all sides so the key glyph isn't cramped against the tooltip edge.
  const hasLabel = React.Children.count(children) > 0;

  return (
    <TooltipNativeView ref={ctx.nativeViewRef} onClose={() => ctx.setIsOpen(false)} reference={reference} side={side}>
      <div
        ref={setContentRef}
        className={cn(
          "text-small text-primary flex w-max items-center gap-1.5 leading-none",
          shouldBalanceText && "text-balance",
          hasLabel ? "px-2 py-1" : "px-1 py-1",
          className,
        )}
      >
        {children}
        {shortcut && (
          <KeyGroup className={cn("shrink-0", hasLabel && "-mr-1")}>
            {shortcut.map((key, index) => (
              <Key key={index} variant="filled">
                {key}
              </Key>
            ))}
          </KeyGroup>
        )}
      </div>
    </TooltipNativeView>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipNativeView };
export type { TooltipProviderContextType as TooltipContextType };
