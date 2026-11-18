"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, MoveRight, Undo2 } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { LEAD_STAGES, SAMPLE_LEADS, countLeadsByStage, type Lead, type LeadStage } from "@/lib/dealer/data";

/**
 * Lead pipeline.
 *
 * Each card can move between stages with the controls on the card, and the
 * column counts follow. The controls replace the brief's "Call" and "Msg"
 * buttons: there is no telephony or messaging service in this build, so those
 * would have been buttons that do nothing. Moving a lead along the pipeline is
 * the action this screen can actually perform.
 *
 * There is no verification data for these people, so no card claims a buyer is
 * "FICA verified".
 */
export function LeadPipeline() {
  const [leads, setLeads] = useState<Lead[]>(SAMPLE_LEADS);
  const counts = useMemo(() => countLeadsByStage(leads), [leads]);

  const move = (id: string, direction: 1 | -1) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== id) return lead;
        const index = LEAD_STAGES.findIndex((stage) => stage.id === lead.stage);
        const next = LEAD_STAGES[index + direction];
        return next ? { ...lead, stage: next.id } : lead;
      })
    );
  };

  return (
    <Reveal variant="up" delay={100}>
      <section
        aria-labelledby="pipeline-heading"
        className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-card overflow-hidden"
      >
        <div className="p-5 border-b border-ink-100 dark:border-ink-800">
          <h2 id="pipeline-heading" className="text-lg font-display font-bold text-ink-900 dark:text-white">
            Lead pipeline
          </h2>
          <p className="text-xs text-ink-500 dark:text-ink-300 mt-0.5">
            {leads.length} sample enquiries. Use the arrows on a card to move it between stages.
          </p>
        </div>

        {/* Horizontally scrollable board: six columns do not fit a phone, and
            squeezing them makes the cards unreadable. */}
        <div className="overflow-x-auto">
          <div className="grid grid-flow-col auto-cols-[minmax(13rem,1fr)] gap-4 p-5 min-w-max lg:min-w-0 lg:grid-flow-row lg:grid-cols-3 xl:grid-cols-6">
            {LEAD_STAGES.map((stage) => {
              const stageLeads = leads.filter((lead) => lead.stage === stage.id);
              return (
                <div key={stage.id} className="flex flex-col">
                  <div className="flex items-center justify-between px-1 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={clsx("w-2 h-2 rounded-full bg-current", stage.color)} aria-hidden />
                      <span className="text-xs font-bold text-ink-900 dark:text-white">{stage.label}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-ink-500 dark:text-ink-400 bg-ink-100 dark:bg-ink-800 px-1.5 py-0.5 rounded tabular-nums">
                      {counts[stage.id]}
                    </span>
                  </div>

                  <ul className="space-y-2 min-h-[80px]">
                    {stageLeads.length === 0 ? (
                      <li className="text-[10px] text-ink-400 px-1 py-3 border border-dashed border-ink-100 dark:border-ink-800 rounded-xl text-center">
                        Nothing here
                      </li>
                    ) : (
                      stageLeads.map((lead) => {
                        const index = LEAD_STAGES.findIndex((s) => s.id === lead.stage);
                        const canBack = index > 0;
                        const canForward = index < LEAD_STAGES.length - 1;
                        return (
                          <li
                            key={lead.id}
                            className="p-3 bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800 rounded-xl hover:border-brand/30 transition-colors"
                          >
                            <p className="text-xs font-bold text-ink-900 dark:text-white truncate">
                              {lead.customerName}
                            </p>
                            <p className="text-[10px] text-ink-500 dark:text-ink-400 truncate mt-0.5">
                              {lead.vehicleInterest}
                            </p>
                            <div className="flex items-center justify-between mt-2 gap-2">
                              <span className="text-[9px] text-ink-400 truncate">{lead.source}</span>
                              <span className="text-[9px] text-ink-400 whitespace-nowrap">{lead.received}</span>
                            </div>

                            <div className="flex gap-1 mt-2">
                              <button
                                type="button"
                                disabled={!canBack}
                                aria-label={`Move ${lead.customerName} back a stage`}
                                onClick={() => move(lead.id, -1)}
                                className="flex items-center justify-center min-h-[32px] min-w-[32px] rounded-lg bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 text-ink-500 dark:text-ink-400 hover:text-brand disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              >
                                <Icon icon={ChevronLeft} size={12} />
                              </button>
                              <button
                                type="button"
                                disabled={!canForward}
                                aria-label={`Move ${lead.customerName} forward a stage`}
                                onClick={() => move(lead.id, 1)}
                                className="flex-1 flex items-center justify-center gap-1 min-h-[32px] rounded-lg bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 text-[10px] font-semibold text-ink-600 dark:text-ink-300 hover:text-brand disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              >
                                {lead.stage === "won" || lead.stage === "lost" ? (
                                  <>
                                    <Icon icon={Undo2} size={11} /> Reopen
                                  </>
                                ) : (
                                  <>
                                    Advance <Icon icon={MoveRight} size={11} />
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                disabled={!canForward}
                                aria-label={`Move ${lead.customerName} forward a stage`}
                                onClick={() => move(lead.id, 1)}
                                className="flex items-center justify-center min-h-[32px] min-w-[32px] rounded-lg bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 text-ink-500 dark:text-ink-400 hover:text-brand disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              >
                                <Icon icon={ChevronRight} size={12} />
                              </button>
                            </div>
                          </li>
                        );
                      })
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <footer className="px-5 py-3 border-t border-ink-100 dark:border-ink-800">
          <p className="text-[10px] text-ink-400 leading-relaxed">
            Sample enquiries. Stage changes are local to this page. No CRM, telephony or messaging
            service is connected, so there are no call or message actions here.
          </p>
        </footer>
      </section>
    </Reveal>
  );
}
