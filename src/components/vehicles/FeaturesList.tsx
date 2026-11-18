"use client";

import { Info } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

/**
 * The fitted features. The brief listed fourteen items as fact. No feature list
 * was supplied with these listings, so presenting one would be a guess about a
 * specific vehicle that a buyer would treat as confirmed. The section says what
 * to confirm instead.
 */
export function FeaturesList() {
  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6">
      <h3 className="text-lg font-display font-bold text-ink-900 dark:text-white">
        Features not listed
      </h3>
      <p className="text-sm text-ink-500 dark:text-ink-400 mt-1 leading-relaxed">
        The seller has not supplied a list of fitted features. Nothing is shown here, because a
        guessed list is worse than none.
      </p>

      <div className="mt-5 p-4 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
        <p className="flex items-start gap-2 text-xs text-ink-600 dark:text-ink-300 leading-relaxed">
          <Icon icon={Info} size={12} className="mt-0.5 flex-shrink-0" />
          Ask which of the features you need are actually fitted, and check them in person. On a
          used vehicle, optional extras are often the difference between two otherwise similar
          cars.
        </p>
      </div>
    </div>
  );
}
