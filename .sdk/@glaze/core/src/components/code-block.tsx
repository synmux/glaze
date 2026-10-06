import * as React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { cn } from "../utils/cn";
import { Button } from "./button";

function toPlainText(children: React.ReactNode): string {
  if (Array.isArray(children)) return children.map(toPlainText).join("");
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (React.isValidElement<{ children?: React.ReactNode }>(children)) return toPlainText(children.props.children);
  return "";
}

interface InlineCodeProps extends React.ComponentProps<"code"> {}

const InlineCode = React.forwardRef<HTMLElement, InlineCodeProps>(({ className, style, ...props }, ref) => (
  <code
    ref={ref}
    data-slot="inline-code"
    className={cn("inline-block max-w-full rounded-md bg-control-subtle px-1.5 text-primary wrap-break-all", className)}
    {...props}
    style={{ overflowWrap: "anywhere", ...style }}
  />
));
InlineCode.displayName = "InlineCode";

interface CodeBlockProps extends Omit<React.HTMLAttributes<HTMLPreElement>, "onCopy"> {
  onCopy?: (code: string) => void | Promise<void>;
}

const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(({ children, className, onCopy, ...props }, ref) => {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);
  const codeText = toPlainText(Array.isArray(children) ? children[0] : children);
  const isSingleLine = !codeText.trim().includes("\n");

  React.useEffect(
    () => () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  const handleCopy = async () => {
    if (!onCopy) return;
    await onCopy(codeText);
    setCopied(true);
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 1000);
  };

  return (
    <pre
      ref={ref}
      data-slot="code-block"
      className={cn(
        "relative isolate w-full max-w-full overflow-hidden whitespace-pre-wrap rounded-md bg-control-subtle px-3 py-2 [overflow-wrap:anywhere]",
        className,
      )}
      {...props}
    >
      {onCopy ? (
        <Button
          type="button"
          iconOnly
          variant="filled"
          size="small"
          className={cn("absolute right-2 top-2 z-10", isSingleLine && "right-0.75 top-0.75 bg-transparent!")}
          onClick={() => void handleCopy()}
          aria-label={copied ? "Copied" : "Copy code"}
          title={copied ? "Copied" : "Copy code"}
        >
          {copied ? <CheckIcon aria-hidden /> : <CopyIcon aria-hidden />}
        </Button>
      ) : null}
      {children}
    </pre>
  );
});
CodeBlock.displayName = "CodeBlock";

export { CodeBlock, InlineCode, type CodeBlockProps, type InlineCodeProps };
