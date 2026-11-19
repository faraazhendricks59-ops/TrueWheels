"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { CountUp } from "@/components/motion/CountUp";

type Trend = "up" | "down" | "neutral";

const TREND_CONFIG: Record<Trend, { icon: LucideIcon; color: string; bg: string; label: string }> = {
  up: { icon: TrendingUp, color: "text-semantic-success-dark", bg: "bg-semantic-success/10", label: "increased" },
  down: { icon: TrendingDown, color: "text-semantic-error-dark", bg: "bg-semantic-error/10", label: "decreased" },
  neutral: { icon: Minus, color: "text-ink-400", bg: "bg-ink-100 dark:bg-ink-800", label: "unchanged" },
};

interface KpiCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: Trend;
  trendValue?: string;
  icon: LucideIcon;
}

/**
 * Deliberately not wrapped in Magnetic: that wrapper is `inline-block`, which
 * would collapse the card out of its grid row's equal height.
 */
export function KpiCard({ label, value, prefix, suffix, trend = "neutral", trendValue, icon }: KpiCardProps) {
  const { icon: TrendIcon, color, bg, label: trendLabel } = TREND_CONFIG[trend];

  return (
    <div className="cursor-glow h-full bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6 shadow-lift transition-colors ease-swift hover:border-ink-200 dark:hover:border-ink-700 flex flex-col justify-between">
      <div className="flex items-start justify-between mb-4">
        <span className="w-10 h-10 rounded-xl bg-ink-50 dark:bg-ink-800 flex items-center justify-center text-ink-600 dark:text-ink-300">
          <Icon icon={icon} size={18} />
        </span>
        {trendValue && (
          <span className={clsx("flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold", bg, color)}>
            <Icon icon={TrendIcon} size={10} />
            <span className="sr-only">{trendLabel} </span>
            {trendValue}
          </span>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-3xl font-display font-bold text-ink-900 dark:text-white tabular-nums">
          <CountUp end={value} duration={1500} prefix={prefix} suffix={suffix} />
        </p>
      </div>
    </div>
  );
}
