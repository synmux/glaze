import * as React from "react";
import { ArrowUpIcon, SquareIcon } from "lucide-react";
import { Slot as SlotPrimitive } from "radix-ui";

import { cn } from "../utils/cn";
import { Button, type ButtonProps } from "./button";
import { Textarea } from "./textarea";

type ComposerRootProps = React.ComponentProps<"form">;

const Root = React.forwardRef<HTMLFormElement, ComposerRootProps>(({ className, ...props }, ref) => (
  <form ref={ref} data-slot="composer-root" className={cn("relative isolate w-full", className)} {...props} />
));
Root.displayName = "Composer.Root";

type ComposerSurfaceProps = React.ComponentProps<"div">;

const Surface = React.forwardRef<HTMLDivElement, ComposerSurfaceProps>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="composer-surface"
    className={cn(
      "focused-shadow relative isolate w-full overflow-hidden rounded-20 p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] dark:shadow-[0_18px_50px_rgba(0,0,0,0.35)]",
      className,
    )}
    {...props}
  >
    <div
      data-slot="composer-surface-glass"
      className="pointer-events-none absolute inset-0 rounded-[inherit] bg-glass transform-[translateZ(0)]"
      aria-hidden
    />
    <div data-slot="composer-surface-content" className="relative flex flex-col gap-2">
      {children}
    </div>
  </div>
));
Surface.displayName = "Composer.Surface";

const Row = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="composer-row"
    className={cn(
      "flex min-w-0 flex-wrap items-end gap-2",
      "[&>[data-slot=composer-input]:first-child]:pl-1.5 [&>[data-slot=composer-actions]:last-child:not(:first-child)]:ml-auto",
      "[&>[data-slot=composer-input][data-multiline=true]:not(:first-child)]:-order-1 [&>[data-slot=composer-input][data-multiline=true]:not(:first-child)]:basis-full",
      className,
    )}
    {...props}
  />
));
Row.displayName = "Composer.Row";

const Actions = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => (
  <div ref={ref} data-slot="composer-actions" className={cn("flex shrink-0 items-end gap-1.5", className)} {...props} />
));
Actions.displayName = "Composer.Actions";

interface ComposerControlProps extends React.ComponentProps<"div"> {
  asChild?: boolean;
}

const Control = React.forwardRef<HTMLDivElement, ComposerControlProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? SlotPrimitive.Slot : "div";
    return <Comp ref={ref} data-slot="composer-control" className={cn("min-w-0 flex-1", className)} {...props} />;
  },
);
Control.displayName = "Composer.Control";

type ComposerSubmitMode = "enter" | "command-enter" | "manual";

interface ComposerInputProps extends Omit<React.ComponentProps<typeof Textarea>, "onKeyDown"> {
  submitOn?: ComposerSubmitMode;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
}

function hasMultipleTextLines(input: HTMLTextAreaElement) {
  if (!input.value) return false;
  if (input.value.includes("\n")) return true;
  if (typeof window === "undefined") return false;

  const style = window.getComputedStyle(input);
  const fontSize = Number.parseFloat(style.fontSize);
  const parsedLineHeight = Number.parseFloat(style.lineHeight);
  const lineHeight = Number.isFinite(parsedLineHeight) ? parsedLineHeight : fontSize * 1.2;
  const padding = Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom);
  const minHeight = Number.parseFloat(style.minHeight);
  const singleLineHeight = Math.max(lineHeight + padding, Number.isFinite(minHeight) ? minHeight : 0);

  return input.scrollHeight > singleLineHeight + 1;
}

const Input = React.forwardRef<HTMLTextAreaElement, ComposerInputProps>(
  ({ className, submitOn = "enter", onInput, onKeyDown, ...props }, ref) => {
    const inputRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [isMultiline, setIsMultiline] = React.useState(false);

    const updateMultiline = React.useCallback((input: HTMLTextAreaElement) => {
      setIsMultiline(hasMultipleTextLines(input));
    }, []);

    const setInputRef = React.useCallback(
      (input: HTMLTextAreaElement | null) => {
        inputRef.current = input;
        if (typeof ref === "function") {
          ref(input);
        } else if (ref) {
          ref.current = input;
        }
      },
      [ref],
    );

    React.useLayoutEffect(() => {
      const input = inputRef.current;
      if (!input) return;

      updateMultiline(input);
      if (typeof ResizeObserver === "undefined") return;

      const observer = new ResizeObserver(() => updateMultiline(input));
      observer.observe(input);
      return () => observer.disconnect();
    }, [updateMultiline]);

    const handleInput = React.useCallback<React.FormEventHandler<HTMLTextAreaElement>>(
      (event) => {
        onInput?.(event);
        updateMultiline(event.currentTarget);
      },
      [onInput, updateMultiline],
    );

    const handleKeyDown = React.useCallback<React.KeyboardEventHandler<HTMLTextAreaElement>>(
      (event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || submitOn === "manual") return;
        if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return;

        const shouldSubmit =
          event.key === "Enter" && (submitOn === "enter" ? !event.shiftKey : event.metaKey || event.ctrlKey);
        if (!shouldSubmit) return;

        event.preventDefault();
        event.currentTarget.form?.requestSubmit();
      },
      [onKeyDown, submitOn],
    );

    return (
      <Textarea
        ref={setInputRef}
        data-slot="composer-input"
        data-multiline={isMultiline || undefined}
        className={cn(
          "min-h-7 min-w-0 w-auto flex-1 basis-0 max-h-[150px] rounded-none border-0 bg-transparent px-0 pb-0.5 pt-1.5 focus-visible:border-transparent",
          isMultiline && "px-1.5 py-1",
          className,
        )}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  },
);
Input.displayName = "Composer.Input";

interface ComposerSubmitProps extends Omit<ButtonProps, "children"> {
  action?: "send" | "stop";
  children?: React.ReactNode;
}

const Submit = React.forwardRef<HTMLButtonElement, ComposerSubmitProps>(
  (
    {
      action = "send",
      className,
      type,
      variant = "glassAccent",
      size = "small",
      children,
      title,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const label = action === "stop" ? "Stop" : "Send";
    return (
      <Button
        ref={ref}
        data-slot="composer-submit"
        type={type ?? (action === "send" ? "submit" : "button")}
        aria-label={ariaLabel ?? label}
        title={title ?? label}
        variant={variant}
        size={size}
        iconOnly
        className={cn("shrink-0", className)}
        {...props}
      >
        {children ??
          (action === "stop" ? (
            <SquareIcon aria-hidden fill="currentColor" className="size-3" />
          ) : (
            <ArrowUpIcon aria-hidden />
          ))}
      </Button>
    );
  },
);
Submit.displayName = "Composer.Submit";

const Footer = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="composer-footer"
    className={cn(
      "flex min-h-9 items-center gap-2 px-2 pb-2 pt-0.5 [&>[data-slot=composer-actions]:last-child:not(:first-child)]:ml-auto",
      className,
    )}
    {...props}
  />
));
Footer.displayName = "Composer.Footer";

export {
  Root,
  Surface,
  Row,
  Actions,
  Control,
  Input,
  Submit,
  Footer,
  type ComposerRootProps,
  type ComposerSurfaceProps,
  type ComposerControlProps,
  type ComposerInputProps,
  type ComposerSubmitProps,
  type ComposerSubmitMode,
};
