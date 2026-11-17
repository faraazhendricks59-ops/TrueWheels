"use client";

import { useState, useEffect, useRef, useCallback, ReactNode } from "react";
import { clsx } from "clsx";

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  overscan?: number;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  /** Accessible name for the scrollable region. */
  label?: string;
  getKey?: (item: T, index: number) => string | number;
}

/**
 * Windowed renderer for long lists. Zero dependencies: it measures the
 * viewport through a ResizeObserver rather than reading clientHeight during
 * render, which would be 0 on the first paint and produce an empty list.
 */
export function VirtualList<T>({
  items,
  itemHeight,
  overscan = 5,
  renderItem,
  className,
  label = "Scrollable list",
  getKey,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => setViewportHeight(el.clientHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + viewportHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      role="list"
      aria-label={label}
      className={clsx("overflow-y-auto", className)}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => {
            const absoluteIndex = startIndex + index;
            return (
              <div
                key={getKey ? getKey(item, absoluteIndex) : absoluteIndex}
                role="listitem"
                style={{ height: itemHeight }}
              >
                {renderItem(item, absoluteIndex)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
