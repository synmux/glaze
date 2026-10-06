import * as React from "react";
import { ArrowDownToLineIcon } from "lucide-react";

import { cn } from "../utils/cn";
import { Button } from "./button";

type ConversationContextValue = {
  isAtBottom: boolean;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  setAnchor: (element: HTMLDivElement | null) => void;
};

const ConversationContext = React.createContext<ConversationContextValue | null>(null);

function useConversation(): ConversationContextValue {
  const context = React.useContext(ConversationContext);
  if (!context) throw new Error("Conversation parts must be used inside Conversation.Root");
  return context;
}

interface ConversationRootProps extends React.ComponentProps<"div"> {
  isAtBottom?: boolean;
  onScrollToBottom?: () => void;
}

const Root = React.forwardRef<HTMLDivElement, ConversationRootProps>(
  ({ className, isAtBottom: controlledIsAtBottom, onScrollToBottom, ...props }, ref) => {
    const anchorRef = React.useRef<HTMLDivElement | null>(null);
    const isAtBottom = controlledIsAtBottom ?? true;

    const setAnchor = React.useCallback((element: HTMLDivElement | null) => {
      anchorRef.current = element;
    }, []);

    const scrollToBottom = React.useCallback(
      (behavior: ScrollBehavior = "smooth") => {
        if (onScrollToBottom) {
          onScrollToBottom();
          return;
        }
        anchorRef.current?.scrollIntoView({ behavior, block: "end" });
      },
      [onScrollToBottom],
    );

    const value = React.useMemo<ConversationContextValue>(
      () => ({
        isAtBottom,
        scrollToBottom,
        setAnchor,
      }),
      [isAtBottom, scrollToBottom, setAnchor],
    );

    return (
      <ConversationContext value={value}>
        <div ref={ref} data-slot="conversation-root" className={cn("relative min-h-0", className)} {...props} />
      </ConversationContext>
    );
  },
);
Root.displayName = "Conversation.Root";

const Content = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="conversation-content"
    className={cn("mx-auto flex w-full max-w-[960px] min-w-0 flex-col gap-4 p-4", className)}
    {...props}
  />
));
Content.displayName = "Conversation.Content";

const Anchor = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>((props, forwardedRef) => {
  const context = React.useContext(ConversationContext);
  const setRef = React.useCallback(
    (element: HTMLDivElement | null) => {
      context?.setAnchor(element);
      if (typeof forwardedRef === "function") forwardedRef(element);
      else if (forwardedRef) forwardedRef.current = element;
    },
    [context, forwardedRef],
  );

  return <div ref={setRef} data-slot="conversation-anchor" aria-hidden {...props} />;
});
Anchor.displayName = "Conversation.Anchor";

const ScrollToBottom = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, onClick, title = "Scroll to bottom", "aria-label": ariaLabel, ...props }, ref) => {
    const context = useConversation();
    return (
      <Button
        ref={ref}
        data-slot="conversation-scroll-to-bottom"
        type="button"
        title={title}
        aria-label={ariaLabel ?? title}
        size="small"
        iconOnly
        className={cn(
          "absolute bottom-3 right-3 z-20 transition-all duration-200",
          context.isAtBottom
            ? "pointer-events-none translate-y-2 opacity-0"
            : "pointer-events-auto translate-y-0 opacity-100",
          className,
        )}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) context.scrollToBottom("smooth");
        }}
        {...props}
      >
        <ArrowDownToLineIcon aria-hidden />
      </Button>
    );
  },
);
ScrollToBottom.displayName = "Conversation.ScrollToBottom";

export { Root, Content, Anchor, ScrollToBottom, type ConversationRootProps };
