"use client";

import { useState } from "react";
import { Info, Scale, ShieldQuestion } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { FinanceLeadCapture } from "./FinanceLeadCapture";

/**
 * Lenders. The brief listed WesBank, ABSA and Standard Bank with specific rates,
 * monthly repayments, "95% Match" approval odds and invented reasoning about the
 * buyer's employment and debt. None of those rates or odds exist: there is no
 * lender integration and no credit bureau connection. Publishing a rate beside a
 * named bank's name is a representation about that bank's pricing, and "95%
 * approval" is a prediction about a credit decision that nothing here can make.
 * So the section explains how vehicle finance is actually priced and how to
 * compare offers, which is the part a buyer can act on.
 */
export function LenderComparison() {
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6">
      <div className="flex items-start gap-3 mb-5 pb-5 border-b border-ink-100 dark:border-ink-800">
        <span className="w-10 h-10 rounded-xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-400 flex-shrink-0">
          <Icon icon={Scale} size={18} />
        </span>
        <div>
          <h3 className="text-lg font-display font-bold text-ink-900 dark:text-white">
            No lender rates available
          </h3>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">
            TrueWheels is not connected to any bank or credit bureau, so no lender, rate or approval
            likelihood can be shown for this listing.
          </p>
        </div>
      </div>

      <ul className="space-y-4">
        {[
          {
            title: "Rates are personal",
            detail:
              "The rate a bank offers depends on your credit record, income, deposit and the age of the vehicle. The same car is financed at different rates for different people on the same day.",
          },
          {
            title: "Compare the total, not the instalment",
            detail:
              "A longer term lowers the instalment and raises the total you pay. Ask each lender for the total cost of credit, the initiation fee and the monthly service fee in writing.",
          },
          {
            title: "A balloon is money you still owe",
            detail:
              "A balloon or residual lowers the instalment by leaving a lump sum owing at the end. If you cannot pay it, the vehicle is usually sold to settle it.",
          },
          {
            title: "Only the lender decides",
            detail:
              "Nobody other than the lender can tell you whether you qualify or what you will pay. Any figure shown before you apply is an estimate.",
          },
        ].map((item) => (
          <li key={item.title} className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-400 flex-shrink-0 mt-0.5">
              <Icon icon={ShieldQuestion} size={12} />
            </span>
            <div>
              <p className="text-sm font-bold text-ink-900 dark:text-white">{item.title}</p>
              <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="flex items-start gap-2 text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mt-5 pt-5 border-t border-ink-100 dark:border-ink-800">
        <Icon icon={Info} size={12} className="mt-0.5 flex-shrink-0" />
        Under the National Credit Act you are entitled to a pre-agreement statement and quotation
        before you sign, and you may settle a credit agreement early. Read both before you commit.
      </p>

      <div className="mt-5">
        <SmartButton
          featureKey="finance.apply"
          variant="secondary"
          onClick={() => setIsApplyOpen(true)}
        >
          How to apply for finance
        </SmartButton>
      </div>

      <FinanceLeadCapture isOpen={isApplyOpen} onClose={() => setIsApplyOpen(false)} />
    </div>
  );
}
