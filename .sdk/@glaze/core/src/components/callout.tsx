import * as React from "react";
import { XIcon } from "lucide-react";

import { cn } from "../utils/cn";
import { badgeColorClasses, type BadgeColor } from "./badge-variants";
import { Button } from "./button";

export type CalloutColor = BadgeColor;

export interface CalloutProps extends Omit<React.ComponentProps<"div">, "color"> {
  /** Color treatment. Matches Badge colors and defaults to `secondary` (soft neutral). */
  color?: CalloutColor;
  /** Optional leading icon for the props API. */
  icon?: React.ReactNode;
  /** Optional trailing actions, usually one small Button. */
  actions?: React.ReactNode;
  /** Adds a trailing dismiss button. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. */
  dismissLabel?: string;
}

function isCalloutPart(child: React.ReactNode): boolean {
  if (!React.isValidElement(child)) return false;

  const displayName = (child.type as { displayName?: string }).displayName;
  return (
    displayName === "Callout.Icon" ||
    displayName === "Callout.Text" ||
    displayName === "Callout.Actions" ||
    displayName === "Callout.Close"
  );
}

function CalloutRoot({
  className,
  color = "secondary",
  icon,
  actions,
  onDismiss,
  dismissLabel,
  children,
  ...props
}: CalloutProps) {
  const usesPropsApi = icon !== undefined || actions !== undefined || onDismiss !== undefined;
  const hasComposedChildren = React.Children.toArray(children).some(isCalloutPart);
  const isSimple = !usesPropsApi && !hasComposedChildren;

  if (isSimple) {
    return (
      <div
        data-slot="callout"
        className={cn(
          "flex w-full items-center justify-center rounded-control p-3 text-center text-regular-strong",
          badgeColorClasses[color],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      data-slot="callout"
      className={cn(
        "flex w-full items-center gap-3 rounded-control p-3 text-left text-regular-strong",
        badgeColorClasses[color],
        className,
      )}
      {...props}
    >
      {usesPropsApi ? (
        <>
          {icon !== undefined && <CalloutIcon>{icon}</CalloutIcon>}
          {hasComposedChildren ? children : children !== undefined && <CalloutText>{children}</CalloutText>}
          {actions !== undefined && <CalloutActions>{actions}</CalloutActions>}
          {onDismiss !== undefined && <CalloutClose onClick={onDismiss} label={dismissLabel} />}
        </>
      ) : (
        children
      )}
    </div>
  );
}
CalloutRoot.displayName = "Callout";

type CalloutIconProps = React.ComponentProps<"div">;

function CalloutIcon({ className, ...props }: CalloutIconProps) {
  return (
    <div
      data-slot="callout-icon"
      className={cn("flex size-4 shrink-0 items-center justify-center [&>svg]:size-4", className)}
      {...props}
    />
  );
}
CalloutIcon.displayName = "Callout.Icon";

type CalloutTextProps = React.ComponentProps<"p">;

function CalloutText({ className, ...props }: CalloutTextProps) {
  return <p data-slot="callout-text" className={cn("min-w-0 flex-1 text-regular-strong", className)} {...props} />;
}
CalloutText.displayName = "Callout.Text";

type CalloutActionsProps = React.ComponentProps<"div">;

function CalloutActions({ className, ...props }: CalloutActionsProps) {
  return (
    <div
      data-slot="callout-actions"
      className={cn("flex shrink-0 items-center gap-2 self-center", className)}
      {...props}
    />
  );
}
CalloutActions.displayName = "Callout.Actions";

export interface CalloutCloseProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label?: string;
}

function CalloutClose({ className, label = "Dismiss", "aria-label": ariaLabel, ...props }: CalloutCloseProps) {
  return (
    <Button
      type="button"
      iconOnly
      size="small"
      variant="transparent"
      data-slot="callout-close"
      className={cn("-my-1 -mr-1 self-center opacity-70 hover:opacity-100 focus-visible:ring-current", className)}
      aria-label={ariaLabel ?? label}
      {...props}
    >
      <XIcon className="size-3.5" />
    </Button>
  );
}
CalloutClose.displayName = "Callout.Close";

const Callout = Object.assign(CalloutRoot, {
  Icon: CalloutIcon,
  Text: CalloutText,
  Actions: CalloutActions,
  Close: CalloutClose,
});

export { Callout };
