import * as React from "react";

import { cn } from "../utils/cn";
import { cva, VariantProps } from "class-variance-authority";

const textareaVariants = cva(
  cn(
    "bg-transparent border-field focus-visible:border-foreground-40 aria-invalid:ring-support-red/40 aria-invalid:border-support-red/40",
    "text-regular placeholder:text-placeholder rounded-control flex field-sizing-content w-full border px-3 pt-2 pb-2 transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none",
    "max-h-32",
  ),
  {
    variants: {
      size: {
        small: "min-h-14 px-2",
        medium: "min-h-14 px-3",
        large: "min-h-18 px-3",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  },
);

function Textarea({
  className,
  size = "medium",
  ...props
}: Omit<React.ComponentProps<"textarea">, "size"> & VariantProps<typeof textareaVariants>) {
  return <textarea data-slot="textarea" className={cn(textareaVariants({ size }), className)} {...props} />;
}

export { Textarea };
