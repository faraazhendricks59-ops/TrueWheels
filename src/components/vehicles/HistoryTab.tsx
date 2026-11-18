"use client";

import { useState } from "react";
import { FileSearch } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { HistoryReportSummary } from "@/components/history/HistoryReportSummary";
import { AccidentTimeline } from "@/components/history/AccidentTimeline";
import { MileageGraph } from "@/components/history/MileageGraph";
import { PaidUnlockModal } from "@/components/history/PaidUnlockModal";
import { historyReportFor } from "@/lib/history-report";
import type { DemoVehicle } from "@/lib/demo/vehicles";

/**
 * The history tab. There is no blur-and-unlock here: the brief's design blurs
 * real content behind a payment, but there is no content to blur and no payment
 * to take, so blurring would only obscure the honest statements underneath.
 */
export function HistoryTab({ vehicle }: { vehicle: DemoVehicle }) {
  const [isUnlockOpen, setIsUnlockOpen] = useState(false);
  const report = historyReportFor(vehicle);

  return (
    <div className="space-y-6">
      <HistoryReportSummary report={report} />
      <AccidentTimeline />
      <MileageGraph report={report} />

      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-ink-100 dark:border-ink-800 bg-ink-50 dark:bg-ink-950">
        <div className="flex items-start gap-3">
          <span className="w-8 h-8 rounded-lg bg-ink-200 dark:bg-ink-800 flex items-center justify-center text-ink-500 flex-shrink-0">
            <Icon icon={FileSearch} size={14} />
          </span>
          <div>
            <p className="text-sm font-bold text-ink-900 dark:text-white">
              A full report is not available yet
            </p>
            <p className="text-xs text-ink-500 dark:text-ink-400">
              No report service is connected, so nothing can be bought here.
            </p>
          </div>
        </div>
        <SmartButton featureKey="history.unlock_report" variant="secondary" onClick={() => setIsUnlockOpen(true)}>
          What a report would include
        </SmartButton>
      </div>

      <PaidUnlockModal
        isOpen={isUnlockOpen}
        onClose={() => setIsUnlockOpen(false)}
        vehicleTitle={vehicle.title}
      />
    </div>
  );
}
