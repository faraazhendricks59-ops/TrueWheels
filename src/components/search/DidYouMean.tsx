"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { FeatureGate } from "@/components/feature/FeatureGate";

export type SuggestionType = "typo" | "broaden";

interface DidYouMeanProps {
  originalQuery: string;
  suggestedQuery: string;
  onApplySuggestion: (query: string) => void;
  type?: SuggestionType;
  /** Number of results the suggestion would return, when known. */
  resultCount?: number;
}

const TYPE_CONFIG: Record<SuggestionType, { label: string; color: string }> = {
  typo: { label: "Did you mean", color: "text-aurora-blue" },
  broaden: { label: "Too few results? Try", color: "text-semantic-warning" },
};

export function DidYouMean({
  originalQuery,
  suggestedQuery,
  onApplySuggestion,
  type = "typo",
  resultCount,
}: DidYouMeanProps) {
  const config = TYPE_CONFIG[type];

  return (
    <FeatureGate featureKey="search.did_you_mean">
      <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl shadow-sm animate-rise">
        <Icon icon={Sparkles} size={14} className={config.color} />
        <p className="text-sm text-ink-600 dark:text-ink-300">
          {config.label}{" "}
          <button
            type="button"
            onClick={() => onApplySuggestion(suggestedQuery)}
            className="font-bold text-brand hover:underline inline-flex items-center gap-1 transition-colors"
          >
            {suggestedQuery}
            <Icon icon={ArrowRight} size={12} />
          </button>
          {typeof resultCount === "number" && (
            <span className="text-ink-400">
              {" "}
              ({resultCount.toLocaleString("en-ZA")} {resultCount === 1 ? "result" : "results"})
            </span>
          )}
        </p>
        {type === "typo" && (
          <span className="text-xs text-ink-400 ml-auto hidden sm:inline">
            No matches for &ldquo;{originalQuery}&rdquo;
          </span>
        )}
      </div>
    </FeatureGate>
  );
}
