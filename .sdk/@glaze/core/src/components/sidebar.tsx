import * as React from "react";
import { cn } from "../utils/cn";
import { Toolbar, ToolbarRow } from "./toolbar";
import { SearchIcon } from "lucide-react";
import { Slot } from "radix-ui";
import { useWindowFocusState } from "../hooks/use-window-focus";
import { ProgressiveBlur } from "./progressive-blur";
import { ScrollArea } from "./scroll-area";
import { SidebarContext, type SidebarContextValue } from "./sidebar-context";
import { CollapsibleRoot, CollapsibleContent, CollapsibleChevron, CollapsibleTrigger } from "./collapsible";
import { applyButtonDefaults } from "./apply-button-defaults";
import { SplitViewContext } from "./split-view-context";
import { Text, type TextProps } from "./text";
import { isMacOS27Plus } from "../utils";

/**
 * Tracks nesting depth of `SidebarListItem collapsible`. Each level of `SidebarListItem`
 * increments the depth for its nested children. The button in a nested row uses this to apply
 * `padding-left` inline (so the row's full-width background still spans edge-to-edge the way
 * native macOS Mail does — only the content is indented, not the selection highlight).
 */
const SidebarNestContext = React.createContext(0);
// Native Mail indents nested rows by roughly half a row's left-content column. Half of a full
// "chevron + icon" offset (~22px here) is around 20px — enough to land sub-icons clearly right
// of the parent icon without going all the way to the parent-title column.
const NEST_INDENT_PX = 20;
const BASE_ROW_PADDING_PX = 8;

/**
 * Builds the `SidebarContext` value: the sidebar-wide collapsible registry. `SidebarListItem`s
 * with `collapsible=true` register via `useLayoutEffect`, and every `SidebarList` OR's the
 * `hasCollapsibleItems` flag with its own local detection. That way, leaf items in a group with
 * no collapsible siblings still reserve the chevron column whenever *any* group elsewhere in
 * the same Sidebar has collapsibles — icons line up in one vertical column across the whole
 * sidebar without the consumer having to pass any prop.
 */
function useSidebarContextValue(): SidebarContextValue {
  const [count, setCount] = React.useState(0);
  const registerCollapsible = React.useCallback(() => {
    setCount((c) => c + 1);
    return () => setCount((c) => c - 1);
  }, []);
  return React.useMemo(() => ({ registerCollapsible, hasCollapsibleItems: count > 0 }), [registerCollapsible, count]);
}

/**
 * Returns `true` while `forceOpen` is active AND for the render after it flips back to `false`.
 * Animations are suppressed during forced transitions in either direction (search begins /
 * search clears) but re-enabled for genuine user interactions (chevron clicks) once idle.
 */
function useSuppressAnimation(forceOpen: boolean | undefined): boolean {
  const prevRef = React.useRef(forceOpen);
  const justFlippedOff = prevRef.current === true && forceOpen === false;

  React.useEffect(() => {
    prevRef.current = forceOpen;
  });

  return !!forceOpen || justFlippedOff;
}

// Stable marker for cross-module identification (beats reference equality, which breaks across
// bundle boundaries + HMR). Used to detect SidebarListItem children inside SidebarList/Group so
// we can auto-reserve the chevron spacer on leaf items and split trigger/nested content on
// collapsible items.
const SIDEBAR_LIST_ITEM_MARKER = Symbol.for("glaze.SidebarListItem");

function isSidebarListItemElement(child: unknown): child is React.ReactElement<SidebarListItemProps> {
  return (
    React.isValidElement(child) &&
    typeof child.type === "function" &&
    (child.type as { __glazeMarker?: symbol }).__glazeMarker === SIDEBAR_LIST_ITEM_MARKER
  );
}

// Default empty toolbar for sidebar spacing
const DefaultSidebarToolbar = (
  <Toolbar className={cn("pt-1", isMacOS27Plus() ? "pt-4" : "")}>
    <ToolbarRow />
  </Toolbar>
);

/**
 * Apply sidebar toolbar button defaults (variant="transparent", size="small") to Button
 * children — including Buttons wrapped in Tooltip, DropdownMenuTrigger asChild, Popover.Trigger
 * asChild, and other JSX-tree wrappers.
 *
 * `grayIcon` layers `text-tertiary` onto the button so its icon matches the muted chevron
 * next to it (Apple Mail-style section header actions).
 */
function applySidebarButtonDefaults(
  actions: React.ReactNode,
  { grayIcon = false }: { grayIcon?: boolean } = {},
): React.ReactNode {
  if (isMacOS27Plus()) {
    return applyButtonDefaults(actions, {
      variant: "glass",
      size: "large",
      className: grayIcon ? "text-tertiary" : undefined,
    });
  }
  return applyButtonDefaults(actions, {
    variant: "transparent",
    size: "small",
    className: grayIcon ? "text-tertiary" : undefined,
  });
}

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
  /** Escape hatch: pass a fully custom Toolbar. Overrides actions/searchable props. */
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
  scrollEnabled?: boolean;
  /** Action buttons for the sidebar toolbar. Auto-styled with variant="transparent" size="small". */
  actions?: React.ReactNode;
  /** Adds a ToolbarSearchInput row to the sidebar toolbar. */
  searchable?: boolean;
  /** Placeholder text for the search input. Defaults to "Search". */
  searchPlaceholder?: string;
  /** Controlled search value. Omit for uncontrolled mode. */
  searchValue?: string;
  /** Callback when search value changes (controlled mode). */
  onSearchChange?: (value: string) => void;
}

export function Sidebar({
  children,
  className,
  toolbar,
  footer,
  scrollEnabled = true,
  actions,
  searchable,
  searchPlaceholder,
  searchValue,
  onSearchChange,
}: SidebarProps) {
  const isWindowFocused = useWindowFocusState();
  const sidebarContextValue = useSidebarContextValue();
  // Fade non-pinned sidebar actions on collapse so they don't peek through the pinned
  // toggle while the panel is still closing. Pinned toggles render via portal, so they
  // live outside this DOM subtree and stay visible.
  const splitView = React.useContext(SplitViewContext);
  const sidebarCollapsed = splitView?.sidebarCollapsed ?? false;

  const resolvedToolbar = React.useMemo(() => {
    // Escape hatch: explicit toolbar prop takes priority
    if (toolbar) return toolbar;

    const hasActions = actions !== undefined;
    const hasSearch = searchable === true;

    if (!hasActions && !hasSearch) return DefaultSidebarToolbar;

    const styledActions = hasActions ? applySidebarButtonDefaults(actions) : null;
    // Collapse: 150ms fade, no delay — the action drops out immediately so it's gone
    // before the panel can drag it under the pinned toggle.
    // Expand: 150ms fade with a 150ms delay — lets the panel open first, then the
    // action reappears, rather than racing the panel slide.
    const fadedActions = styledActions ? (
      <div
        className="flex items-center gap-2"
        style={{
          opacity: sidebarCollapsed ? 0 : 1,
          pointerEvents: sidebarCollapsed ? "none" : "auto",
          transition: sidebarCollapsed
            ? "opacity 300ms cubic-bezier(0.165, 0.84, 0.44, 1)"
            : "opacity 200ms cubic-bezier(0.165, 0.84, 0.44, 1) 100ms",
        }}
      >
        {styledActions}
      </div>
    ) : null;

    return (
      <Toolbar className={cn(isMacOS27Plus() ? "pt-2" : "", "")}>
        {fadedActions ? <ToolbarRow className="justify-end">{fadedActions}</ToolbarRow> : <ToolbarRow />}
        {hasSearch && (
          <ToolbarRow className={cn(hasActions ? "pb-1" : undefined, isMacOS27Plus() ? "pb-4 pt-2" : "pr-1 pb-2")}>
            <ToolbarSearchInput
              placeholder={searchPlaceholder ?? "Search"}
              value={searchValue}
              onChange={onSearchChange ? (e) => onSearchChange(e.target.value) : undefined}
            />
          </ToolbarRow>
        )}
      </Toolbar>
    );
  }, [toolbar, actions, searchable, searchPlaceholder, searchValue, onSearchChange, sidebarCollapsed]);

  return (
    <SidebarContext.Provider value={sidebarContextValue}>
      <aside
        data-sidebar
        className={cn("size-full shrink-0 pr-0 relative", isMacOS27Plus() ? "overflow-hidden" : "pl-2 py-2", className)}
      >
        {isMacOS27Plus() ? <div className="bg-glass-sidebar absolute inset-0 "></div> : null}
        <div
          className={cn(
            "size-full overflow-hidden relative",
            isWindowFocused ? "" : "bg-well",
            isMacOS27Plus() ? "dimmable-children" : "bg-glass rounded-panel",
          )}
        >
          {scrollEnabled ? (
            <ScrollArea toolbar={resolvedToolbar} footer={footer}>
              {children}
            </ScrollArea>
          ) : (
            children
          )}
        </div>
      </aside>
    </SidebarContext.Provider>
  );
}
Sidebar.displayName = "Sidebar";

/* -----------------------------------------------------------------------------------------------*/

interface SidebarListContextValue<T> {
  selectedItem: T | null | undefined;
  onItemSelect: ((item: T) => void) | undefined;
  items: T[];
  getItemKey: (item: T) => string;
  isSelectionEnabled: boolean;
  /** True when at least one sibling SidebarListItem has `collapsible` — leaf items use this to reserve a chevron spacer. */
  hasCollapsibleItems: boolean;
}

const SidebarListContext = React.createContext<SidebarListContextValue<any> | null>(null);

/** Walk direct children of a list and return true if any is a collapsible SidebarListItem. */
function detectCollapsibleChildren(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some(
    (child) => isSidebarListItemElement(child) && child.props.collapsible === true,
  );
}

interface SidebarListProps<T = unknown> {
  children: React.ReactNode;
  className?: string;
  /** Array of items for managed selection. Used with getItemKey and onSelectedItemChange. */
  items?: T[];
  /** Currently selected item. */
  selectedItem?: T | null;
  /** Callback when selection changes. */
  onSelectedItemChange?: (item: T) => void;
  /** Key extractor for items. Required when items is provided. */
  getItemKey?: (item: T) => string;
  /** Shown when items array is empty. */
  emptyState?: React.ReactNode;
}

export function SidebarList<T>({
  children,
  className,
  items,
  selectedItem,
  onSelectedItemChange,
  getItemKey,
  emptyState,
}: SidebarListProps<T>) {
  const listRef = React.useRef<HTMLUListElement>(null);
  const isSelectionEnabled = selectedItem !== undefined && onSelectedItemChange !== undefined;
  // Two things care about "am I nested inside another SidebarList?":
  //   - `.dimmable` (opacity: 0.4): CSS opacity compounds through the tree. Applying it on every
  //     nested list would double-dim inner items (0.4 × 0.4 = 0.16). Only the outermost opts in.
  //   - Horizontal padding: a nested list would otherwise stack its own `px-2` on top of the
  //     outer list's, insetting nested rows by an extra 8px. Nested lists drop the px so rows
  //     span the same full width as their parent row (matches native Mail selection highlights).
  const isNested = React.useContext(SidebarListContext) != null;
  // `nestDepth` bumps only inside `SidebarListItem collapsible` — so the inner list that
  // `SidebarListGroup collapsible` wraps around its children stays at depth 0 and counts as a
  // top-level sibling for chevron-spacer purposes. Lists deeper than 0 are real sub-item trees,
  // which already get left offset from nest-depth padding and would over-indent with a spacer.
  const nestDepth = React.useContext(SidebarNestContext);
  const sidebarContext = React.useContext(SidebarContext);
  const scopeHasCollapsibleItems = nestDepth === 0 && (sidebarContext?.hasCollapsibleItems ?? false);
  const hasCollapsibleItems = detectCollapsibleChildren(children) || scopeHasCollapsibleItems;

  const contextValue = React.useMemo<SidebarListContextValue<T>>(
    () => ({
      selectedItem,
      onItemSelect: onSelectedItemChange,
      items: items ?? [],
      getItemKey: getItemKey ?? (() => ""),
      isSelectionEnabled,
      hasCollapsibleItems,
    }),
    [selectedItem, onSelectedItemChange, items, getItemKey, isSelectionEnabled, hasCollapsibleItems],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (!items || !getItemKey || !isSelectionEnabled || !onSelectedItemChange || items.length === 0) return;

      const currentIndex = selectedItem ? items.findIndex((item) => getItemKey(item) === getItemKey(selectedItem)) : -1;

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
    },
    [items, selectedItem, getItemKey, onSelectedItemChange, isSelectionEnabled],
  );

  // Show empty state when items is provided but empty
  if (items && items.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <SidebarListContext.Provider value={contextValue}>
      <ul
        ref={listRef}
        className={cn("pb-2", !isNested && (isMacOS27Plus() ? "px-2.5" : "px-2 dimmable"), className)}
        role={isSelectionEnabled ? "listbox" : undefined}
        tabIndex={isSelectionEnabled ? 0 : undefined}
        onKeyDown={isSelectionEnabled ? handleKeyDown : undefined}
      >
        {children}
      </ul>
    </SidebarListContext.Provider>
  );
}

interface SidebarListGroupProps {
  children?: React.ReactNode;
  className?: string;
  /** Section label. When set (in collapsible mode), renders the muted header automatically. */
  title?: React.ReactNode;
  /**
   * Trailing action slot. Button children are auto-styled with `variant="transparent"` (same
   * pattern as Sidebar.actions). When `collapsible`, actions + chevron reveal together on hover.
   */
  actions?: React.ReactNode;
  /** Wrap the group in a Collapsible with an Apple Mail-style header (chevron + hover-revealed actions). */
  collapsible?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Force the group open regardless of user state — e.g. during search. User state is preserved. */
  forceOpen?: boolean;
}

export function SidebarListGroup({
  children,
  className,
  title,
  actions,
  collapsible,
  defaultOpen,
  open,
  onOpenChange,
  forceOpen,
}: SidebarListGroupProps) {
  // Non-collapsible: existing behavior (plain ul). Consumers can still nest a SidebarListGroupTitle child.
  if (!collapsible) {
    return (
      <ul className={cn("group/sidebar-group relative mt-5 first:mt-0", className)}>
        {title != null && <SidebarListGroupTitle>{title}</SidebarListGroupTitle>}
        {children}
      </ul>
    );
  }

  return (
    <CollapsibleSidebarListGroup
      className={className}
      title={title}
      actions={actions}
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      forceOpen={forceOpen}
    >
      {children}
    </CollapsibleSidebarListGroup>
  );
}

/**
 * Collapsible variant internals. Title is plain text (non-interactive). Chevron is a separate
 * small CollapsibleTrigger button. Actions + chevron share one hover-reveal container so they
 * appear/disappear as a unit.
 */
function CollapsibleSidebarListGroup({
  children,
  className,
  title,
  actions,
  defaultOpen,
  open,
  onOpenChange,
  forceOpen,
}: Omit<SidebarListGroupProps, "collapsible">) {
  const [userOpen, setUserOpen] = React.useState(defaultOpen ?? true);
  const isControlled = open !== undefined;
  const resolvedOpen = forceOpen ? true : isControlled ? open : userOpen;
  const suppressAnimation = useSuppressAnimation(forceOpen);

  const handleOpenChange = (next: boolean) => {
    // Ignore programmatic closes while forceOpen — preserves the user's manual state
    // so clearing search restores their prior toggle.
    if (forceOpen) return;
    if (!isControlled) setUserOpen(next);
    onOpenChange?.(next);
  };

  const styledActions = actions ? applySidebarButtonDefaults(actions, { grayIcon: true }) : null;

  // Register on behalf of collapsible children so the sidebar-wide scope stays accurate
  // even when this group is collapsed (and its children are unmounted).
  const hasCollapsibleChildren = detectCollapsibleChildren(children);
  const sidebarCtx = React.useContext(SidebarContext);
  React.useLayoutEffect(() => {
    if (hasCollapsibleChildren && sidebarCtx) {
      return sidebarCtx.registerCollapsible();
    }
  }, [hasCollapsibleChildren, sidebarCtx]);

  return (
    <CollapsibleRoot open={resolvedOpen} onOpenChange={handleOpenChange} animated={!suppressAnimation}>
      <div className={cn("group/sidebar-group relative mt-5 first:mt-0", className)}>
        <div className="mx-4 mb-1 flex items-center gap-1.5 min-h-5">
          {title != null && (
            <Text as="h2" variant="small-strong" color="tertiary" truncate className="m-0">
              {title}
            </Text>
          )}
          <div className="ml-auto flex items-center gap-0.5 opacity-0 transition-opacity group-hover/sidebar-group:opacity-100 group-focus-within/sidebar-group:opacity-100">
            {styledActions}
            <CollapsibleTrigger
              aria-label="Toggle section"
              className="w-auto shrink-0 size-5 p-0 gap-0 rounded flex items-center justify-center text-tertiary active:text-primary outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <CollapsibleChevron />
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent>
          <SidebarList>{children}</SidebarList>
        </CollapsibleContent>
      </div>
    </CollapsibleRoot>
  );
}

interface SidebarListGroupTitleProps {
  children: React.ReactNode;
  /**
   * Render the title's styling on a child element instead of the default `<h2>`. Useful for making
   * the title clickable by composing with `CollapsibleTrigger` — e.g. a collapsible section header.
   */
  asChild?: boolean;
  className?: string;
}

export function SidebarListGroupTitle({ children, asChild, className }: SidebarListGroupTitleProps) {
  const Comp = asChild ? Slot.Slot : "h2";
  return <Comp className={cn("text-small-strong ml-2 mb-2 text-tertiary", className)}>{children}</Comp>;
}

interface SidebarListItemProps<T = unknown> extends Omit<React.ComponentProps<"button">, "onClick" | "title"> {
  /**
   * When `title` is absent, children render as custom row content (escape hatch —
   * avatars, multi-line text, etc). When `title` is set + `collapsible` is true, children
   * are treated as nested items inside the collapsible content.
   */
  children?: React.ReactNode;
  onClick?: () => void;
  /** Explicit selection state. Overridden by context when `item` is provided. */
  selected?: boolean;
  className?: string;
  /** The data item this list item represents. Used with SidebarList's managed selection. */
  item?: T;

  // Props-based row layout. Setting `title` switches to props mode.
  /** Leading icon. SVG children auto-size to `size-4` (16px); pass `size-*` on the icon to override. */
  icon?: React.ReactNode;
  /** Row label. Presence switches the component to props mode (children become nested items when `collapsible`). */
  title?: React.ReactNode;
  /** Secondary text below the title (e.g. "Apple Account" under a user name). */
  subtitle?: React.ReactNode;
  /**
   * Trailing content with `ml-auto` alignment. String/number values are auto-wrapped in the
   * `SidebarListItemAccessory` styling (muted callout, tabular-nums). ReactNode values render as-is.
   */
  accessory?: React.ReactNode;

  // Row-level collapse (requires props mode).
  /** Wrap this item in a Collapsible. Children become nested items. Requires `title`. */
  collapsible?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Force the item open regardless of user state — e.g. during search. */
  forceOpen?: boolean;
}

export function SidebarListItem<T>({
  children,
  onClick,
  selected,
  className,
  item,
  icon,
  title,
  subtitle,
  accessory,
  collapsible,
  defaultOpen,
  open,
  onOpenChange,
  forceOpen,
  ...props
}: SidebarListItemProps<T>) {
  const context = React.useContext(SidebarListContext) as SidebarListContextValue<T> | null;
  const itemRef = React.useRef<HTMLLIElement>(null);

  const usePropsMode = title !== undefined;
  const effectivelyCollapsible = collapsible === true && usePropsMode;
  const showChevronSpacer = usePropsMode && !effectivelyCollapsible && context?.hasCollapsibleItems === true;

  // Register this item into the Sidebar-wide collapsible registry. `useLayoutEffect` fires
  // before paint, so leaves in other groups pick up the chevron-spacer reservation on the same
  // frame — no flash of unreserved layout.
  const sidebarContext = React.useContext(SidebarContext);
  React.useLayoutEffect(() => {
    if (effectivelyCollapsible && sidebarContext) {
      return sidebarContext.registerCollapsible();
    }
  }, [effectivelyCollapsible, sidebarContext]);

  // Selection (unchanged)
  const isContextManaged = context?.isSelectionEnabled && item !== undefined;
  const isSelected = isContextManaged
    ? context.selectedItem != null && context.getItemKey(context.selectedItem) === context.getItemKey(item!)
    : selected;

  // Collapsible state — forceOpen overrides everything, otherwise controlled/uncontrolled.
  const [userOpen, setUserOpen] = React.useState(defaultOpen ?? false);
  const isOpenControlled = open !== undefined;
  const resolvedOpen = forceOpen ? true : isOpenControlled ? open : userOpen;
  const suppressAnimation = useSuppressAnimation(forceOpen);
  const handleOpenChange = (next: boolean) => {
    if (forceOpen) return;
    if (!isOpenControlled) setUserOpen(next);
    onOpenChange?.(next);
  };

  React.useEffect(() => {
    if (isContextManaged && isSelected && itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: "instant", block: "nearest" });
    }
  }, [isContextManaged, isSelected]);

  const handleClick = () => {
    if (isContextManaged && context.onItemSelect) {
      context.onItemSelect(item!);
    }
    onClick?.();
  };

  // Row content: props mode builds it from icon/title/accessory; children mode preserves the
  // existing icon-shrink-0 + truncated-text transform for custom content.
  const rowContent = usePropsMode
    ? renderPropsModeContent({
        effectivelyCollapsible,
        showChevronSpacer,
        icon,
        title,
        subtitle,
        accessory,
        open: resolvedOpen,
        onToggle: () => handleOpenChange(!resolvedOpen),
      })
    : renderChildrenModeContent(children);

  // Nested rows get extra `padding-left` on the button (not on the parent ul) so the row's
  // full-width background still spans edge-to-edge — native Mail indents the content, not the
  // selection highlight. `padding-right` stays at the base row padding.
  const nestDepth = React.useContext(SidebarNestContext);
  const buttonInlineStyle =
    nestDepth > 0 ? { paddingLeft: `${BASE_ROW_PADDING_PX + nestDepth * NEST_INDENT_PX}px` } : undefined;

  const buttonEl = (
    <button
      {...props}
      className={cn(
        "flex items-center gap-2 w-full text-left py-1 rounded-lg min-h-8 min-w-0",
        // Top-level: symmetric `px-2`. Nested: right padding only (left comes from inline style).
        nestDepth === 0 ? "px-2" : "pr-2",
        isSelected && "bg-list-selection text-primary",
        "outline-none focus-visible:ring-1 ring-ring rounded-lg",
        className,
      )}
      style={buttonInlineStyle}
      onMouseDown={(e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        handleClick();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleClick();
        }
      }}
      role={isContextManaged ? "option" : undefined}
      aria-selected={isContextManaged ? isSelected || undefined : undefined}
    >
      {rowContent}
    </button>
  );

  if (effectivelyCollapsible) {
    return (
      <li ref={itemRef} className="min-w-0">
        <CollapsibleRoot open={resolvedOpen} onOpenChange={handleOpenChange} animated={!suppressAnimation}>
          {buttonEl}
          <CollapsibleContent>
            {/* Nested `SidebarList` keeps its default `px-2` (so leaf `<li>`s are full-width);
                the nest-depth increment flows into each leaf's button padding-left instead. */}
            <SidebarNestContext.Provider value={nestDepth + 1}>
              <SidebarList className="pb-0">{children}</SidebarList>
            </SidebarNestContext.Provider>
          </CollapsibleContent>
        </CollapsibleRoot>
      </li>
    );
  }

  return (
    <li ref={itemRef} className="min-w-0">
      {buttonEl}
    </li>
  );
}

// Marker so detectCollapsibleChildren / children walks work across module boundaries.
(SidebarListItem as unknown as { __glazeMarker: symbol }).__glazeMarker = SIDEBAR_LIST_ITEM_MARKER;
SidebarListItem.displayName = "SidebarListItem";

function renderPropsModeContent({
  effectivelyCollapsible,
  showChevronSpacer,
  icon,
  title,
  subtitle,
  accessory,
  open,
  onToggle,
}: {
  effectivelyCollapsible: boolean;
  showChevronSpacer: boolean;
  icon: React.ReactNode;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  accessory: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      {effectivelyCollapsible && <CollapsibleChevron open={open} onToggle={onToggle} className="-ml-1.5 -mr-2" />}
      {showChevronSpacer && <span className="size-3.5 shrink-0 -ml-1.5 -mr-2" aria-hidden />}
      {icon != null && <span className="flex shrink-0 items-center [&_svg:not([class*='size-'])]:size-4">{icon}</span>}
      {subtitle != null ? (
        <SidebarListItemContent>
          <SidebarListItemTitle>{title}</SidebarListItemTitle>
          <SidebarListItemSubtitle>{subtitle}</SidebarListItemSubtitle>
        </SidebarListItemContent>
      ) : (
        <SidebarListItemTitle className="min-w-0 flex-1">{title}</SidebarListItemTitle>
      )}
      {accessory != null && renderAccessory(accessory)}
    </>
  );
}

function renderAccessory(accessory: React.ReactNode): React.ReactNode {
  if (typeof accessory === "string" || typeof accessory === "number") {
    return <SidebarListItemAccessory>{accessory}</SidebarListItemAccessory>;
  }
  return accessory;
}

function renderChildrenModeContent(children: React.ReactNode): React.ReactNode {
  return React.Children.toArray(children).map((child, index) => {
    if (React.isValidElement(child)) {
      return child;
    }
    return (
      <span key={index} className="truncate min-w-0">
        {child}
      </span>
    );
  });
}

/** Vertical flex container for title + subtitle. Handles `min-w-0 flex-1` so text truncates correctly. */
export function SidebarListItemContent({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("flex flex-col min-w-0 flex-1 gap-0.5", className)} {...props} />;
}

/** Row title — used internally by props mode. Use directly in children mode for consistent styling. */
export function SidebarListItemTitle({ className, ...props }: TextProps) {
  return (
    <Text
      variant="regular"
      color="inherit"
      className={cn("whitespace-nowrap text-ellipsis overflow-clip [overflow-clip-margin:0.2em]", className)}
      {...props}
    />
  );
}

/** Secondary text below title. Use directly in children mode for consistent styling. */
export function SidebarListItemSubtitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-small whitespace-nowrap text-ellipsis overflow-clip [overflow-clip-margin:0.2em] text-tertiary",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Trailing accessory slot for `SidebarListItem` — badges, counts, status indicators. Passing
 * `accessory="12"` as a string on `SidebarListItem` auto-wraps it in this styling. Use the
 * component directly when the accessory has multiple pieces (icon + text, status + badge).
 */
export function SidebarListItemAccessory({ className, children, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("text-small ml-auto shrink-0 flex items-center gap-1 text-tertiary tabular-nums", className)}
      {...props}
    >
      {children}
    </span>
  );
}

export function SidebarFooter({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className}>
      <ProgressiveBlur position="bottom" height="100%" />
      <div className={cn("relative z-10", isMacOS27Plus() ? "px-2.5 pb-2.5" : "px-2 pb-2")}>{children}</div>
    </div>
  );
}

// Utility component for search input in toolbars
interface ToolbarSearchInputProps {
  ref?: React.Ref<HTMLInputElement>;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
}

export const ToolbarSearchInput = React.forwardRef<HTMLInputElement, ToolbarSearchInputProps>(
  ({ placeholder = "Search", value, onChange, onKeyDown, onFocus, onBlur, className }, ref) => {
    // Internal state for uncontrolled mode
    const [internalValue, setInternalValue] = React.useState("");
    const isControlled = value !== undefined;
    const inputValue = isControlled ? value : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    return (
      <div
        className={cn(
          "flex items-center pl-2 rounded-pill h-7 gap-2 w-full backdrop-blur-sm",
          isMacOS27Plus() ? "bg-glass" : "bg-input",
          className,
        )}
      >
        <div className="size-4 shrink-0">
          <SearchIcon className="w-4 h-4 text-secondary" />
        </div>
        <input
          ref={ref}
          type="search"
          placeholder={placeholder}
          className="text-regular h-full w-full pr-2 outline-none"
          onChange={handleChange}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          value={inputValue}
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
        />
      </div>
    );
  },
);

ToolbarSearchInput.displayName = "ToolbarSearchInput";

/**
 * @deprecated Use Toolbar with ToolbarRow instead.
 * Padding and height are automatically optimized inside sidebars.
 * Example:
 * ```tsx
 * <Toolbar>
 *   <ToolbarRow className="justify-end">
 *     <Button iconOnly>...</Button>
 *   </ToolbarRow>
 *   <ToolbarRow>
 *     <ToolbarSearchInput ... />
 *   </ToolbarRow>
 * </Toolbar>
 * ```
 */
export const SidebarToolbar = Toolbar;

/**
 * @deprecated Use ToolbarActions or a simple div with flex instead.
 */
export function SidebarToolbarActions({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div data-toolbar-actions className={cn("flex items-center justify-end w-full", className)}>
      {children}
    </div>
  );
}

/**
 * @deprecated Use ToolbarSearchInput instead.
 */
export const SidebarToolbarSearchInput = ToolbarSearchInput;
