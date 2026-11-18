"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { CheckCircle2, Circle } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { SALE_STAGES, readChecklist, writeChecklist } from "@/lib/secure-pay";

/**
 * The stages of the sale, as a checklist the two parties tick themselves.
 *
 * The brief's version was an escrow milestone tracker: it drew a progress bar
 * driven by `currentStage`, and stamped each completed stage with a date and a
 * "verifiedBy" line — its own sample data read "Independent Inspector #INSP-442".
 * A progress bar that advances by itself, and a verification attributed to an
 * inspector, both assert that a system checked something. No system did, and no
 * inspector exists.
 *
 * So the same five steps are here as a plan the reader works through. A tick means
 * the reader made a note, nothing more, and the panel says so. The steps are the
 * ones a private South African vehicle sale actually goes through, which is the
 * useful part of the brief's idea once the escrow is taken out.
 *
 * Ticks are kept on the reader's own device, keyed by listing, so they persist
 * without a server. Nothing here moves money or changes any state but its own.
 */
export function EscrowStatusCard({ vehicleId }: { vehicleId: string }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const state = readChecklist();
    setChecked(new Set(state[vehicleId] ?? []));
    setIsHydrated(true);
  }, [vehicleId]);

  const toggle = (stageId: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(stageId)) next.delete(stageId);
      else next.add(stageId);
      const state = readChecklist();
      state[vehicleId] = Array.from(next);
      writeChecklist(state);
      return next;
    });
  };

  const done = checked.size;

  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-display font-bold text-ink-900 dark:text-white">
          Your sale checklist
        </h3>
        <Badge variant="status" tone="ink">
          {done} of {SALE_STAGES.length} noted
        </Badge>
      </div>
      <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mb-5">
        This is a plan the two of you work through, kept in this browser. Nothing
        advances on its own, nothing is verified by TrueWheels, and a tick only means
        you made a note — it is not a check performed on your behalf.
      </p>

      <ol className="space-y-2">
        {SALE_STAGES.map((stage) => {
          const isChecked = checked.has(stage.id);
          return (
            <li key={stage.id}>
              <button
                type="button"
                onClick={() => toggle(stage.id)}
                aria-pressed={isChecked}
                className={clsx(
                  "w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-colors min-h-[44px]",
                  isChecked
                    ? "border-semantic-success/30 bg-semantic-success/5"
                    : "border-ink-100 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 hover:border-brand/30"
                )}
              >
                <span
                  className={clsx(
                    "mt-0.5 flex-shrink-0",
                    isChecked ? "text-semantic-success" : "text-ink-300 dark:text-ink-600"
                  )}
                >
                  <Icon icon={isChecked ? CheckCircle2 : Circle} size={18} strokeWidth={2} />
                </span>
                <span className="min-w-0">
                  <span
                    className={clsx(
                      "block text-sm font-bold",
                      isChecked
                        ? "text-ink-900 dark:text-white"
                        : "text-ink-700 dark:text-ink-200"
                    )}
                  >
                    {stage.label}
                  </span>
                  <span className="block text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mt-0.5">
                    {stage.detail}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {isHydrated && done === SALE_STAGES.length && (
        <p className="mt-4 text-[11px] text-semantic-success font-semibold">
          You have worked through every step. Keep your written record and your proof
          of payment — they are what you rely on if something goes wrong.
        </p>
      )}
    </div>
  );
}
