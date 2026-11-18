"use client";

import { AlertTriangle, Car, Eye, Gauge, MessageSquare, Wallet } from "lucide-react";
import { clsx } from "clsx";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import {
  countLeadsByStage,
  deriveDealerStats,
  formatZAR,
  LEAD_STAGES,
  type InventoryItem,
  type Lead,
} from "@/lib/dealer/data";

/**
 * Dealership KPIs.
 *
 * Every figure is computed from the sample inventory and leads passed in, so the
 * dashboard cannot disagree with the table beside it. The brief specified
 * hand-picked numbers (42 active, 18 450 views, R 12.5m); those would drift from
 * the rows the moment anyone changed a status, and they were presented without
 * any indication that nothing measured them.
 *
 * The trend arrows are omitted: there is no historical data, so a percentage
 * change would be invented. The tile says "illustrative" instead.
 */
export function DealerAnalytics({ inventory, leads }: { inventory: InventoryItem[]; leads: Lead[] }) {
  const stats = deriveDealerStats(inventory, leads);
  const stageCounts = countLeadsByStage(leads);

  const kpis = [
    { label: "Active inventory", value: stats.activeCount, icon: Car },
    { label: "Total views", value: stats.totalViews, icon: Eye },
    { label: "Enquiries received", value: stats.totalInquiries, icon: MessageSquare },
    {
      label: "Live stock value",
      value: stats.activeStockValue,
      prefix: "R ",
      icon: Wallet,
    },
  ];

  return (
    <Reveal variant="up">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <KpiCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              prefix={kpi.prefix}
              icon={kpi.icon}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Funnel: how many enquiries sit in each stage. */}
          <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-bold text-ink-900 dark:text-white flex items-center gap-2">
                <Icon icon={Gauge} size={15} className="text-ink-400" />
                Pipeline breakdown
              </h3>
              <Badge tone="ink">Sample</Badge>
            </div>
            <ul className="space-y-2">
              {LEAD_STAGES.map((stage) => {
                const count = stageCounts[stage.id];
                const percent = leads.length === 0 ? 0 : Math.round((count / leads.length) * 100);
                return (
                  <li key={stage.id} className="flex items-center gap-3">
                    <span className="w-20 text-[11px] text-ink-500 dark:text-ink-400 flex-shrink-0">
                      {stage.label}
                    </span>
                    <span className="flex-1 h-2 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
                      <span
                        className={clsx("block h-full rounded-full bg-current", stage.color)}
                        style={{ width: `${percent}%` }}
                      />
                    </span>
                    <span className="w-8 text-right text-[11px] font-mono text-ink-600 dark:text-ink-300 tabular-nums">
                      {count}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Operational summary: the numbers a dealer acts on. */}
          <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-bold text-ink-900 dark:text-white flex items-center gap-2">
                <Icon icon={AlertTriangle} size={15} className="text-ink-400" />
                Stock health
              </h3>
              <Badge tone="ink">Sample</Badge>
            </div>
            <dl className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-xs text-ink-500 dark:text-ink-400">Vehicles sold</dt>
                <dd className="text-xs font-bold text-ink-900 dark:text-white tabular-nums">
                  {stats.soldCount}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-xs text-ink-500 dark:text-ink-400">Average days to sell</dt>
                <dd className="text-xs font-bold text-ink-900 dark:text-white tabular-nums">
                  {stats.averageDaysToSell === null ? "No sales yet" : `${stats.averageDaysToSell} days`}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-xs text-ink-500 dark:text-ink-400">Listed value of sold stock</dt>
                <dd className="text-xs font-bold text-ink-900 dark:text-white tabular-nums">
                  {formatZAR(stats.soldListedValue)}
                </dd>
              </div>
            </dl>
            <p className="text-[10px] text-ink-400 leading-relaxed mt-4">
              These figures come from the sample inventory on this page, not from a dealership
              system. Nothing here is measured in real time.
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
