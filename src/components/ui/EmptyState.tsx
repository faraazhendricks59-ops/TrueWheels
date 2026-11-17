"use client";

import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import { SmartButton } from "./SmartButton";
import { FeatureKey } from "@/lib/feature-flags";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionFeatureKey?: FeatureKey;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: IconComponent,
  title,
  description,
  actionLabel,
  actionFeatureKey,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-dashed border-ink-200 dark:border-ink-800 bg-ink-50/30 dark:bg-ink-950/30",
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center mb-6 text-ink-400">
        <IconComponent size={28} strokeWidth={1.75} />
      </div>
      <h3 className="text-lg font-display font-bold text-ink-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-ink-500 dark:text-ink-300 max-w-md mb-8 leading-relaxed">{description}</p>

      {actionLabel && actionFeatureKey && (
        <SmartButton featureKey={actionFeatureKey} onClick={onAction}>
          {actionLabel}
        </SmartButton>
      )}
    </div>
  );
}
