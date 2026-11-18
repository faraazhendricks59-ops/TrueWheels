"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import { Icon } from "./Icon";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { useMotion } from "@/components/motion/MotionProvider";

export interface SlidingTab<T extends string> {
  id: T;
  label: string;
  icon?: LucideIcon;
  /** Optional feature gate, so a tab can be hidden by the same flags as before. */
  featureKey?: string;
}

interface SlidingTabsProps<T extends string> {
  tabs: SlidingTab<T>[];
  activeId: T;
  onChange: (id: T) => void;
  panelId: string;
  ariaLabel: string;
  className?: string;
}

/**
 * A tablist whose active marker slides between tabs instead of jumping.
 *
 * The marker is one absolutely-positioned element measured against the active
 * tab, so the movement is a single transform/width transition rather than four
 * tabs each animating their own border. That is both cheaper and the effect you
 * actually want: the highlight reads as one object moving, which tells the eye
 * the tabs are the same control.
 *
 * Keyboard handling follows the tab pattern: arrow keys move the selection and
 * focus with it, Home and End jump to the ends, and only the selected tab is in
 * the tab order.
 *
 * The marker is measured after paint and hidden until it has a real position, so
 * it never flashes at the top-left before the first measurement. For a reader who
 * has asked for reduced motion or is in data-saver mode, the transition is simply
 * off and the marker still sits under the right tab.
 */
export function SlidingTabs<T extends string>({
  tabs,
  activeId,
  onChange,
  panelId,
  ariaLabel,
  className,
}: SlidingTabsProps<T>) {
  const { isStatic } = useMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const [marker, setMarker] = useState<{ left: number; width: number } | null>(null);

  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>(`#tab-${CSS.escape(activeId)}`);
    if (!active) {
      setMarker(null);
      return;
    }
    setMarker({ left: active.offsetLeft, width: active.offsetWidth });
  }, [activeId]);

  // Layout effect: measure before the browser paints so the marker appears in
  // place rather than sliding in from wherever it was last time.
  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    // The row scrolls horizontally and reflows on resize; both move the tabs
    // under the marker, so it has to be re-measured.
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [measure]);

  const move = (delta: number) => {
    const index = tabs.findIndex((tab) => tab.id === activeId);
    if (index === -1) return;
    const next = tabs[(index + delta + tabs.length) % tabs.length];
    onChange(next.id);
    listRef.current?.querySelector<HTMLButtonElement>(`#tab-${CSS.escape(next.id)}`)?.focus();
  };

  const jump = (to: "first" | "last") => {
    const next = to === "first" ? tabs[0] : tabs[tabs.length - 1];
    onChange(next.id);
    listRef.current?.querySelector<HTMLButtonElement>(`#tab-${CSS.escape(next.id)}`)?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        move(1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        move(-1);
        break;
      case "Home":
        event.preventDefault();
        jump("first");
        break;
      case "End":
        event.preventDefault();
        jump("last");
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={clsx("relative flex gap-1 overflow-x-auto hide-scrollbar", className)}
    >
      <span
        aria-hidden="true"
        className={clsx(
          "absolute bottom-0 h-0.5 rounded-full bg-brand",
          marker && !isStatic && "transition-[left,width] duration-base ease-swift"
        )}
        style={{
          left: marker?.left ?? 0,
          width: marker?.width ?? 0,
          opacity: marker ? 1 : 0,
        }}
      />
      {tabs.map((tab) => {
        const isActive = activeId === tab.id;
        const button = (
          <button
            id={`tab-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors",
              isActive
                ? "text-brand"
                : "text-ink-500 hover:text-ink-900 dark:hover:text-white"
            )}
          >
            {tab.icon && <Icon icon={tab.icon} size="sm" strokeWidth={isActive ? 2.5 : 1.75} />}
            {tab.label}
          </button>
        );

        return tab.featureKey ? (
          <FeatureGate key={tab.id} featureKey={tab.featureKey as "profile.tab_posts"}>
            {button}
          </FeatureGate>
        ) : (
          <span key={tab.id} className="contents">
            {button}
          </span>
        );
      })}
    </div>
  );
}
