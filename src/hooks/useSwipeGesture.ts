"use client";

import { useCallback, useRef } from "react";

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  /** Horizontal distance in px required to count as a swipe. */
  threshold?: number;
}

/**
 * Detects horizontal swipes on the element the returned ref is attached to.
 *
 * Returns a callback ref rather than attaching to `document`, because a
 * document-level listener is registered once per consumer and is never removed
 * when the handlers change identity — an inline arrow handler re-registers on
 * every render and leaks listeners.
 *
 * A gesture is only treated as a swipe when it is more horizontal than
 * vertical, so scrolling a list never triggers navigation.
 */
export function useSwipeGesture({ onSwipeLeft, onSwipeRight, threshold = 50 }: SwipeHandlers) {
  // Held in a ref so changing handlers never re-attaches the listeners.
  const handlers = useRef({ onSwipeLeft, onSwipeRight });
  handlers.current = { onSwipeLeft, onSwipeRight };

  const detach = useRef<(() => void) | null>(null);

  return useCallback(
    (node: HTMLElement | null) => {
      detach.current?.();
      detach.current = null;
      if (!node) return;

      let startX: number | null = null;
      let startY: number | null = null;

      const onTouchStart = (e: TouchEvent) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      };

      const onTouchEnd = (e: TouchEvent) => {
        if (startX === null || startY === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        startX = null;
        startY = null;

        if (Math.abs(dx) <= Math.abs(dy)) return;

        if (dx <= -threshold) handlers.current.onSwipeLeft?.();
        else if (dx >= threshold) handlers.current.onSwipeRight?.();
      };

      node.addEventListener("touchstart", onTouchStart, { passive: true });
      node.addEventListener("touchend", onTouchEnd, { passive: true });
      detach.current = () => {
        node.removeEventListener("touchstart", onTouchStart);
        node.removeEventListener("touchend", onTouchEnd);
      };
    },
    [threshold]
  );
}
