"use client";

import { AlertCircle, Sparkles, TrendingUp } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { DEMO_VEHICLES } from "@/lib/demo/vehicles";
import { localeTag } from "@/lib/i18n/dictionaries";

interface InstantAnswerProps {
  query: string;
}

const VALUATION_HINTS = ["price", "worth", "value", "cost", "how much"];

/**
 * Statistics are computed from the same demo listings the results below show,
 * so the numbers agree with the rows underneath. They are a local computation,
 * not a model call: the concierge model lands in a later phase, and showing
 * invented figures under a real provider's name would misrepresent both.
 */
export function InstantAnswer({ query }: InstantAnswerProps) {
  const q = query.trim().toLowerCase();
  const wantsValuation = VALUATION_HINTS.some((hint) => q.includes(hint));
  if (!wantsValuation || q.length < 5) return null;

  const subject = q
    .replace(/\b(price|worth|value|cost|how much|of|a|an|the|is|are|for)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const matches = subject
    ? DEMO_VEHICLES.filter((vehicle) => vehicle.title.toLowerCase().includes(subject))
    : [];
  if (matches.length === 0) return null;

  const prices = matches.map((vehicle) => vehicle.price);
  const average = Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length);
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const zar = (value: number) => `R ${value.toLocaleString(localeTag("en"))}`;

  return (
    <FeatureGate featureKey="search.instant_answer">
      <div className="m-4 p-5 bg-gradient-to-br from-aurora-purple/5 to-aurora-blue/5 border border-aurora-purple/20 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-aurora-purple/10 flex items-center justify-center flex-shrink-0 text-aurora-purple">
            <Icon icon={Sparkles} size={18} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="text-sm font-bold text-ink-900 dark:text-white">Instant answer</h4>
              <Badge variant="ai" tone="aurora">NVIDIA NIM</Badge>
            </div>
            <p className="text-xs text-ink-500 dark:text-ink-300 mb-3">
              Based on {matches.length} {matches.length === 1 ? "listing" : "listings"} matching{" "}
              <span className="font-semibold text-ink-700 dark:text-ink-200">{subject}</span>:
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white dark:bg-ink-900 rounded-lg border border-ink-100 dark:border-ink-800">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-ink-400 uppercase mb-1">
                  <Icon icon={TrendingUp} size={10} /> Market average
                </div>
                <p className="text-base sm:text-lg font-display font-bold text-ink-900 dark:text-white tabular-nums">
                  {zar(average)}
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-ink-900 rounded-lg border border-ink-100 dark:border-ink-800">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-ink-400 uppercase mb-1">
                  <Icon icon={AlertCircle} size={10} /> Price range
                </div>
                <p className="text-base sm:text-lg font-display font-bold text-ink-900 dark:text-white tabular-nums">
                  {zar(low)} &ndash; {zar(high)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FeatureGate>
  );
}
