import * as React from "react";

import { cn } from "../utils/cn";

/**
 * A tiny accent dot flagging new or unseen content on menu items, sidebar rows, and tabs.
 * For a dot anchored to an avatar corner use `AvatarBadge`; for counts or labels use `Badge`.
 */
function NotificationDot({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="notification-dot"
      className={cn("inline-block size-2 shrink-0 rounded-full bg-accent", className)}
      {...props}
    />
  );
}

export { NotificationDot };
