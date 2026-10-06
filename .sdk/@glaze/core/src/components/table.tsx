"use client";

import * as React from "react";
import { cn } from "../utils/cn";
import { ScrollArea } from "./scroll-area";

function Table({ className, children, ...props }: React.ComponentProps<"table"> & { stickyHeader?: boolean }) {
  const hasStickyHeader = React.useMemo(() => {
    let found = false;
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && (child.props as { sticky?: boolean })?.sticky === true) {
        found = true;
      }
    });
    return found;
  }, [children]);

  const table = (
    <table
      data-slot="table"
      className={cn("text-regular w-full caption-bottom border-spacing-y-0.5 border-separate", className)}
      {...props}
    >
      {children}
    </table>
  );

  // Sticky headers need the parent to own scrolling, so skip the ScrollArea wrapper.
  if (hasStickyHeader) {
    return table;
  }

  return <ScrollArea scrollbars="horizontal">{table}</ScrollArea>;
}

function TableHeader({ className, sticky, ...props }: React.ComponentProps<"thead"> & { sticky?: boolean }) {
  return (
    <thead
      data-slot="table-header"
      data-sticky={sticky}
      className={cn(sticky ? "sticky top-2 z-50" : "", "[&_tr]:border-b border-tertiary", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        "[&_tr:last-child]:border-0",
        "[&_tr:nth-child(odd)_td]:bg-well",
        "[&_tr_td:first-child]:rounded-l-lg",
        "[&_tr_td:last-child]:rounded-r-lg",
        className,
      )}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "[&_tr_td]:bg-foreground-5",
        "[&_tr_td:first-child]:rounded-l-lg",
        "[&_tr_td:last-child]:rounded-r-lg",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr data-slot="table-row" className={cn(className)} {...props} />;
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn("text-strong h-10 px-3 text-left align-middle text-secondary whitespace-nowrap", className)}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td data-slot="table-cell" className={cn("py-2 px-3 align-middle whitespace-nowrap", className)} {...props} />;
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption data-slot="table-caption" className={cn("text-regular text-secondary mt-4", className)} {...props} />;
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
