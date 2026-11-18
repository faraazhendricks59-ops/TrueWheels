"use client";

import { Info } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { specGroupsFor } from "@/lib/vehicle-history";
import type { DemoVehicle } from "@/lib/demo/vehicles";

export function SpecTable({ vehicle }: { vehicle: DemoVehicle }) {
  const groups = specGroupsFor(vehicle);

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div
          key={group.title}
          className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl overflow-hidden"
        >
          <div className="px-5 py-3 bg-ink-50 dark:bg-ink-950 border-b border-ink-100 dark:border-ink-800">
            <h3 className="text-xs font-bold text-ink-400 uppercase tracking-wider">{group.title}</h3>
          </div>
          <dl className="divide-y divide-ink-100 dark:divide-ink-800">
            {group.rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-4 px-5 py-3.5"
              >
                <dt className="text-sm text-ink-600 dark:text-ink-300">{row.label}</dt>
                <dd className="flex items-center gap-2 text-sm font-bold text-ink-900 dark:text-white tabular-nums">
                  {row.value}
                  {row.estimated && (
                    <span className="text-[10px] font-medium text-ink-400">est.</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}

      <p className="flex items-start gap-2 text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
        <Icon icon={Info} size={12} className="mt-0.5 flex-shrink-0" />
        The year, odometer reading and location are from the listing. Everything marked est. is
        typical for this model and year, not a measurement of this vehicle.
      </p>
    </div>
  );
}
