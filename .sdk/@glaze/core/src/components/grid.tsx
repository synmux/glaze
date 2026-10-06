import * as React from "react";
import { cn } from "../utils/cn";
import { Text } from "./text";

interface GridContextValue<T> {
  selectedItem: T | null;
  onItemSelect: (item: T) => void;
  items: T[];
  getItemKey: (item: T) => string;
  columns: number;
  itemActionsRef: React.MutableRefObject<Map<string, () => void>>;
}

interface GridItemContextValue {
  isSelected: boolean;
}

const GridItemContext = React.createContext<GridItemContextValue | null>(null);

function useGridItemContext() {
  const context = React.useContext(GridItemContext);
  if (!context) {
    throw new Error("GridItem components must be used within a Grid.Item");
  }
  return context;
}

const GridContext = React.createContext<GridContextValue<any> | null>(null);

function useGridContext<T>() {
  const context = React.useContext(GridContext);
  if (!context) {
    throw new Error("Grid components must be used within a Grid.Root");
  }
  return context as GridContextValue<T>;
}

interface GridRootProps<T> extends React.ComponentProps<"div"> {
  items: T[];
  selectedItem: T | null;
  onSelectedItemChange: (item: T | null) => void;
  getItemKey: (item: T) => string;
  children: React.ReactNode;
  /** Fixed column count. Ignored when `minColumnWidth` is provided. */
  columns?: number;
  /** Responsive minimum cell width in px — switches the grid to CSS auto-fill. */
  minColumnWidth?: number;
  endThreshold?: number;
  onEndReached?: () => void;
  autoFocus?: boolean;
  onNavigationKeyDown?: (event: React.KeyboardEvent) => void;
}

// Expose a ref type for programmatic control
export interface GridRef {
  focus: () => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
}

const GridRoot = React.forwardRef<GridRef, GridRootProps<any>>(function GridRoot<T>(
  {
    items,
    selectedItem,
    onSelectedItemChange,
    getItemKey,
    children,
    className,
    onKeyDown,
    columns = 4,
    minColumnWidth,
    endThreshold = 0,
    onEndReached,
    autoFocus = false,
    onNavigationKeyDown,
    ...props
  }: GridRootProps<T>,
  ref: React.ForwardedRef<GridRef>,
) {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const itemActionsRef = React.useRef<Map<string, () => void>>(new Map());

  // CSS auto-fill drives the layout when responsive; this state mirrors the rendered
  // column count so keyboard nav (ArrowUp/Down) jumps the right number of cells.
  const [derivedColumns, setDerivedColumns] = React.useState(columns);
  const isResponsive = minColumnWidth !== undefined;
  const navColumns = isResponsive ? derivedColumns : columns;

  React.useLayoutEffect(() => {
    if (!isResponsive) return;
    const el = gridRef.current;
    if (!el) return;

    const measure = () => {
      const tracks = window.getComputedStyle(el).gridTemplateColumns;
      if (!tracks || tracks === "none") return;
      const count = tracks.split(" ").filter(Boolean).length;
      setDerivedColumns((prev) => (prev === count ? prev : count));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isResponsive]);

  React.useEffect(() => {
    if (autoFocus && gridRef.current) {
      const timeoutId = setTimeout(() => {
        const activeElement = document.activeElement;
        const isInputFocused =
          activeElement &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            (activeElement as HTMLElement).contentEditable === "true");

        if (!isInputFocused && gridRef.current) {
          gridRef.current.focus({ preventScroll: true });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, []);

  const contextValue = React.useMemo(
    () => ({
      selectedItem,
      onItemSelect: onSelectedItemChange,
      items,
      getItemKey,
      columns: navColumns,
      itemActionsRef,
    }),
    [selectedItem, onSelectedItemChange, items, getItemKey, navColumns],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (!gridRef.current?.contains(event.target as Node)) return;
      if (items.length === 0) return;

      const currentIndex = selectedItem ? items.findIndex((item) => getItemKey(item) === getItemKey(selectedItem)) : -1;

      switch (event.key) {
        case "ArrowRight": {
          event.preventDefault();
          if (currentIndex < items.length - 1) {
            onSelectedItemChange(items[currentIndex + 1]);
          }
          break;
        }
        case "ArrowLeft": {
          event.preventDefault();
          if (currentIndex > 0) {
            onSelectedItemChange(items[currentIndex - 1]);
          }
          break;
        }
        case "ArrowDown": {
          event.preventDefault();
          const nextRowIndex = currentIndex + navColumns;
          if (nextRowIndex < items.length) {
            onSelectedItemChange(items[nextRowIndex]);
          }
          break;
        }
        case "ArrowUp": {
          event.preventDefault();
          const prevRowIndex = currentIndex - navColumns;
          if (prevRowIndex >= 0) {
            onSelectedItemChange(items[prevRowIndex]);
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
        case "Enter": {
          event.preventDefault();
          if (selectedItem) {
            const selectedItemId = getItemKey(selectedItem);
            const action = itemActionsRef.current.get(selectedItemId);
            if (action) {
              action();
            }
          }
          break;
        }
      }

      onKeyDown?.(event as React.KeyboardEvent<HTMLDivElement>);
      onNavigationKeyDown?.(event);
    },
    [items, selectedItem, getItemKey, onSelectedItemChange, navColumns, onKeyDown, onNavigationKeyDown],
  );

  React.useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        gridRef.current?.focus();
      },
      handleKeyDown,
    }),
    [handleKeyDown],
  );

  return (
    <GridContext.Provider value={contextValue}>
      <div
        {...props}
        ref={gridRef}
        className={cn("focus:outline-none p-2", className)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="grid"
        style={{
          ...props.style,
          display: "grid",
          gridTemplateColumns: isResponsive
            ? `repeat(auto-fill, minmax(${minColumnWidth}px, 1fr))`
            : `repeat(${columns}, minmax(0, 1fr))`,
          gap: "0.5rem",
        }}
      >
        {children}
        {onEndReached && <GridEndMarker onEndReached={onEndReached} endThreshold={endThreshold} />}
      </div>
    </GridContext.Provider>
  );
});
GridRoot.displayName = "Grid.Root";

interface GridEndMarkerProps {
  onEndReached: () => void;
  endThreshold: number;
}

function GridEndMarker({ onEndReached, endThreshold }: GridEndMarkerProps) {
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

  return <div ref={endMarkerRef} className="h-1 col-span-full" aria-hidden="true" />;
}
GridEndMarker.displayName = "Grid.EndMarker";

interface GridItemProps<T> extends Omit<React.ComponentProps<"button">, "onClick" | "onDoubleClick"> {
  item: T;
  children: React.ReactNode;
  onAction?: (item: T) => void;
}

function GridItem<T>({ item, children, className, onAction, ...props }: GridItemProps<T>) {
  const { selectedItem, onItemSelect, getItemKey, itemActionsRef } = useGridContext<T>();
  const isSelected = selectedItem && getItemKey(selectedItem) === getItemKey(item);
  const itemRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const itemId = getItemKey(item);
    if (onAction) {
      itemActionsRef.current.set(itemId, () => onAction(item));
    }
    return () => {
      itemActionsRef.current.delete(itemId);
    };
  }, [item, onAction, getItemKey, itemActionsRef]);

  React.useEffect(() => {
    if (isSelected && itemRef.current) {
      itemRef.current.scrollIntoView({
        behavior: "instant",
        block: "nearest",
      });
    }
  }, [isSelected]);

  // Select on pointerdown so the visual change is immediate, matching Finder.
  // Primary button only — right-clicking a non-selected item must not move
  // the selection; the context menu targets the clicked item while the
  // selection stays put (also Finder behavior).
  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button === 0) {
      onItemSelect(item);
    }
    props.onPointerDown?.(event);
  };

  const handleDoubleClick = () => {
    if (onAction) {
      onAction(item);
    }
  };

  return (
    <GridItemContext.Provider value={{ isSelected: isSelected ?? false }}>
      <button
        {...props}
        ref={itemRef}
        type="button"
        className={cn(
          "rounded-lg w-full flex flex-col items-start gap-2 scroll-mb-4 scroll-mt-[60px] border-2 border-transparent relative",
          "focus:bg-list-selection focus:outline-none",
          className,
        )}
        onPointerDown={handlePointerDown}
        onDoubleClick={handleDoubleClick}
        role="gridcell"
        aria-selected={isSelected || undefined}
      >
        {children}
      </button>
    </GridItemContext.Provider>
  );
}
GridItem.displayName = "Grid.Item";

interface GridItemContentProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

function GridItemContent({ children, className, ...props }: GridItemContentProps) {
  const { isSelected } = useGridItemContext();
  return (
    <div
      {...props}
      className={cn(
        "flex-col flex gap-1 text-center items-center justify-center bg-control-subtle w-full aspect-square shrink-0 rounded-card",
        isSelected && "shadow-[inset_0_0_0_2px_var(--fg)]",
        className,
      )}
      data-selected={isSelected}
    >
      {children}
    </div>
  );
}
GridItemContent.displayName = "Grid.ItemContent";

interface GridItemTitleProps extends Omit<React.ComponentProps<"h3">, "color"> {
  children: React.ReactNode;
}

function GridItemTitle({ children, className, ...props }: GridItemTitleProps) {
  return (
    <Text as="h3" variant="strong" className={cn("line-clamp-2", className)} {...props}>
      {children}
    </Text>
  );
}
GridItemTitle.displayName = "Grid.ItemTitle";

interface GridItemDescriptionProps extends Omit<React.ComponentProps<"p">, "color"> {
  children: React.ReactNode;
}

function GridItemDescription({ children, className, ...props }: GridItemDescriptionProps) {
  return (
    <Text as="p" variant="small" color="secondary" className={cn("line-clamp-2", className)} {...props}>
      {children}
    </Text>
  );
}
GridItemDescription.displayName = "Grid.ItemDescription";

interface GridItemAccessoryProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

function GridItemAccessory({ children, className, ...props }: GridItemAccessoryProps) {
  return (
    <div
      {...props}
      className={cn(
        "text-small text-tertiary shrink-0 flex items-center gap-1 justify-center absolute top-2 right-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
GridItemAccessory.displayName = "Grid.ItemAccessory";

export {
  GridRoot as Root,
  GridItem as Item,
  GridItemContent as ItemContent,
  GridItemTitle as ItemTitle,
  GridItemDescription as ItemDescription,
  GridItemAccessory as ItemAccessory,
};
