"use client";

import { ReactNode } from "react";
import { clsx } from "clsx";
import { Lock } from "lucide-react";
import { useFeatureFlags, FeatureKey } from "@/lib/feature-flags";

interface SmartButtonProps {
  featureKey: FeatureKey;
  children: ReactNode;
  disabledReason?: string;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
  className?: string;
}

export function SmartButton({
  featureKey,
  children,
  disabledReason,
  variant = "primary",
  onClick,
  className,
}: SmartButtonProps) {
  const { isEnabled } = useFeatureFlags();
  const active = isEnabled(featureKey);

  const baseStyles =
    "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ease-swift disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-600 shadow-glow",
    secondary: "bg-ink-100 text-ink-900 hover:bg-ink-200",
    ghost: "bg-transparent text-ink-600 hover:bg-ink-50",
  };

  if (!active) {
    return (
      <button
        disabled
        className={clsx(baseStyles, "bg-ink-50 text-ink-300 border border-ink-100", className)}
        title={disabledReason || "Disabled by Admin"}
      >
        <Lock size={14} strokeWidth={1.75} />
        {children}
      </button>
    );
  }

  return (
    <button onClick={onClick} className={clsx(baseStyles, variants[variant], className)}>
      {children}
    </button>
  );
}
