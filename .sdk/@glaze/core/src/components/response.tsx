import * as React from "react";

import { cn } from "../utils/cn";

const Response = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="response"
    className={cn("glaze-response w-full min-w-0 select-text text-primary", className)}
    {...props}
  />
));
Response.displayName = "Response";

export { Response };
