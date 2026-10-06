import * as React from "react";

import { cn } from "../utils/cn";
import { CollapsibleChevron, CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from "./collapsible";

function Root({ className, ...props }: React.ComponentProps<typeof CollapsibleRoot>) {
  return <CollapsibleRoot data-slot="tool-group-root" className={cn("min-w-0 text-secondary", className)} {...props} />;
}

function Trigger({ className, children, ...props }: React.ComponentProps<typeof CollapsibleTrigger>) {
  return (
    <CollapsibleTrigger
      data-slot="tool-group-trigger"
      className={cn(
        "group/tool-group max-w-full gap-1.5 p-0 text-regular text-secondary hover:text-primary",
        className,
      )}
      {...props}
    >
      <span className="min-w-0 truncate">{children}</span>
      <span className="flex size-4 shrink-0 items-center justify-center text-tertiary opacity-0 transition-opacity group-hover/tool-group:opacity-100 group-focus-visible/tool-group:opacity-100">
        <CollapsibleChevron className="size-3" />
      </span>
    </CollapsibleTrigger>
  );
}

function Content({ className, children, ...props }: React.ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent data-slot="tool-group-content" className={className} {...props}>
      <div className="flex min-w-0 flex-col gap-2 pb-1 pl-4 pt-2">{children}</div>
    </CollapsibleContent>
  );
}

export { Root, Trigger, Content };
