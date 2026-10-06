import * as React from "react";
import { FileIcon, XIcon } from "lucide-react";

import { cn } from "../utils/cn";
import { Button } from "./button";

type AttachmentData = {
  id?: string;
  name: string;
  src?: string;
  thumbnailSrc?: string;
  width?: number;
  height?: number;
  kind?: "file" | "image" | "pasted_image";
  mimeType?: string;
};

const ATTACHMENT_HEIGHT = 56;
const ATTACHMENT_WIDTH = { portrait: 42, square: 56, landscape: 100 } as const;

function getPreviewWidth(attachment: AttachmentData): number {
  if (!attachment.src) return ATTACHMENT_WIDTH.landscape;
  if (!attachment.width || !attachment.height) return ATTACHMENT_WIDTH.square;

  const ratio = attachment.width / attachment.height;
  if (ratio >= 1.2) return ATTACHMENT_WIDTH.landscape;
  if (ratio <= 0.8) return ATTACHMENT_WIDTH.portrait;
  return ATTACHMENT_WIDTH.square;
}

const AttachmentContext = React.createContext<AttachmentData | null>(null);

function useAttachment(): AttachmentData {
  const attachment = React.useContext(AttachmentContext);
  if (!attachment) throw new Error("Attachments parts must be used inside Attachments.Item");
  return attachment;
}

const Root = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => (
  <div ref={ref} data-slot="attachments-root" className={cn("flex min-w-0 flex-wrap gap-2", className)} {...props} />
));
Root.displayName = "Attachments.Root";

interface AttachmentItemProps extends React.ComponentProps<"div"> {
  attachment: AttachmentData;
}

const Item = React.forwardRef<HTMLDivElement, AttachmentItemProps>(
  ({ attachment, className, style, title, ...props }, ref) => (
    <AttachmentContext value={attachment}>
      <div
        ref={ref}
        data-slot="attachments-item"
        className={cn(
          "group relative flex shrink-0 items-center gap-1.5 overflow-hidden rounded-[14px] bg-control-subtle text-left",
          "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] after:content-['']",
          className,
        )}
        style={{ width: getPreviewWidth(attachment), height: ATTACHMENT_HEIGHT, ...style }}
        title={title ?? attachment.name}
        {...props}
      />
    </AttachmentContext>
  ),
);
Item.displayName = "Attachments.Item";

interface AttachmentPreviewProps extends Omit<React.ComponentProps<"button">, "children"> {
  alt?: string;
}

const Preview = React.forwardRef<HTMLButtonElement, AttachmentPreviewProps>(
  ({ className, alt, disabled, ...props }, ref) => {
    const attachment = useAttachment();
    const imageSource = attachment.src ?? attachment.thumbnailSrc;
    const isFullImage = Boolean(attachment.src);
    let previewLayout = "ml-2 size-4 overflow-visible rounded-none disabled:opacity-100";
    if (isFullImage) {
      previewLayout = "w-full";
    } else if (imageSource) {
      previewLayout = "ml-2 size-8 rounded-lg disabled:opacity-100";
    }

    return (
      <button
        ref={ref}
        data-slot="attachments-preview"
        type="button"
        disabled={disabled ?? !isFullImage}
        className={cn(
          "flex h-full shrink-0 items-center justify-center overflow-hidden rounded-[inherit] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          previewLayout,
          className,
        )}
        {...props}
      >
        {imageSource ? (
          <img
            src={imageSource}
            alt={alt ?? attachment.name}
            draggable={false}
            onContextMenu={(event) => event.preventDefault()}
            className={cn("max-h-full max-w-full", isFullImage ? "size-full object-cover" : "object-contain")}
          />
        ) : (
          <FileIcon aria-hidden className="size-4 text-secondary" />
        )}
      </button>
    );
  },
);
Preview.displayName = "Attachments.Preview";

const Info = React.forwardRef<HTMLSpanElement, React.ComponentProps<"span">>(
  ({ className, children, ...props }, ref) => {
    const attachment = useAttachment();
    if (attachment.src && children === undefined) return null;

    return (
      <span
        ref={ref}
        data-slot="attachments-info"
        className={cn("min-w-0 truncate pr-2 text-small text-primary", className)}
        {...props}
      >
        {children ?? attachment.name}
      </span>
    );
  },
);
Info.displayName = "Attachments.Info";

const Remove = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, title = "Remove attachment", "aria-label": ariaLabel, ...props }, ref) => (
    <Button
      ref={ref}
      data-slot="attachments-remove"
      type="button"
      aria-label={ariaLabel ?? title}
      title={title}
      size="small"
      variant="filled"
      iconOnly
      className={cn(
        "absolute right-1 top-1 z-10 size-5 border border-field bg-control-subtle opacity-0 pointer-events-none",
        "group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto",
        className,
      )}
      {...props}
    >
      <XIcon aria-hidden className="size-3 text-primary" />
    </Button>
  ),
);
Remove.displayName = "Attachments.Remove";

export {
  Root,
  Item,
  Preview,
  Info,
  Remove,
  type AttachmentData,
  type AttachmentItemProps,
  type AttachmentPreviewProps,
};
