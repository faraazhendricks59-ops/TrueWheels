"use client";

import { useId, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "./Icon";
import { useMounted, useScrollLock, useFocusTrap, useEscapeKey } from "./overlay-hooks";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const MAX_WIDTHS = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-xl" };

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "md",
  className,
}: ModalProps) {
  const mounted = useMounted();
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useScrollLock(isOpen);
  useEscapeKey(isOpen, onClose);
  useFocusTrap(isOpen, dialogRef);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm noise" onClick={onClose} aria-hidden="true" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={clsx(
          "relative w-full bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800",
          "rounded-3xl shadow-lift animate-scale-in overflow-hidden flex flex-col max-h-[90vh]",
          MAX_WIDTHS[maxWidth],
          className
        )}
      >
        <div className="flex items-start justify-between p-6 border-b border-ink-100 dark:border-ink-800">
          <div>
            <h3 id={titleId} className="text-lg font-display font-bold text-ink-900 dark:text-white">
              {title}
            </h3>
            {description && (
              <p id={descriptionId} className="text-sm text-ink-500 dark:text-ink-300 mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800 rounded-xl transition-colors"
          >
            <Icon icon={X} size={16} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">{children}</div>

        {footer && (
          <div className="p-6 border-t border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/50 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
