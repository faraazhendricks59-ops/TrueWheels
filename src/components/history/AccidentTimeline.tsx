"use client";

import { Info, ShieldQuestion } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

/**
 * Accident history. The brief listed two collisions with dates, descriptions,
 * repair costs and insurer claim numbers. There is no insurer integration and no
 * claim data here, so the section reports the absence. Inventing a collision
 * that did not happen is as damaging as hiding one that did.
 */
export function AccidentTimeline() {
  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <span className="w-10 h-10 rounded-xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-400 flex-shrink-0">
          <Icon icon={ShieldQuestion} size={18} />
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-display font-bold text-ink-900 dark:text-white">
            No accident history obtained
          </h3>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1 leading-relaxed">
            No collision or insurance claim records have been obtained for this vehicle, so none are
            shown. An empty list here does not mean the vehicle has never been damaged.
          </p>

          <div className="mt-5 p-4 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
            <p className="flex items-start gap-2 text-xs text-ink-600 dark:text-ink-300 leading-relaxed">
              <Icon icon={Info} size={12} className="mt-0.5 flex-shrink-0" />
              Look for uneven paint, panel gaps that differ from side to side, and overspray on
              rubber seals. These are the signs a repair leaves behind, and they are visible without
              any report. An inspection by a panel beater you choose is more reliable than any
              database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
