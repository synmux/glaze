import * as React from "react";
import { Slot as SlotPrimitive } from "radix-ui";

import { cn } from "../utils/cn";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type MessageFrom = "user" | "assistant" | "system";
type MessageActionSide = "top" | "bottom" | "left" | "right";

interface MessageRootProps extends React.ComponentProps<"article"> {
  from: MessageFrom;
}

const Root = React.forwardRef<HTMLElement, MessageRootProps>(({ className, from, ...props }, ref) => (
  <article
    ref={ref}
    data-slot="message-root"
    data-from={from}
    className={cn(
      "group/message relative flex w-full min-w-0 flex-col gap-2",
      from === "user" && "ml-auto max-w-[90%] items-end",
      from === "assistant" && "items-start gap-4",
      from === "system" && "items-center text-secondary",
      className,
    )}
    {...props}
  />
));
Root.displayName = "Message.Root";

const Content = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="message-content"
    className={cn(
      "min-w-0 max-w-full text-regular text-primary [overflow-wrap:anywhere]",
      "group-data-[from=user]/message:w-fit group-data-[from=user]/message:rounded-card group-data-[from=user]/message:bg-control-subtle group-data-[from=user]/message:px-3 group-data-[from=user]/message:py-2 group-data-[from=user]/message:whitespace-pre-wrap",
      className,
    )}
    {...props}
  />
));
Content.displayName = "Message.Content";

const Actions = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="message-actions"
    className={cn("flex items-center gap-1 text-secondary", className)}
    {...props}
  />
));
Actions.displayName = "Message.Actions";

interface MessageActionProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  tooltip?: React.ReactNode;
  side?: MessageActionSide;
}

const Action = React.forwardRef<HTMLElement, MessageActionProps>(
  ({ asChild = false, tooltip, side = "top", children, ...props }, ref) => {
    const Comp = asChild ? SlotPrimitive.Slot : "span";
    const action = (
      <Comp ref={ref} data-slot="message-action" {...props}>
        {children}
      </Comp>
    );

    if (!tooltip) return action;
    return (
      <Tooltip>
        <TooltipTrigger asChild>{action}</TooltipTrigger>
        <TooltipContent side={side}>{tooltip}</TooltipContent>
      </Tooltip>
    );
  },
);
Action.displayName = "Message.Action";

export {
  Root,
  Content,
  Actions,
  Action,
  type MessageFrom,
  type MessageRootProps,
  type MessageActionProps,
  type MessageActionSide,
};
