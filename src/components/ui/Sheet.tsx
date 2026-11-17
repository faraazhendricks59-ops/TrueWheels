"use client";

import { useId, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "./Icon";
import { useMounted, useScrollLock, useFocusTrap, useEscapeKey } from "./overlay-hooks";

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: "bottom" | "right";
  className?: string;
}

export function Sheet({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  side = "bottom",
  className,
}: SheetProps) {
  const mounted = useMounted();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useScrollLock(isOpen);
  useEscapeKey(isOpen, onClose);
  useFocusTrap(isOpen, panelRef);

  if (!mounted || !isOpen) return null;

  const isBottom = side === "bottom";

  return createPortal(
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm noise" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={clsx(
          "absolute bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 shadow-lift flex flex-col",
          isBottom
            ? "bottom-0 left-0 right-0 rounded-t-3xl max-h-[85vh] animate-slide-up"
            : "top-0 right-0 bottom-0 w-full max-w-md rounded-l-3xl animate-slide-left",
          className
        )}
      >
        <div className="relative flex items-center justify-between p-5 border-b border-ink-100 dark:border-ink-800 flex-shrink-0">
          {isBottom && (
            <div className="w-10 h-1 bg-ink-200 dark:bg-ink-700 rounded-full absolute top-3 left-1/2 -translate-x-1/2" />
          )}
          <div>
            <h3 id={titleId} className="text-lg font-display font-bold text-ink-900 dark:text-white">
              {title}
            </h3>
            {description && (
              <p id={descriptionId} className="text-sm text-ink-500 dark:text-ink-300 mt-0.5">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="p-2 text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800 rounded-xl transition-colors"
          >
            <Icon icon={X} size={16} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">{children}</div>

        {footer && (
          <div className="p-5 border-t border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/50 flex justify-end gap-3 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
