"use client";

import { Car, MapPin, Tag, type LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { useMotion } from "@/components/motion/MotionProvider";
import { DEMO_VEHICLES } from "@/lib/demo/vehicles";
import { ALL_MAKES, ALL_PROVINCES } from "@/lib/vehicle-facets";
import { localeTag } from "@/lib/i18n/locale";

/**
 * The strip used to scroll six invented events: "Golf 8 GTI sold R649 000",
 * "M3 bid R1 450 000", "+38 new listings today", "+12 new auctions started".
 *
 * There is no sales ledger, no auction and no listing feed in this project, so
 * every one of those was fabricated, and the sales and bids were the worst of
 * them because a completed sale at a named price is the strongest evidence a
 * marketplace can show. The "new listings today" count implied a live inventory
 * that changes; the catalogue is a fixed sample.
 *
 * What remains are counts that can be recomputed from the sample set, stated as
 * sample facts rather than as activity.
 */
const TICKER_ITEMS: { icon: LucideIcon; text: string; color: string }[] = [
  {
    icon: Car,
    text: `${DEMO_VEHICLES.length.toLocaleString(localeTag("en"))} sample listings`,
    color: "text-aurora-blue",
  },
  { icon: Tag, text: `${ALL_MAKES.length} makes represented`, color: "text-semantic-success" },
  { icon: MapPin, text: `${ALL_PROVINCES.length} provinces represented`, color: "text-brand" },
];

export function LiveTicker() {
  const { isStatic } = useMotion();

  return (
    <FeatureGate featureKey="home.ticker">
      <div className="w-full bg-ink-950 border-y border-ink-800 py-3 overflow-hidden">
        {/* The strip is decorative: the same facts are available elsewhere, and
            a screen reader reading an infinite marquee three times over is pure
            noise. Reduced-motion and low-data users get a static row instead. */}
        <div
          className={isStatic ? "flex flex-wrap gap-x-8 gap-y-2 px-4" : "flex animate-marquee whitespace-nowrap"}
          aria-hidden="true"
        >
          {(isStatic ? TICKER_ITEMS : [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS]).map((item, index) => (
            <span key={index} className="flex items-center gap-2 mx-8 text-sm font-medium text-ink-300">
              <Icon icon={item.icon} size={14} className={item.color} />
              {item.text}
              {!isStatic && <span className="text-ink-600 mx-4">&bull;</span>}
            </span>
          ))}
        </div>
      </div>
    </FeatureGate>
  );
}
