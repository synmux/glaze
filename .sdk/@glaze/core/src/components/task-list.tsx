import * as React from "react";
import { CheckCircle2Icon, CircleDashedIcon, Loader2Icon, XCircleIcon } from "lucide-react";

import { cn } from "../utils/cn";
import { type AIStatus } from "./ai-status";

function Root({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="task-list-root" className={cn("flex flex-col gap-0.5", className)} {...props} />;
}

interface TaskListItemProps extends React.ComponentProps<"div"> {
  status: AIStatus;
}

function Item({ className, status, children, ...props }: TaskListItemProps) {
  const Icon =
    status === "success"
      ? CheckCircle2Icon
      : status === "running"
        ? Loader2Icon
        : status === "error"
          ? XCircleIcon
          : CircleDashedIcon;
  return (
    <div
      data-slot="task-list-item"
      data-status={status}
      className={cn("flex min-w-0 items-start gap-1.5 text-regular", className)}
      {...props}
    >
      <Icon
        aria-hidden
        className={cn(
          "mt-0.75 size-3.5 shrink-0",
          status === "pending" && "text-quaternary",
          status === "running" && "animate-spin text-accent",
          status === "success" && "text-accent",
          status === "error" && "text-support-red",
        )}
      />
      <span className={cn("min-w-0 leading-relaxed", status === "pending" ? "text-tertiary" : "text-primary")}>
        {children}
      </span>
    </div>
  );
}

export { Root, Item, type AIStatus, type TaskListItemProps };
