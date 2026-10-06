import * as React from "react";
import { cn } from "../utils/cn";
import { Text } from "./text";

interface ListContextValue<T> {
  selectedItem: T | null | undefined;
  onItemSelect: ((item: T) => void) | undefined;
  items: T[];
  getItemKey: (item: T) => string;
  isSelectionEnabled: boolean;
}

const ListContext = React.createContext<ListContextValue<any> | null>(null);

function useListContext<T>() {
  const context = React.useContext(ListContext);
  if (!context) {
    throw new Error("List components must be used within a List.Root");
  }
  return context as ListContextValue<T>;
}

interface ListRootProps<T> extends React.ComponentProps<"div"> {
  items: T[];
  selectedItem?: T | null;
  onSelectedItemChange?: (item: T | null) => void;
  getItemKey: (item: T) => string;
  children: React.ReactNode;
  endThreshold?: number;
  onEndReached?: () => void;
  autoFocus?: boolean;
  onNavigationKeyDown?: (event: React.KeyboardEvent) => void;
}

// Expose a ref type for programmatic control
export interface ListRef {
  focus: () => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
}

const ListRoot = React.forwardRef<ListRef, ListRootProps<any>>(function ListRoot<T>(
  {
    items,
    selectedItem,
    onSelectedItemChange,
    getItemKey,
    children,
    className,
    onKeyDown,
    endThreshold = 0,
    onEndReached,
    autoFocus = false,
    onNavigationKeyDown,
    ...props
  }: ListRootProps<T>,
  ref: React.ForwardedRef<ListRef>,
) {
  const listRef = React.useRef<HTMLDivElement>(null);

  // Focus on mount only (never steal focus on re-render), and never from an active text field.
  React.useEffect(() => {
    if (autoFocus && listRef.current) {
      const timeoutId = setTimeout(() => {
        const activeElement = document.activeElement;
        const isInputFocused =
          activeElement &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            (activeElement as HTMLElement).contentEditable === "true");

        if (!isInputFocused && listRef.current) {
          listRef.current.focus({ preventScroll: true });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, []);
  const isSelectionEnabled = selectedItem !== undefined && onSelectedItemChange !== undefined;

  const contextValue = React.useMemo(
    () => ({
      selectedItem,
      onItemSelect: onSelectedItemChange,
      items,
      getItemKey,
      isSelectionEnabled,
    }),
    [selectedItem, onSelectedItemChange, items, getItemKey, isSelectionEnabled],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (!listRef.current?.contains(event.target as Node)) return;
      if (items.length === 0) return;

      if (isSelectionEnabled && onSelectedItemChange) {
        const currentIndex = selectedItem
          ? items.findIndex((item) => getItemKey(item) === getItemKey(selectedItem))
          : -1;

        switch (event.key) {
          case "ArrowDown": {
            event.preventDefault();
            if (currentIndex < items.length - 1) {
              onSelectedItemChange(items[currentIndex + 1]);
            }
            break;
          }
          case "ArrowUp": {
            event.preventDefault();
            if (currentIndex > 0) {
              onSelectedItemChange(items[currentIndex - 1]);
            }
            break;
          }
          case "Home": {
            event.preventDefault();
            onSelectedItemChange(items[0]);
            break;
          }
          case "End": {
            event.preventDefault();
            onSelectedItemChange(items[items.length - 1]);
            break;
          }
        }
      }

      onKeyDown?.(event as React.KeyboardEvent<HTMLDivElement>);
      onNavigationKeyDown?.(event);
    },
    [items, selectedItem, getItemKey, onSelectedItemChange, onKeyDown, onNavigationKeyDown, isSelectionEnabled],
  );

  React.useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        listRef.current?.focus();
      },
      handleKeyDown,
    }),
    [handleKeyDown],
  );

  return (
    <ListContext.Provider value={contextValue}>
      <div
        {...props}
        ref={listRef}
        className={cn("flex flex-col focus:outline-none px-2 py-2", className)}
        onKeyDown={handleKeyDown}
        tabIndex={isSelectionEnabled ? 0 : undefined}
        role={isSelectionEnabled ? "listbox" : "list"}
      >
        {children}
        {onEndReached && <ListEndMarker onEndReached={onEndReached} endThreshold={endThreshold} />}
      </div>
    </ListContext.Provider>
  );
});
ListRoot.displayName = "List.Root";

interface ListEndMarkerProps {
  onEndReached: () => void;
  endThreshold: number;
}

function ListEndMarker({ onEndReached, endThreshold }: ListEndMarkerProps) {
  const endMarkerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = endMarkerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setTimeout(() => {
            onEndReached();
          }, 100);
        }
      },
      {
        threshold: 0,
        rootMargin: `${endThreshold}px`,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [onEndReached, endThreshold]);

  return <div ref={endMarkerRef} className="h-1" aria-hidden="true" />;
}
ListEndMarker.displayName = "List.EndMarker";

interface ListItemProps<T> extends Omit<React.ComponentProps<"div">, "onClick"> {
  item: T;
  children: React.ReactNode;
  onClick?: (item: T) => void;
}

function isInteractiveElement(target: HTMLElement, itemRef: HTMLElement | null): boolean {
  // Interactive HTML elements
  const interactiveTags = ["BUTTON", "INPUT", "TEXTAREA", "SELECT", "A"];
  if (target.closest(interactiveTags.join(","))) {
    return true;
  }

  // Interactive ARIA roles
  const interactiveRoles = ["button", "menuitem", "option", "link", "checkbox", "radio", "switch", "tab"];
  const role = target.getAttribute("role") || target.closest("[role]")?.getAttribute("role");
  if (role && interactiveRoles.includes(role)) {
    return true;
  }

  // Click originated from outside this list item (e.g., dropdown portal)
  if (itemRef && !itemRef.contains(target)) {
    return true;
  }

  return false;
}

function ListItem<T>({ item, children, className, onClick, ...props }: ListItemProps<T>) {
  const { selectedItem, onItemSelect, items, getItemKey, isSelectionEnabled } = useListContext<T>();
  const isSelected = isSelectionEnabled && selectedItem && getItemKey(selectedItem) === getItemKey(item);
  const itemRef = React.useRef<HTMLDivElement>(null);
  const itemKey = getItemKey(item);
  const itemIndex = React.useMemo(
    () => items.findIndex((candidate) => getItemKey(candidate) === itemKey),
    [items, getItemKey, itemKey],
  );
  // Initialize to false so a pre-selected item on mount (e.g. via a
  // `selectAppId` URL param hydrating with cached query data) is treated as a
  // "became selected" transition and scrolled into view, matching the legacy
  // behavior that scrolled unconditionally on mount when isSelected was true.
  const wasSelectedRef = React.useRef(false);
  const previousIndexRef = React.useRef(itemIndex);

  // Scroll into view when an item becomes selected or when the selected item moves within the list.
  React.useEffect(() => {
    const wasSelected = wasSelectedRef.current;
    const previousIndex = previousIndexRef.current;
    const didBecomeSelected = Boolean(isSelected) && !wasSelected;
    const didSelectedItemMove = Boolean(isSelected) && wasSelected && itemIndex !== previousIndex;

    if ((didBecomeSelected || didSelectedItemMove) && itemRef.current) {
      itemRef.current.scrollIntoView({
        behavior: "instant",
        block: "nearest",
      });
    }

    wasSelectedRef.current = Boolean(isSelected);
    previousIndexRef.current = itemIndex;
  }, [isSelected, itemIndex]);

  // Select on pointerdown so the visual change is immediate, matching Finder.
  // Primary button only — right-clicking a non-selected item must not move
  // the selection; the context menu targets the clicked item while the
  // selection stays put (also Finder behavior).
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (onItemSelect && e.button === 0) {
      onItemSelect(item);
    }
    props.onPointerDown?.(e);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isInteractiveElement(e.target as HTMLElement, itemRef.current)) {
      return;
    }
    onClick?.(item);
  };

  return (
    <div
      {...props}
      ref={itemRef}
      className={cn(
        "rounded-lg px-2 py-2.5 text-left w-full flex items-center justify-between gap-4 scroll-mb-4 scroll-mt-[60px]",
        isSelected && "bg-list-selection",
        "focus:bg-list-selection focus:outline-none",
        className,
      )}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      role={isSelectionEnabled ? "option" : "listitem"}
      aria-selected={isSelectionEnabled ? isSelected || undefined : undefined}
    >
      {children}
    </div>
  );
}
ListItem.displayName = "List.Item";

type ListItemIconProps =
  | ({ children: React.ReactNode } & React.ComponentProps<"div">)
  | ({ src: string; alt: string } & React.ComponentProps<"img">);

function ListItemIcon(props: ListItemIconProps) {
  if ("children" in props) {
    const { children, className, ...divProps } = props;
    return (
      <div {...divProps} className={cn("w-8 h-8 shrink-0 flex items-center justify-center", className)}>
        {children}
      </div>
    );
  } else {
    const { src, alt, className, ...imgProps } = props;
    return <img {...imgProps} src={src} alt={alt} className={cn("w-8 h-8 shrink-0", className)} />;
  }
}

interface ListItemContentProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

function ListItemContent({ children, className, ...props }: ListItemContentProps) {
  return (
    <div {...props} className={cn("flex-col flex gap-1 flex-1 min-w-0", className)}>
      {children}
    </div>
  );
}
ListItemContent.displayName = "List.ItemContent";

interface ListItemTitleProps extends Omit<React.ComponentProps<"h2">, "color"> {
  children: React.ReactNode;
}

function ListItemTitle({ children, className, ...props }: ListItemTitleProps) {
  return (
    <Text as="h2" variant="strong" className={cn("line-clamp-1", className)} {...props}>
      {children}
    </Text>
  );
}
ListItemTitle.displayName = "List.ItemTitle";

interface ListItemDescriptionProps extends Omit<React.ComponentProps<"p">, "color"> {
  children: React.ReactNode;
}

function ListItemDescription({ children, className, ...props }: ListItemDescriptionProps) {
  return (
    <Text as="p" color="secondary" className={cn("line-clamp-2 min-w-1/2 leading-[1.2]", className)} {...props}>
      {children}
    </Text>
  );
}
ListItemDescription.displayName = "List.ItemDescription";

interface ListItemAccessoryProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

function ListItemAccessory({ children, className, ...props }: ListItemAccessoryProps) {
  return (
    <div
      {...props}
      className={cn("text-strong text-tertiary shrink-0 flex items-center gap-1 justify-start", className)}
    >
      {children}
    </div>
  );
}
ListItemAccessory.displayName = "List.ItemAccessory";

interface ListSectionProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

function ListSection({ children, className, ...props }: ListSectionProps) {
  return (
    <div {...props} className={cn("mt-4 first:mt-0", className)}>
      {children}
    </div>
  );
}
ListSection.displayName = "List.Section";

interface ListSectionTitleProps extends Omit<React.ComponentProps<"h3">, "color"> {
  children: React.ReactNode;
}

function ListSectionTitle({ children, className, ...props }: ListSectionTitleProps) {
  return (
    <Text as="h3" variant="small-strong" color="tertiary" className={cn("px-2 mb-1", className)} {...props}>
      {children}
    </Text>
  );
}
ListSectionTitle.displayName = "List.SectionTitle";

export {
  ListRoot as Root,
  ListItem as Item,
  ListItemIcon as ItemIcon,
  ListItemContent as ItemContent,
  ListItemTitle as ItemTitle,
  ListItemDescription as ItemDescription,
  ListItemAccessory as ItemAccessory,
  ListSection as Section,
  ListSectionTitle as SectionTitle,
};
