import * as React from "react";

import { cn } from "../utils/cn";
import { type AIStatus } from "./ai-status";
import { CollapsibleChevron, CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from "./collapsible";

type ReasoningStatus = AIStatus | "streaming";

interface ReasoningRootProps extends React.ComponentProps<typeof CollapsibleRoot> {
  status?: ReasoningStatus;
}

const ReasoningContentContext = React.createContext(false);

function containsReasoningContent(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) return false;
    if (child.type === Content) return true;
    if (child.type !== React.Fragment) return false;
    return containsReasoningContent((child.props as { children?: React.ReactNode }).children);
  });
}

function Root({ className, status = "success", children, ...props }: ReasoningRootProps) {
  const hasContent = containsReasoningContent(children);

  return (
    <ReasoningContentContext value={hasContent}>
      <CollapsibleRoot
        data-slot="reasoning-root"
        data-status={status}
        data-expandable={hasContent ? "" : undefined}
        className={cn("group/reasoning min-w-0 text-secondary", className)}
        {...props}
      >
        {children}
      </CollapsibleRoot>
    </ReasoningContentContext>
  );
}

function Trigger({ className, children, disabled, ...props }: React.ComponentProps<typeof CollapsibleTrigger>) {
  const hasContent = React.useContext(ReasoningContentContext);

  return (
    <CollapsibleTrigger
      data-slot="reasoning-trigger"
      className={cn(
        "group/reasoning-trigger max-w-full gap-1.5 p-0 text-regular text-secondary hover:text-primary",
        !hasContent && "disabled:opacity-100",
        className,
      )}
      disabled={disabled || !hasContent}
      {...props}
    >
      <span className="min-w-0 truncate group-data-[status=streaming]/reasoning:shimmer-text">{children}</span>
      {hasContent ? (
        <span className="flex size-4 shrink-0 items-center justify-center opacity-0 transition-opacity group-hover/reasoning-trigger:opacity-100 group-focus-visible/reasoning-trigger:opacity-100">
          <CollapsibleChevron className="size-3" />
        </span>
      ) : null}
    </CollapsibleTrigger>
  );
}

function Content({ className, children, ...props }: React.ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent data-slot="reasoning-content" className={className} {...props}>
      <div className="flex flex-col gap-2 pt-1 text-secondary">{children}</div>
    </CollapsibleContent>
  );
}

export { Root, Trigger, Content, type ReasoningStatus, type ReasoningRootProps };
