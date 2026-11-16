"use client";

import { HTMLAttributes, useEffect, useRef, ReactNode } from "react";

interface FocusTrapProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode;
  /** When false the trap is inert and does not touch focus at all. */
  active?: boolean;
  onEscape?: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Contains keyboard focus within its subtree while `active`, then returns focus
 * to whatever was focused before it activated (the trigger). Accepts the usual
 * div props, so it can be used as the dialog/panel element itself.
 */
export function FocusTrap({ children, active = true, onEscape, ...rest }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  // Keep the latest handler in a ref so a new `onEscape` identity does not
  // re-run the effect below and yank focus back to the first element mid-typing.
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

  useEffect(() => {
    if (!active) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    if (!container) return;

    const getFocusable = () => Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));

    const initial = getFocusable();
    if (initial.length > 0) {
      initial[0].focus();
    } else {
      // Nothing focusable inside: focus the container itself so that keyboard
      // users are not left behind in the page underneath the modal.
      container.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscapeRef.current?.();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      // Cycle at the boundaries, and also pull focus back in if it has escaped
      // the container entirely (e.g. via a browser shortcut or a click outside).
      if (!container.contains(current)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      previouslyFocused.current?.focus?.();
    };
  }, [active]);

  return (
    <div ref={containerRef} tabIndex={-1} {...rest}>
      {children}
    </div>
  );
}
