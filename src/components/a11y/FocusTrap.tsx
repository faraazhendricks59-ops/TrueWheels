"use client";

import { useRef, ReactNode } from "react";
import { useFocusTrap, useEscapeKey } from "@/components/ui/overlay-hooks";

interface FocusTrapProps {
  children: ReactNode;
  active: boolean;
  onEscape?: () => void;
  className?: string;
}

/**
 * Thin wrapper over the shared overlay hooks so there is exactly one focus-trap
 * implementation in the codebase (Modal and Sheet use the same hooks).
 *
 * The hooks are used rather than reimplemented because the naive version has
 * two defects: it moves focus synchronously before the node is laid out, and it
 * lists onEscape in its dependency array, so an inline arrow handler re-runs the
 * effect on every render — re-capturing the "previously focused" element and
 * losing the original trigger.
 */
export function FocusTrap({ children, active, onEscape, className }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(active, containerRef);
  useEscapeKey(active && !!onEscape, () => onEscape?.());

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
