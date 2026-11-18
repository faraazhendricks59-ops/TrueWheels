"use client";

import { HelpCircle, Users } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { historyGaps } from "@/lib/vehicle-history";
import type { DemoVehicle } from "@/lib/demo/vehicles";

/**
 * Ownership. The brief showed two previous owners with dates, mileages and a
 * green panel claiming the vehicle was "cross-referenced with NAAMSA and major
 * rental databases" and "has not been used as a taxi, rental, or corporate
 * fleet vehicle". There is no such cross-reference here, and that green panel
 * is a specific factual claim about how the car was used, which is exactly what
 * a buyer avoiding ex-fleet cars relies on. It is reported as unknown instead.
 */
export function OwnershipTimeline({ vehicle }: { vehicle: DemoVehicle }) {
  const gap = historyGaps(vehicle).find((record) => record.id === "ownership");

  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <span className="w-10 h-10 rounded-xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-400 flex-shrink-0">
          <Icon icon={HelpCircle} size={18} />
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-display font-bold text-ink-900 dark:text-white">
            Ownership history unknown
          </h3>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1 leading-relaxed">
            {gap?.detail}
          </p>

          <ul className="mt-5 space-y-2">
            {[
              "How many owners the vehicle has had.",
              "Whether it was a rental, a company car or a taxi.",
              "Whether any finance is still owing on it.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-ink-600 dark:text-ink-300">
                <Icon icon={Users} size={12} className="mt-0.5 flex-shrink-0 text-ink-400" />
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-5 text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
            You can check the registered owner and any finance against the vehicle&apos;s registration
            certificate and the Natis record before you pay.
          </p>
        </div>
      </div>
    </div>
  );
}
