"use client";

import * as React from "react";
import { Slot } from "radix-ui";

interface ShareSheetAnchorRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ShareSheetContextValue {
  disabled?: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
  triggerProps: {
    onClick: (event: React.MouseEvent) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
    role: "button";
    "aria-disabled": boolean | undefined;
    tabIndex: number;
  };
}

const ShareSheetContext = React.createContext<ShareSheetContextValue | null>(null);

function useShareSheetContext() {
  const context = React.useContext(ShareSheetContext);
  if (!context) {
    throw new Error("ShareSheet components must be used within a ShareSheet");
  }
  return context;
}

function anchorRectFromElement(element: HTMLElement): ShareSheetAnchorRect {
  const rect = element.getBoundingClientRect();

  return {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

async function showShareSheet(text: string, anchorRect: ShareSheetAnchorRect): Promise<boolean> {
  return window.glazeAPI.glaze.ipc.invoke<boolean>("glaze:system:share", text, { anchorRect });
}

interface ShareSheetProps {
  text: string;
  disabled?: boolean;
  onOpen?: () => void;
  onError?: (error: unknown) => void | Promise<void>;
  children: React.ReactNode;
}

function ShareSheet({ text, disabled, onOpen, onError, children }: ShareSheetProps) {
  const triggerRef = React.useRef<HTMLElement | null>(null);

  const openShareSheet = React.useCallback(async () => {
    if (disabled || !text) return;

    const trigger = triggerRef.current;
    if (!trigger) return;

    try {
      const didOpen = await showShareSheet(text, anchorRectFromElement(trigger));
      if (!didOpen) {
        throw new Error("Native share sheet did not open");
      }
      onOpen?.();
    } catch (error) {
      if (onError) {
        await onError(error);
        return;
      }
      console.error("[ShareSheet] Failed to show native share sheet:", error);
    }
  }, [disabled, text, onOpen, onError]);

  const handleClick = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      void openShareSheet();
    },
    [openShareSheet],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();
      event.stopPropagation();
      void openShareSheet();
    },
    [openShareSheet],
  );

  const contextValue = React.useMemo(
    (): ShareSheetContextValue => ({
      disabled,
      triggerRef,
      triggerProps: {
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        role: "button",
        "aria-disabled": disabled,
        tabIndex: disabled ? -1 : 0,
      },
    }),
    [disabled, handleClick, handleKeyDown],
  );

  return <ShareSheetContext.Provider value={contextValue}>{children}</ShareSheetContext.Provider>;
}

interface ShareSheetTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const ShareSheetTrigger = React.forwardRef<HTMLButtonElement, ShareSheetTriggerProps>(
  ({ asChild, children, ...props }, forwardedRef) => {
    const { disabled, triggerRef, triggerProps } = useShareSheetContext();

    const mergedRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [triggerRef, forwardedRef],
    );

    const Comp = (asChild ? Slot.Slot : "button") as React.ElementType;

    return (
      <Comp
        ref={mergedRef}
        type={asChild ? undefined : "button"}
        data-slot="share-sheet-trigger"
        disabled={disabled}
        {...triggerProps}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
ShareSheetTrigger.displayName = "ShareSheetTrigger";

export { ShareSheet, ShareSheetTrigger };
export type { ShareSheetProps, ShareSheetTriggerProps };
