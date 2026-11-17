"use client";

import { Car, Eye, Gavel, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { KpiCard } from "./KpiCard";
import { ActivityFeed } from "./ActivityFeed";
import { QuickActions } from "./QuickActions";
import { Reveal } from "@/components/motion/Reveal";

export type KpiIconKey = "views" | "listings" | "bids" | "messages";

const KPI_ICONS: Record<KpiIconKey, LucideIcon> = {
  views: Eye,
  listings: Car,
  bids: Gavel,
  messages: MessageSquare,
};

interface Kpi {
  label: string;
  value: number;
  /**
   * A string key, not the component itself: the page rendering this is a
   * server component, and a component reference is a function, which cannot be
   * passed across the server/client boundary.
   */
  icon: KpiIconKey;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  prefix?: string;
  suffix?: string;
}

interface DashboardOverviewProps {
  greeting: string;
  subtitle: string;
  kpis: Kpi[];
}

export function DashboardOverview({ greeting, subtitle, kpis }: DashboardOverviewProps) {
  return (
    <div className="space-y-8">
      <Reveal variant="up" delay={0}>
        <div>
          <h1 className="text-3xl font-display font-bold text-ink-900 dark:text-white">{greeting}</h1>
          <p className="text-ink-500 dark:text-ink-300 mt-1">{subtitle}</p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Reveal key={kpi.label} variant="up" delay={100 + i * 100}>
            <KpiCard
              label={kpi.label}
              value={kpi.value}
              icon={KPI_ICONS[kpi.icon]}
              trend={kpi.trend}
              trendValue={kpi.trendValue}
              prefix={kpi.prefix}
              suffix={kpi.suffix}
            />
          </Reveal>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Reveal variant="up" delay={500} className="lg:col-span-2">
          <ActivityFeed />
        </Reveal>
        <Reveal variant="up" delay={600}>
          <QuickActions />
        </Reveal>
      </div>
    </div>
  );
}
