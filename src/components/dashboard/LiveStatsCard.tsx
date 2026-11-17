"use client";

import { TrendingUp, Eye } from "lucide-react";
import { Magnetic } from "@/components/motion/Magnetic";
import { Parallax } from "@/components/motion/Parallax";
import { CountUp } from "@/components/motion/CountUp";
import { Badge, TrustBadge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";

export function LiveStatsCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
      {/* Card 1: Magnetic + Cursor Glow */}
      <Magnetic strength={0.15}>
        <div className="cursor-glow relative bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6 shadow-lift overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 text-ink-500">
              <Icon icon={Eye} />
              <span className="text-xs font-semibold uppercase tracking-wide">Total Views</span>
            </div>
            <div className="text-4xl font-display font-bold text-ink-900 dark:text-white tabular-nums">
              <CountUp end={84500} duration={2500} />
            </div>
            <div className="mt-2 flex items-center gap-1 text-semantic-success text-xs font-semibold">
              <TrendingUp size={12} strokeWidth={1.75} />
              +12.5% this week
            </div>
          </div>
        </div>
      </Magnetic>

      {/* Card 2: Parallax Background Element */}
      <div className="relative bg-ink-950 rounded-2xl p-6 shadow-lift overflow-hidden border border-ink-800">
        <Parallax
          speed={0.2}
          className="pointer-events-none absolute -top-10 -right-10 w-40 h-40"
        >
          <div className="w-40 h-40 aurora-bg rounded-full blur-3xl opacity-40" />
        </Parallax>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 text-ink-400">
            <Icon icon={TrendingUp} />
            <span className="text-xs font-semibold uppercase tracking-wide">Active Bids</span>
          </div>
          <div className="text-4xl font-display font-bold text-white tabular-nums">
            <CountUp end={312} duration={1500} />
          </div>
          <div className="mt-4">
            <Badge variant="live" tone="red" dot pulse>
              02:14:32
            </Badge>
          </div>
        </div>
      </div>

      {/* Card 3: Trust Badge Integration */}
      <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6 shadow-lift flex flex-col justify-between">
        <div>
          <div className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-4">
            Seller Status
          </div>
          <TrustBadge
            label="Verified Dealer"
            source="CIPC reg + FICA documents verified by TrueWheels admin."
            verifiedAt="12 Nov 2026"
          />
        </div>
        <div className="mt-6">
          <p className="text-sm text-ink-600 dark:text-ink-300">
            Deep-decoded verification ensures every transaction is secure and compliant.
          </p>
        </div>
      </div>
    </div>
  );
}
