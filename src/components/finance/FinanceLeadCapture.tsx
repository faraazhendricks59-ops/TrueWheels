"use client";

import { Info, ShieldQuestion } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { SmartButton } from "@/components/ui/SmartButton";
import { useToast } from "@/components/ui/Toast";

/**
 * The application flow. There is nowhere for an application to go: no lender
 * integration, no credit bureau connection and no server that stores the form.
 * So this collects nothing. The brief asked for a form taking income and
 * employment details, then claiming "Soft credit check performed. Score
 * unaffected" and that the lender would call within 24 hours. Asking a buyer to
 * hand over their income for an application that is never sent, under a promise
 * that a credit check was run, would be a serious breach of their trust and of
 * POPIA. The modal states the position instead.
 */
export function FinanceLeadCapture({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Finance applications are not open yet"
      description="TrueWheels cannot submit a finance application on your behalf."
      maxWidth="md"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3 w-full">
          <span className="text-xs text-ink-400">No details are collected</span>
          <SmartButton
            featureKey="finance.apply"
            onClick={() => {
              toast({
                variant: "info",
                title: "Nothing was submitted",
                description:
                  "There is no lender connection and no credit check, so no application was sent and no credit record was touched.",
              });
              onClose();
            }}
          >
            Close
          </SmartButton>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-semantic-warning/5 border border-semantic-warning/20">
          <span className="w-8 h-8 rounded-lg bg-semantic-warning/10 flex items-center justify-center text-semantic-warning flex-shrink-0">
            <Icon icon={Info} size={14} />
          </span>
          <p className="text-xs text-ink-600 dark:text-ink-300 leading-relaxed">
            There is no form here on purpose. Collecting your income and employment details for an
            application that cannot be sent would put your personal information at risk for no
            benefit, and no credit check would have been run.
          </p>
        </div>

        <div>
          <p className="text-sm font-bold text-ink-900 dark:text-white mb-2">
            To apply for vehicle finance
          </p>
          <ul className="space-y-2">
            {[
              "Approach a bank, a vehicle finance house, or a broker registered with the FSCA.",
              "Ask for a pre-agreement statement and quotation, which is yours to keep.",
              "Check the total cost of credit, the initiation fee and the monthly service fee.",
              "You are entitled to settle the agreement early, and to be told what that costs.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-ink-600 dark:text-ink-300 leading-relaxed">
                <Icon icon={ShieldQuestion} size={12} className="mt-0.5 flex-shrink-0 text-ink-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
          <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
            <span className="font-bold text-ink-700 dark:text-ink-200">About your information.</span>{" "}
            Any lender you approach will run a credit check and will tell you whether it is a
            recorded enquiry. Ask them before you apply if you are concerned about your score.
          </p>
        </div>
      </div>
    </Modal>
  );
}
