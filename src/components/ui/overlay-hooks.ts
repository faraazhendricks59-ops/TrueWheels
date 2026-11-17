"use client";

import { useEffect, useRef, useState } from "react";

/** False during SSR and the first client render, true once mounted. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Ref-counted: with two overlays open, closing one must not unlock the body.
let lockCount = 0;
let previousOverflow = "";

function lockScroll() {
  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  lockCount += 1;
}

function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) document.body.style.overflow = previousOverflow;
}

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lockScroll();
    return unlockScroll;
  }, [active]);
}

/**
 * Moves focus into the container on open, cycles Tab within it, and restores
 * focus to the previously active element on close.
 */
export function useFocusTrap(active: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusFirst = () => {
      const nodes = container.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (nodes.length) nodes[0].focus();
      else {
        container.setAttribute("tabindex", "-1");
        container.focus();
      }
    };

    // Defer so the node is laid out before we move focus.
    const raf = requestAnimationFrame(focusFirst);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null || n === document.activeElement
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first || !container.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !container.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [active, containerRef]);
}

// Overlay stacking: each overlay pushes a token while open. Escape must only
// dismiss the topmost one, otherwise a confirm dialog nested inside a form
// modal would close both at once.
const overlayStack: symbol[] = [];

export function useEscapeKey(active: boolean, onEscape: () => void) {
  const handler = useRef(onEscape);
  handler.current = onEscape;

  useEffect(() => {
    if (!active) return;
    const token = Symbol("overlay");
    overlayStack.push(token);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (overlayStack[overlayStack.length - 1] !== token) return;
      handler.current();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      const at = overlayStack.indexOf(token);
      if (at !== -1) overlayStack.splice(at, 1);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);
}

export function useClickOutside(active: boolean, ref: React.RefObject<HTMLElement | null>, onOutside: () => void) {
  const handler = useRef(onOutside);
  handler.current = onOutside;

  useEffect(() => {
    if (!active) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (el && !el.contains(event.target as Node)) handler.current();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [active, ref]);
}
