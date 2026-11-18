"use client";

import { useCallback } from "react";
import { useMotion } from "./MotionProvider";

/**
 * Runs a state update inside a View Transition when the browser supports it.
 *
 * Used for the grid reordering on the marketplace: sorting or filtering moves
 * cards, and a View Transition lets each card glide from its old position to its
 * new one instead of the whole grid snapping. The browser does the work (it
 * snapshots the old layout and interpolates), so there is no FLIP bookkeeping
 * here and no per-card measurement.
 *
 * Progressive enhancement, deliberately: browsers without the API (Safari at the
 * time of writing) run the update directly, and the grid still re-renders
 * correctly — it just does not glide. `isStatic` (reduced motion or data saver)
 * takes the same direct path.
 */
export function useViewTransition() {
  const { isStatic } = useMotion();

  return useCallback(
    (update: () => void) => {
      const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
      if (isStatic || typeof doc.startViewTransition !== "function") {
        update();
        return;
      }
      doc.startViewTransition(update);
    },
    [isStatic]
  );
}
