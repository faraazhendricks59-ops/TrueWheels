"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

type Orientation = "horizontal" | "vertical" | "both";

interface UseRovingTabindexOptions {
  orientation?: Orientation;
  loop?: boolean;
  initialIndex?: number;
  /**
   * `automatic` moves focus and selects with the arrow keys (the tab pattern);
   * `manual` moves focus only and leaves selection to Enter/Space (the menu and
   * listbox pattern). Getting this wrong is the usual cause of a menu that fires
   * an action as you arrow through it.
   */
  activation?: "automatic" | "manual";
  /** Called with the new index when `activation` is `automatic`. */
  onActivate?: (index: number) => void;
}

const ITEM_SELECTOR = [
  '[role="tab"]',
  '[role="menuitem"]',
  '[role="menuitemradio"]',
  '[role="menuitemcheckbox"]',
  '[role="option"]',
  '[role="gridcell"]',
  "button:not([disabled])",
  "a[href]",
].join(",");

/**
 * Roving tabindex for composite widgets (tab lists, menus, grids, toolbars).
 *
 * WCAG 2.1.1: a composite widget must be a single stop in the page tab order,
 * with the arrow keys moving between its items. This hook keeps exactly one item
 * at `tabindex="0"` and the rest at `-1`, and re-homes that zero as focus moves.
 *
 * Two deliberate departures from the naive version:
 *  - It never writes `aria-selected`. That attribute is only meaningful on roles
 *    that support it (tab, option, gridcell, treeitem); stamping it on a button or
 *    a menuitem is an accessibility error, not a feature. Callers that own a
 *    selectable role opt in through `getItemProps(index, { selected })`.
 *  - Visibility is tested with `getClientRects().length`, not `offsetParent`.
 *    `offsetParent` is null for `position: fixed` elements and inside a
 *    transformed ancestor, so the naive test silently drops items that are on
 *    screen. It is also not a layout read, so this stays cheap to call per key.
 */
export function useRovingTabindex<T extends HTMLElement = HTMLElement>({
  orientation = "horizontal",
  loop = true,
  initialIndex = 0,
  activation = "automatic",
  onActivate,
}: UseRovingTabindexOptions = {}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const containerRef = useRef<T | null>(null);
  const activateRef = useRef(onActivate);
  activateRef.current = onActivate;

  const getItems = useCallback((): HTMLElement[] => {
    const container = containerRef.current;
    if (!container) return [];
    return Array.from(container.querySelectorAll<HTMLElement>(ITEM_SELECTOR)).filter(
      (el) =>
        el.getClientRects().length > 0 &&
        el.getAttribute("aria-disabled") !== "true" &&
        el.getAttribute("aria-hidden") !== "true"
    );
  }, []);

  // Keep the DOM tab order in step with `activeIndex`. Written in an effect rather
  // than derived per item so it also covers items the caller renders itself.
  useEffect(() => {
    const items = getItems();
    if (items.length === 0) return;
    // If the active index has drifted past the end (an item was removed), clamp it.
    if (activeIndex > items.length - 1) {
      setActiveIndex(items.length - 1);
      return;
    }
    items.forEach((item, i) => {
      item.setAttribute("tabindex", i === activeIndex ? "0" : "-1");
    });
  }, [activeIndex, getItems]);

  const focusItem = useCallback(
    (index: number) => {
      const items = getItems();
      const item = items[index];
      if (!item) return;
      setActiveIndex(index);
      item.focus();
    },
    [getItems]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const items = getItems();
      if (items.length === 0) return;

      const isHorizontal = orientation === "horizontal" || orientation === "both";
      const isVertical = orientation === "vertical" || orientation === "both";
      const last = items.length - 1;
      let next = activeIndex;

      if ((isHorizontal && event.key === "ArrowRight") || (isVertical && event.key === "ArrowDown")) {
        next = activeIndex >= last ? (loop ? 0 : last) : activeIndex + 1;
      } else if (
        (isHorizontal && event.key === "ArrowLeft") ||
        (isVertical && event.key === "ArrowUp")
      ) {
        next = activeIndex <= 0 ? (loop ? last : 0) : activeIndex - 1;
      } else if (event.key === "Home") {
        next = 0;
      } else if (event.key === "End") {
        next = last;
      } else {
        return;
      }

      event.preventDefault();
      focusItem(next);
      if (activation === "automatic") activateRef.current?.(next);
    },
    [activeIndex, activation, focusItem, getItems, loop, orientation]
  );

  return {
    /** Spread onto the widget container. The caller sets `role` and `aria-label`. */
    containerProps: {
      ref: (node: T | null) => {
        containerRef.current = node;
      },
      onKeyDown: handleKeyDown,
    },
    /**
     * Per-item handlers. `tabIndex` is intentionally omitted — the effect above
     * owns it, so a caller cannot desync it by spreading stale props.
     */
    getItemProps: (index: number, options: { selected?: boolean } = {}) => ({
      onFocus: () => setActiveIndex(index),
      onClick: () => {
        setActiveIndex(index);
        if (activation === "automatic") activateRef.current?.(index);
      },
      ...(options.selected === undefined ? {} : { "aria-selected": options.selected }),
    }),
    activeIndex,
    setActiveIndex,
    focusItem,
    getItems,
  };
}
