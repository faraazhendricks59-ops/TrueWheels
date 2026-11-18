"use client";

import { useState } from "react";
import { Info, ChevronDown } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { ACTIVITY_DISCLOSURE, ACTIVITY_CHECKS } from "@/lib/listing-activity";

/**
 * What is known about how this listing is performing: nothing.
 *
 * This replaces the brief's UrgencyIndicators, which showed "45 views today",
 * "12 added to Garage" and "Price dropped R 15 000 2d ago". Every one of those
 * numbers was invented, and the brief described them as "real, aggregated,
 * anonymized platform data". There is no analytics service, no server-side
 * counter and no price history in this project.
 *
 * Invented scarcity is not a harmless flourish: it is the reason a buyer stops
 * comparing and pays more than they intended. Section 5(2)(b) of the Consumer
 * Protection Act prohibits marketing that is misleading in any way, which
 * includes the manner in which a claim is conveyed.
 *
 * The brief's own heading asked for something "non-manipulative". A counter that
 * cannot be checked is the opposite, so the honest version says what is not
 * measured and suggests what the buyer can find out for themselves. It is
 * deliberately quiet and collapsed by default rather than styled as a badge, so
 * it does not draw the eye the way a false badge would.
 */
export function ActivityDisclosure({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`rounded-xl border border-ink-100 dark:border-ink-800 bg-ink-50/60 dark:bg-ink-950/60 ${className ?? ""}`}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="w-full min-h-[44px] flex items-center gap-2 px-3.5 py-2.5 text-left"
      >
        <Icon icon={Info} size={13} className="text-ink-400 flex-shrink-0" />
        <span className="flex-1 text-[11px] font-semibold text-ink-500 dark:text-ink-400">
          What TrueWheels does not measure about this listing
        </span>
        <Icon
          icon={ChevronDown}
          size={14}
          className={`text-ink-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-3.5 pb-3.5 pt-0.5 space-y-3">
          <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
            {ACTIVITY_DISCLOSURE}
          </p>
          <div>
            <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-1.5">
              What you can ask instead
            </p>
            <ul className="space-y-1.5">
              {ACTIVITY_CHECKS.map((check) => (
                <li
                  key={check}
                  className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-1 before:h-1 before:rounded-full before:bg-ink-300 dark:before:bg-ink-600"
                >
                  {check}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
