"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Gauge, MapPin, Sparkles, TrendingDown } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { FeatureGate } from "@/components/feature/FeatureGate";
import type { RelevanceReason } from "@/lib/search-relevance";

interface RelevanceBadgeProps {
  reasons: RelevanceReason[];
}

const REASON_ICON = {
  match: Check,
  price: TrendingDown,
  mileage: Gauge,
  location: MapPin,
  year: Sparkles,
} as const;

const WEIGHT_COLOR = {
  high: "text-semantic-success",
  medium: "text-aurora-blue",
  low: "text-ink-400",
} as const;

export function RelevanceBadge({ reasons }: RelevanceBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  if (reasons.length === 0) return null;

  return (
    <FeatureGate featureKey="search.ai_ranking_explanation">
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-aurora-purple/5 border border-aurora-purple/20 text-aurora-purple text-[10px] font-bold uppercase tracking-wide hover:bg-aurora-purple/10 transition-colors"
        >
          <Icon icon={Sparkles} size={10} />
          Top match
        </button>

        {isOpen && (
          <div
            role="dialog"
            aria-label="Why this result is ranked first"
            className="absolute top-full left-0 mt-2 w-72 max-w-[80vw] bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl shadow-lift p-4 z-50 animate-scale-in"
          >
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-ink-100 dark:border-ink-800">
              <Icon icon={Sparkles} size={14} className="text-aurora-purple" />
              <h4 className="text-xs font-bold text-ink-900 dark:text-white uppercase tracking-wide">
                Why this is first
              </h4>
            </div>

            <ul className="space-y-2.5">
              {reasons.map((reason) => {
                const ReasonIcon = REASON_ICON[reason.kind];
                return (
                  <li key={reason.id} className="flex items-start gap-2.5">
                    <span
                      className={clsx(
                        "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-ink-50 dark:bg-ink-800",
                        WEIGHT_COLOR[reason.weight]
                      )}
                    >
                      <Icon icon={ReasonIcon} size={10} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-xs font-medium text-ink-700 dark:text-ink-200 leading-tight">
                        {reason.label}
                      </span>
                      <span className="block text-[10px] text-ink-400 mt-0.5 capitalize">
                        {reason.weight} relevance signal
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>

            <p className="text-[10px] text-ink-400 mt-3 pt-3 border-t border-ink-100 dark:border-ink-800 leading-relaxed">
              Computed from this result set: how many of your terms the listing matches, and how its
              price, mileage and age compare with the others shown.
            </p>
          </div>
        )}
      </div>
    </FeatureGate>
  );
}
