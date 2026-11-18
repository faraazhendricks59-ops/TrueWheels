"use client";

import { FileSearch, Info, ShieldQuestion } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { historyChecks, type HistoryReport } from "@/lib/history-report";

/**
 * The free summary. The brief filled this with a "Not Reported Stolen" badge
 * sourced to SAPS, a write-off status sourced to eNaTIS, an incident count from
 * an insurance database and an "NVIDIA NIM Verified" tag. None of those sources
 * are connected here. A stolen-vehicle all-clear is the single most dangerous
 * thing this page could show: a buyer relies on it, pays, and loses the vehicle
 * and the money if it is seized. Every check is therefore reported as not
 * obtained, with the body that actually holds the record named.
 */
export function HistoryReportSummary({ report }: { report: HistoryReport }) {
  const checks = historyChecks();

  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6">
      <div className="flex items-start gap-3 mb-5 pb-5 border-b border-ink-100 dark:border-ink-800">
        <span className="w-10 h-10 rounded-xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-400 flex-shrink-0">
          <Icon icon={FileSearch} size={18} />
        </span>
        <div>
          <h3 className="text-lg font-display font-bold text-ink-900 dark:text-white">
            No history report obtained
          </h3>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">
            Reference {report.reference}. None of the checks below have been run for this listing.
          </p>
        </div>
      </div>

      <ul className="divide-y divide-ink-100 dark:divide-ink-800">
        {checks.map((check) => (
          <li key={check.id} className="flex items-start gap-3 py-3">
            <span className="w-6 h-6 rounded-lg bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-400 flex-shrink-0 mt-0.5">
              <Icon icon={ShieldQuestion} size={12} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-ink-900 dark:text-white">{check.label}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">
                  Not obtained
                </span>
              </div>
              <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed">
                {check.purpose} Held by {check.holder}.
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="flex items-start gap-2 text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mt-4 pt-4 border-t border-ink-100 dark:border-ink-800">
        <Icon icon={Info} size={12} className="mt-0.5 flex-shrink-0" />
        A clean result on any of these means the record does not appear in that database. It is not a
        guarantee about the condition of the vehicle. Ask the seller for the Natis document and a
        roadworthy certificate, and check the vehicle in person before you pay.
      </p>
    </div>
  );
}
