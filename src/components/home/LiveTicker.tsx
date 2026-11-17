"use client";

import { Gavel, Plus, TrendingUp, type LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { useMotion } from "@/components/motion/MotionProvider";

const TICKER_ITEMS: { icon: LucideIcon; text: string; color: string }[] = [
  { icon: TrendingUp, text: "Golf 8 GTI sold R649 000", color: "text-semantic-success" },
  { icon: Gavel, text: "M3 bid R1 450 000", color: "text-brand" },
  { icon: Plus, text: "+38 new listings today", color: "text-aurora-blue" },
  { icon: TrendingUp, text: "Hilux 2.8 GD-6 sold R950 000", color: "text-semantic-success" },
  { icon: Gavel, text: "RS6 bid R3 400 000", color: "text-brand" },
  { icon: Plus, text: "+12 new auctions started", color: "text-aurora-blue" },
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
