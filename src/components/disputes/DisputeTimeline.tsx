"use client";

import { Scale, Info } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { DISPUTE_DISCLOSURE, DISPUTE_STEPS } from "@/lib/disputes-data";
import type { DemoVehicle } from "@/lib/demo/vehicles";

/**
 * The real process, with no clock on it.
 *
 * The brief's timeline ran an SLA countdown that escalated to a red "OVERDUE", and
 * drew a stage track driven by the case's own status. Both asserted that TrueWheels
 * is running a case with a deadline it will meet. It is not running anything, and a
 * deadline the platform invented would push a wronged buyer to wait for a resolution
 * that will never come — while the real deadlines that matter, like the time limits
 * at a forum, run down unnoticed.
 *
 * So there is no countdown. What replaces it is the order of the steps that actually
 * resolve a vehicle dispute, which the reader works through at their own pace and
 * which they can act on without TrueWheels.
 */
export function DisputeTimeline({ vehicle }: { vehicle: DemoVehicle }) {
  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="status" tone="amber">No case is open</Badge>
          </div>
          <h2 className="text-lg font-display font-bold text-ink-900 dark:text-white">
            {vehicle.title}
          </h2>
          <p className="text-xs font-mono text-ink-500 mt-0.5">
            Asking price {`R ${vehicle.price.toLocaleString("en-ZA")}`}
          </p>
        </div>
        <div className="px-4 py-3 rounded-xl border border-ink-100 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 flex-shrink-0 max-w-xs">
          <p className="text-[9px] font-bold uppercase tracking-widest text-ink-400 mb-1 flex items-center gap-1">
            <Icon icon={Info} size={10} />
            Not a case
          </p>
          <p className="text-[10px] text-ink-500 dark:text-ink-400 leading-relaxed">
            TrueWheels is not holding money for this vehicle and has no case open. No
            clock is running, because there is no deadline TrueWheels can meet.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-semantic-warning/5 border border-semantic-warning/20 mb-6">
        <p className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed">
          {DISPUTE_DISCLOSURE}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Icon icon={Scale} size={15} className="text-ink-400" />
        <h3 className="text-sm font-bold text-ink-900 dark:text-white">
          How a vehicle dispute is actually resolved
        </h3>
      </div>

      <ol className="space-y-4">
        {DISPUTE_STEPS.map((step, index) => (
          <li key={step.title} className="flex items-start gap-3">
            <span className="mt-0.5 w-6 h-6 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-500 dark:text-ink-300 text-[11px] font-bold flex items-center justify-center flex-shrink-0">
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-bold text-ink-900 dark:text-white">{step.title}</p>
              <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mt-0.5">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
