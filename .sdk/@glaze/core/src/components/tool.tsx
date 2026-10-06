import * as React from "react";

import { cn } from "../utils/cn";
import { type AIStatus } from "./ai-status";
import { CollapsibleChevron, CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from "./collapsible";

interface ToolRootProps extends React.ComponentProps<typeof CollapsibleRoot> {
  status: AIStatus;
}

const ToolContentContext = React.createContext(false);

function containsToolContent(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) return false;
    if (child.type === Content) return true;
    if (child.type !== React.Fragment) return false;
    return containsToolContent((child.props as { children?: React.ReactNode }).children);
  });
}

function Root({ className, status, children, ...props }: ToolRootProps) {
  const hasContent = containsToolContent(children);

  return (
    <ToolContentContext value={hasContent}>
      <CollapsibleRoot
        data-slot="tool-root"
        data-status={status}
        data-expandable={hasContent ? "" : undefined}
        className={cn("group/tool-state min-w-0 text-regular text-secondary", className)}
        {...props}
      >
        {children}
      </CollapsibleRoot>
    </ToolContentContext>
  );
}

function Trigger({ className, children, disabled, ...props }: React.ComponentProps<typeof CollapsibleTrigger>) {
  const hasContent = React.useContext(ToolContentContext);

  return (
    <CollapsibleTrigger
      data-slot="tool-trigger"
      className={cn(
        "group/tool-trigger w-full min-w-0 gap-1.5 p-0 text-left text-secondary hover:text-primary",
        !hasContent && "disabled:opacity-100",
        className,
      )}
      disabled={disabled || !hasContent}
      {...props}
    >
      {children}
      {hasContent ? (
        <span className="flex size-4 shrink-0 items-center justify-center opacity-0 transition-opacity group-hover/tool-trigger:opacity-100 group-focus-visible/tool-trigger:opacity-100">
          <CollapsibleChevron className="size-3" />
        </span>
      ) : null}
    </CollapsibleTrigger>
  );
}

function Name({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tool-name"
      className={cn(
        "shrink-0 whitespace-nowrap group-data-[status=pending]/tool-state:shimmer-text group-data-[status=running]/tool-state:shimmer-text",
        className,
      )}
      {...props}
    />
  );
}

function Summary({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="tool-summary" className={cn("min-w-0 truncate text-tertiary", className)} {...props} />;
}

function Content({ className, children, ...props }: React.ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent data-slot="tool-content" className={className} {...props}>
      <div className="flex min-w-0 flex-col gap-2 pb-1 pl-4 pt-2">{children}</div>
    </CollapsibleContent>
  );
}

function Input({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="tool-input" className={cn("min-w-0 text-tertiary", className)} {...props} />;
}

function Output({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="tool-output" className={cn("min-w-0 text-primary", className)} {...props} />;
}

function Error({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="tool-error" role="alert" className={cn("min-w-0 text-support-red", className)} {...props} />;
}

export { Root, Trigger, Name, Summary, Content, Input, Output, Error, type AIStatus, type ToolRootProps };
