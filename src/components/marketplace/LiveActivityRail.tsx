"use client";

import Link from "next/link";
import { Car } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { DEMO_VEHICLES } from "@/lib/demo/vehicles";
import { ALL_MAKES } from "@/lib/vehicle-facets";

/**
 * What is actually in the catalogue.
 *
 * This panel used to be titled "Live activity" behind a pulsing green dot, and
 * listed "New bid on 2021 BMW M3 Competition · R 1 245 000 · 2 min ago",
 * "48 people viewing Hilux Legend · Sandton, GP · 5 min ago" and "Price drop on
 * 2019 Golf GTI · R 389 900 · 12 min ago". There is no auction engine, no viewer
 * telemetry and no price history in this project, so every one of those events was
 * invented, and each carried a timestamp, which is what makes a live feed
 * believable.
 *
 * A pulsing dot beside a made-up bid manufactures demand, and urgency is what
 * makes someone pay more than they intended. The panel now reports counts that can
 * be recomputed from the catalogue itself.
 */
export function LiveActivityRail() {
  const models = new Set(DEMO_VEHICLES.map((vehicle) => vehicle.title.split(" ").slice(1).join(" ")));

  const stats = [
    { label: "Listings in the catalogue", value: DEMO_VEHICLES.length.toLocaleString("en-ZA") },
    { label: "Makes represented", value: String(ALL_MAKES.length) },
    { label: "Models represented", value: String(models.size) },
  ];

  return (
    <aside className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5 shadow-lift">
      <h3 className="flex items-center gap-2 font-display font-bold text-ink-900 dark:text-white mb-1">
        <Icon icon={Car} size={16} className="text-ink-400" />
        In the catalogue
      </h3>
      <p className="text-[11px] text-ink-400 mb-4">
        Counts from the sample listings in this demo. No live bids, viewer counts or price changes are
        tracked.
      </p>
      <ul className="space-y-3">
        {stats.map((stat) => (
          <li key={stat.label} className="flex items-center justify-between gap-3">
            <span className="text-xs text-ink-500 dark:text-ink-400">{stat.label}</span>
            <span className="text-sm font-display font-bold text-ink-900 dark:text-white tabular-nums">
              {stat.value}
            </span>
          </li>
        ))}
      </ul>
      <Link
        href="/marketplace"
        className="inline-block mt-4 py-1.5 text-xs font-semibold text-brand hover:underline"
      >
        Browse the catalogue
      </Link>
    </aside>
  );
}
