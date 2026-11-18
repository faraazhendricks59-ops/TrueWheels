"use client";

import { ListChecks, TriangleAlert } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { historyGaps, dueDiligence } from "@/lib/vehicle-history";
import type { DemoVehicle } from "@/lib/demo/vehicles";

/**
 * The service history section. The brief filled this with four dated records
 * and badges reading "VW SA National Database API Match" and "Physical Booklet
 * OCR Scan (Page 4)". None of that is available: there is no service database
 * integration, no scanned booklet and no records. Fabricating a maintenance
 * history is the single most costly thing this page could do, because a buyer
 * pays more for a car on the strength of it. So the section reports the absence
 * and says what to ask for instead.
 */
export function ServiceLog({ vehicle }: { vehicle: DemoVehicle }) {
  const gaps = historyGaps(vehicle).filter((gap) => gap.id === "service" || gap.id === "mileage");

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6">
        <div className="flex items-start gap-4 pb-5 mb-5 border-b border-ink-100 dark:border-ink-800">
          <span className="w-10 h-10 rounded-xl bg-semantic-warning/10 flex items-center justify-center text-semantic-warning flex-shrink-0">
            <Icon icon={TriangleAlert} size={18} />
          </span>
          <div>
            <h3 className="text-lg font-display font-bold text-ink-900 dark:text-white">
              Service history unavailable
            </h3>
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
              No records have been supplied, so none are shown. We will not list maintenance that
              we cannot show you.
            </p>
          </div>
        </div>

        <ul className="space-y-4">
          {gaps.map((gap) => (
            <li key={gap.id} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-400 flex-shrink-0 mt-0.5">
                <Icon icon={ListChecks} size={12} />
              </span>
              <div>
                <p className="text-sm font-bold text-ink-900 dark:text-white">{gap.title}</p>
                <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed">{gap.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-ink-900 dark:text-white mb-3">
          Ask the seller for these before you pay
        </h3>
        <ul className="space-y-2">
          {dueDiligence().map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs text-ink-600 dark:text-ink-300 leading-relaxed">
              <span className="text-brand mt-0.5">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
