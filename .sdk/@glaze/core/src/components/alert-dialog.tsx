"use client";

import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";

import { cn } from "../utils/cn";
import { Button, type ButtonProps } from "./button";
import { Text } from "./text";
import { CancelShortcutTooltip, ConfirmKeyHint, ConfirmShortcutTooltip } from "./dialog-shortcut-hints";
import { DialogShortcutContext, useDialogShortcuts, useRegisterConfirm } from "./dialog-shortcuts";
import { ScrollArea } from "./scroll-area";

/**
 * Top-level props — collapse the trigger/header/body/footer tree into a single `<AlertDialog>`
 * call. AlertDialog is for single-decision confirmations, so it intentionally does *not* accept
 * `destructiveAction`/`secondaryAction` (use the left-aligned actions on `Dialog` for those).
 *
 * If any of these props are set *and* `onConfirm` is provided, AlertDialog auto-builds the content
 * tree and `children` becomes the body (wrapped in `AlertDialogBody`). Without `onConfirm`,
 * AlertDialog falls back to composition so we don't create an un-dismissible alert.
 */
type AlertDialogOwnProps = {
  /** Auto-emits an `AlertDialogTrigger asChild` wrapping this node. */
  trigger?: React.ReactNode;
  /** Auto-renders an `AlertDialogTitle` inside the header. */
  title?: React.ReactNode;
  /**
   * Visually hide the title while keeping it in the DOM for screen readers. Radix still sees
   * an `AlertDialogTitle`, so the accessibility warning is satisfied.
   */
  hideTitle?: boolean;
  /** Auto-renders an `AlertDialogDescription` inside the header. */
  description?: React.ReactNode;
  /**
   * Visually hide the description while keeping it in the DOM for screen readers. Radix still
   * sees an `AlertDialogDescription`, so the accessibility warning is satisfied.
   */
  hideDescription?: boolean;
  /** Primary action handler. Required when any other top-level prop is set (Cancel + Confirm footer). */
  onConfirm?: () => void | Promise<void>;
  /** Confirm button label. Defaults to "Confirm". */
  confirmLabel?: React.ReactNode;
  /** Confirm button variant. Defaults to `"accent"`. Use `"destructive"` for deletes. */
  confirmVariant?: "accent" | "destructive";
  /** Disable the confirm button (e.g. when a typed confirmation doesn't match). */
  confirmDisabled?: boolean;
  /** Forwarded to `AlertDialogContent` when any top-level prop is set. */
  size?: "small" | "medium" | "large" | "xl" | "2xl";
};

function AlertDialog({
  children,
  trigger,
  title,
  hideTitle,
  description,
  hideDescription,
  onConfirm,
  confirmLabel,
  confirmVariant = "accent",
  confirmDisabled,
  size,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root> & AlertDialogOwnProps) {
  const hasPropsInputs =
    trigger !== undefined || title !== undefined || description !== undefined || onConfirm !== undefined;
  const propsMode = hasPropsInputs && onConfirm !== undefined;
  const propsMissingConfirm = hasPropsInputs && onConfirm === undefined;
  const warnedMissingConfirmRef = React.useRef(false);

  if (process.env.NODE_ENV !== "production" && propsMissingConfirm && !warnedMissingConfirmRef.current) {
    warnedMissingConfirmRef.current = true;
    console.warn(
      "AlertDialog: the top-level props require `onConfirm` so the dialog has a dismiss path. Falling back to composition.",
    );
  }

  const [internalOpen, setInternalOpen] = React.useState<boolean>(defaultOpen ?? false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  if (!propsMode) {
    return (
      <AlertDialogPrimitive.Root
        data-slot="alert-dialog"
        open={controlledOpen}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Root>
    );
  }

  if (process.env.NODE_ENV !== "production" && trigger !== undefined) {
    const hasExplicitTrigger = React.Children.toArray(children).some(
      (c) => React.isValidElement(c) && (c.type as { displayName?: string })?.displayName === "AlertDialogTrigger",
    );
    if (hasExplicitTrigger) {
      console.warn(
        "AlertDialog: the `trigger` prop is set, but an `<AlertDialogTrigger>` child is also present. Use one or the other — `trigger` will win.",
      );
    }
  }

  const hasBody = children !== undefined && children !== null && children !== false;
  const hasVisibleTitle = title !== undefined && !hideTitle;
  const hasVisibleDescription = description !== undefined && !hideDescription;
  const hasVisibleHeader = hasVisibleTitle || hasVisibleDescription;

  return (
    <AlertDialogPrimitive.Root data-slot="alert-dialog" open={open} onOpenChange={handleOpenChange} {...props}>
      {trigger !== undefined && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent size={size}>
        {hasVisibleHeader ? (
          <AlertDialogHeader>
            {title !== undefined && (
              <AlertDialogTitle className={hideTitle ? "sr-only" : undefined}>{title}</AlertDialogTitle>
            )}
            {description !== undefined && (
              <AlertDialogDescription className={hideDescription ? "sr-only" : undefined}>
                {description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
        ) : (
          // sr-only only: render outside the header to avoid an empty gap-4 row.
          <>
            {title !== undefined && <AlertDialogTitle className="sr-only">{title}</AlertDialogTitle>}
            {description !== undefined && (
              <AlertDialogDescription className="sr-only">{description}</AlertDialogDescription>
            )}
          </>
        )}
        {hasBody && <AlertDialogBody>{children}</AlertDialogBody>}
        {onConfirm !== undefined && (
          <AlertDialogConfirmationFooter
            onConfirm={onConfirm}
            onSuccess={() => handleOpenChange(false)}
            confirmLabel={confirmLabel}
            confirmVariant={confirmVariant}
            confirmDisabled={confirmDisabled}
          />
        )}
      </AlertDialogContent>
    </AlertDialogPrimitive.Root>
  );
}
AlertDialog.displayName = "AlertDialog";

function AlertDialogConfirmationFooter({
  onConfirm,
  onSuccess,
  confirmLabel,
  confirmVariant,
  confirmDisabled,
}: {
  onConfirm: () => void | Promise<void>;
  onSuccess: () => void;
  confirmLabel?: React.ReactNode;
  confirmVariant: "accent" | "destructive";
  confirmDisabled?: boolean;
}) {
  const [isConfirming, setIsConfirming] = React.useState(false);
  const confirmRef = React.useRef<HTMLButtonElement>(null);
  useRegisterConfirm(confirmRef);

  // Guard pending-state reset: a successful onConfirm closes the dialog, which may unmount
  // this footer before the `finally` runs.
  const mountedRef = React.useRef(true);
  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const runConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
      if (mountedRef.current) onSuccess();
    } catch {
      // Stay open so the caller can surface an error inline.
    } finally {
      if (mountedRef.current) setIsConfirming(false);
    }
  };

  // AlertDialog's auto-built footer always has exactly 2 buttons (Cancel + Confirm). Split the footer width
  // evenly between them — native macOS two-button alert pattern. Only confirm disables while
  // pending; cancel stays enabled so users can always dismiss if the async confirm hangs. We
  // also skip a spinner to avoid width jitter; consumers surface errors in their handler.
  return (
    <AlertDialogFooter>
      <CancelShortcutTooltip>
        <AlertDialogCancel asChild>
          <Button variant="filled" className="flex-1">
            Cancel
          </Button>
        </AlertDialogCancel>
      </CancelShortcutTooltip>
      <ConfirmShortcutTooltip>
        <Button
          ref={confirmRef}
          variant={confirmVariant}
          onClick={runConfirm}
          disabled={confirmDisabled || isConfirming}
          className="flex-1"
        >
          {confirmLabel ?? "Confirm"}
          <ConfirmKeyHint />
        </Button>
      </ConfirmShortcutTooltip>
    </AlertDialogFooter>
  );
}

function AlertDialogTrigger({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}
AlertDialogTrigger.displayName = "AlertDialogTrigger";

function AlertDialogPortal({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
}

function AlertDialogOverlay({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn("fixed inset-0 z-50 bg-panel-backdrop no-drag", className)}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  children,
  size = "small",
  style,
  onKeyDown,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  size?: "small" | "medium" | "large" | "xl" | "2xl";
}) {
  const { contextValue, onKeyDown: shortcutKeyDown, contentRef } = useDialogShortcuts();
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    shortcutKeyDown(e);
  };
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={contentRef}
        data-slot="alert-dialog-content"
        style={{ "--dialog-px": "1.25rem", ...style } as React.CSSProperties}
        className={cn(
          "fixed no-drag bg-popover outline-1 outline-foreground-10 shadow-[0_20px_48px_-12px_rgb(0_0_0/0.35)] dark:shadow-[0_32px_64px_-8px_rgb(0_0_0/0.85),0_10px_20px_-4px_rgb(0_0_0/0.4)] top-[50%] left-[50%] z-50 grid max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-dialog py-5",
          size === "small" && "w-3xs",
          size === "medium" && "w-[400px]",
          size === "large" && "w-[500px]",
          size === "xl" && "w-[750px]",
          size === "2xl" && "w-[900px]",
          className,
        )}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <DialogShortcutContext.Provider value={contextValue}>{children}</DialogShortcutContext.Provider>
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-left px-(--dialog-px)", className)}
      {...props}
    />
  );
}

function AlertDialogBody({
  className,
  scrollAreaClassName,
  ...props
}: React.ComponentProps<"div"> & { scrollAreaClassName?: string }) {
  return (
    <ScrollArea
      data-slot="alert-dialog-body"
      className={cn("h-max max-h-[50vh]", scrollAreaClassName)}
      viewportClassName="max-h-[50vh]"
      fadeEdges
    >
      <div className={cn("px-(--dialog-px)", className)} {...props} />
    </ScrollArea>
  );
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      // `flex-wrap` + `[&>*]:min-w-fit` lets buttons stack one-per-row when their labels are too
      // long to sit side-by-side, instead of overflowing the dialog. The buttons' `overflow-hidden`
      // zeroes their automatic flex min-size, so without `min-w-fit` the line-break algorithm never
      // sees their real content width and keeps everything on one (overflowing) row. When stacked,
      // each `flex-1` button grows to full width.
      className={cn("flex flex-row flex-wrap gap-2 justify-end px-(--dialog-px) [&>*]:min-w-fit", className)}
      {...props}
    />
  );
}

function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <Text asChild variant="strong">
      <AlertDialogPrimitive.Title data-slot="alert-dialog-title" className={className} {...props} />
    </Text>
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <Text asChild variant="regular" color="secondary">
      <AlertDialogPrimitive.Description data-slot="alert-dialog-description" className={className} {...props} />
    </Text>
  );
}

type AlertDialogActionAsChildProps = React.ComponentProps<typeof AlertDialogPrimitive.Action> & {
  asChild: true;
};
type AlertDialogActionSelfRenderProps = Omit<ButtonProps, "ref"> & {
  asChild?: false;
};
type AlertDialogActionProps = AlertDialogActionAsChildProps | AlertDialogActionSelfRenderProps;

/**
 * Confirm action for an AlertDialog. Two modes:
 *
 * - Without `asChild`: AlertDialogAction renders its own `<Button>`, accepts Button props
 *   (variant, className, ...), registers itself as the confirm shortcut target, defaults to
 *   `flex-1` (macOS native two-button alert pattern), and renders the keyboard hint inline.
 *   Use this for new call sites.
 * - With `asChild`: classic Radix passthrough. The inner element still receives the confirm
 *   ref (so Cmd/Enter still fires it), but the keyboard hint and `flex-1` default are not
 *   auto-applied — the caller owns the button's children and styling.
 */
function AlertDialogAction(props: AlertDialogActionProps) {
  const ctx = React.useContext(DialogShortcutContext);
  const localRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!ctx) return;
    ctx.registerConfirm(localRef.current);
    return () => ctx.registerConfirm(null);
  }, [ctx]);

  if (props.asChild) {
    const { asChild: _asChild, ...rest } = props;
    return <AlertDialogPrimitive.Action ref={localRef} data-slot="alert-dialog-action" asChild {...rest} />;
  }

  const { children, className, ...buttonProps } = props;
  return (
    <ConfirmShortcutTooltip>
      <AlertDialogPrimitive.Action data-slot="alert-dialog-action" asChild>
        <Button ref={localRef} className={cn("flex-1", className)} {...buttonProps}>
          {children}
          <ConfirmKeyHint />
        </Button>
      </AlertDialogPrimitive.Action>
    </ConfirmShortcutTooltip>
  );
}

type AlertDialogCancelAsChildProps = React.ComponentProps<typeof AlertDialogPrimitive.Cancel> & {
  asChild: true;
};
type AlertDialogCancelSelfRenderProps = Omit<ButtonProps, "ref"> & {
  asChild?: false;
};
type AlertDialogCancelProps = AlertDialogCancelAsChildProps | AlertDialogCancelSelfRenderProps;

function AlertDialogCancel(props: AlertDialogCancelProps) {
  if (props.asChild) {
    const { asChild: _asChild, ...rest } = props;
    return <AlertDialogPrimitive.Cancel data-slot="alert-dialog-cancel" asChild {...rest} />;
  }

  const { children, variant = "filled", className, ...buttonProps } = props;
  return (
    <CancelShortcutTooltip>
      <AlertDialogPrimitive.Cancel data-slot="alert-dialog-cancel" asChild>
        <Button variant={variant} className={cn("flex-1", className)} {...buttonProps}>
          {children}
        </Button>
      </AlertDialogPrimitive.Cancel>
    </CancelShortcutTooltip>
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
