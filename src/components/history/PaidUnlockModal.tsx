"use client";

import { CreditCard, FileText, Info, Lock, ShieldQuestion, Wrench } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { SmartButton } from "@/components/ui/SmartButton";
import { useToast } from "@/components/ui/Toast";

/**
 * The unlock flow. There is no payment provider in this project and no report
 * service behind the button, so the modal takes no money and the button says so
 * plainly. Showing "Payment verified" and "emailed to you" without a provider
 * would be taking a customer's money for nothing, which is the one thing this
 * page must never do.
 */
export function PaidUnlockModal({
  isOpen,
  onClose,
  vehicleTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  vehicleTitle: string;
}) {
  const { toast } = useToast();

  const included = [
    { icon: FileText, label: "Full report", detail: "The checks above, in one document." },
    { icon: Lock, label: "Finance check", detail: "Whether money is still owed." },
    { icon: ShieldQuestion, label: "Stolen and write-off", detail: "The SAPS and eNaTIS records." },
    { icon: Wrench, label: "Service and mileage", detail: "Readings over time, checked." },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="History reports are not available yet"
      description={`A full history report for the ${vehicleTitle} cannot be bought here.`}
      maxWidth="md"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3 w-full">
          <span className="text-xs text-ink-400">No payment is taken</span>
          <SmartButton
            featureKey="history.unlock_report"
            leftIcon={CreditCard}
            onClick={() =>
              toast({
                variant: "info",
                title: "No payment was taken",
                description:
                  "There is no payment provider and no report service connected, so nothing was charged and nothing will arrive.",
              })
            }
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
            TrueWheels does not hold a history report service yet. There is no way to buy one here,
            and no price is charged. The list below is what a report would contain when it is built.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {included.map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-xl border border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/50"
            >
              <Icon icon={item.icon} size={16} className="text-ink-400 mb-2" />
              <p className="text-sm font-bold text-ink-900 dark:text-white">{item.label}</p>
              <p className="text-[10px] text-ink-500 dark:text-ink-400">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
          <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
            <span className="font-bold text-ink-700 dark:text-ink-200">Before you pay anyone</span> for
            a history report elsewhere, check what the report actually covers and who is providing
            it. In South Africa, the registered owner and any outstanding finance are on the Natis
            record, and a roadworthy certificate is issued by a testing station.
          </p>
        </div>
      </div>
    </Modal>
  );
}
