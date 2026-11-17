"use client";

import { createContext, useContext, useState, useCallback, useRef, ReactNode, useEffect } from "react";
import { clsx } from "clsx";
import { X, CheckCircle2, AlertCircle, Info, ShieldCheck, type LucideIcon } from "lucide-react";
import { Icon } from "./Icon";
import { TrustBadge } from "./Badge";

type ToastVariant = "success" | "error" | "info" | "trust";

interface ToastRecord {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  source?: string;
  duration: number;
}

interface ToastContextType {
  toast: (toast: Omit<ToastRecord, "id" | "duration"> & { duration?: number }) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });
export const useToast = () => useContext(ToastContext);

const VARIANTS: Record<ToastVariant, { icon: LucideIcon; color: string; bg: string }> = {
  success: { icon: CheckCircle2, color: "text-semantic-success", bg: "bg-semantic-success/10" },
  error: { icon: AlertCircle, color: "text-semantic-error", bg: "bg-semantic-error/10" },
  info: { icon: Info, color: "text-aurora-blue", bg: "bg-aurora-blue/10" },
  trust: { icon: ShieldCheck, color: "text-semantic-success", bg: "bg-semantic-success/10" },
};

// Errors are assertive; everything else is polite so it waits its turn.
const POLITE: ToastVariant[] = ["success", "info", "trust"];

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((input: Omit<ToastRecord, "id" | "duration"> & { duration?: number }) => {
    counter += 1;
    const id = `toast-${counter}`;
    setToasts((prev) => [...prev, { ...input, id, duration: input.duration ?? 4000 }]);
  }, []);

  const polite = toasts.filter((t) => POLITE.includes(t.variant));
  const assertive = toasts.filter((t) => !POLITE.includes(t.variant));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Persistent live regions: they must exist before content arrives, or
          screen readers have nothing to announce into. */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none"
      >
        {polite.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
      <div
        aria-live="assertive"
        aria-atomic="false"
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none"
      >
        {assertive.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast: t, onClose }: { toast: ToastRecord; onClose: () => void }) {
  const { icon: IconComp, color, bg } = VARIANTS[t.variant];
  // Held in a ref so a new onClose identity on each parent render does not
  // restart the dismiss timer.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!t.duration || t.duration <= 0) return;
    const timer = setTimeout(() => onCloseRef.current(), t.duration);
    return () => clearTimeout(timer);
  }, [t.duration]);

  return (
    <div
      role="status"
      className="pointer-events-auto glass rounded-2xl p-4 shadow-lift animate-rise flex items-start gap-3 border-l-4 border-l-brand"
    >
      <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", bg)}>
        <Icon icon={IconComp} size={16} className={color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink-900 dark:text-white">{t.title}</p>
        {t.description && (
          <p className="text-xs text-ink-500 dark:text-ink-300 mt-0.5 leading-relaxed">{t.description}</p>
        )}
        {t.variant === "trust" && t.source && (
          <div className="mt-2">
            <TrustBadge label="Verified Action" source={t.source} tone="green" />
          </div>
        )}
      </div>
      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        className="p-1 text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800"
      >
        <X size={14} strokeWidth={1.75} />
      </button>
    </div>
  );
}
