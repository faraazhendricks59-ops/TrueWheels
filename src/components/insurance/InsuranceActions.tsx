"use client";

import { useState } from "react";
import { ShieldCheck, FileText } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { SmartButton } from "@/components/ui/SmartButton";
import { InsuranceLeadModal } from "./InsuranceLeadModal";
import { INSURANCE_OBLIGATIONS } from "@/lib/insurance";

/**
 * The action panel that sits beside the estimator.
 *
 * There is no quote to request from this app, so the button opens an
 * explanation of how to get a real one rather than a form that goes nowhere.
 * The panel also states the obligations that apply to a financed car, because
 * that is the point at which insurance stops being optional and a buyer
 * discovers the requirement.
 */
export function InsuranceActions({ vehicleTitle }: { vehicleTitle: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6 shadow-lift">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
              <Icon icon={ShieldCheck} size={16} />
            </div>
            <h3 className="text-lg font-display font-bold text-ink-900 dark:text-white">
              Getting cover
            </h3>
          </div>
          <Badge variant="status" tone="ink">
            No quote here
          </Badge>
        </div>

        <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mb-4">
          TrueWheels does not sell insurance and cannot request a quote on your
          behalf. What it can do is explain what a quote involves and what the law
          requires, so nothing about the process is a surprise at the dealership.
        </p>

        <ul className="space-y-2 mb-5">
          {INSURANCE_OBLIGATIONS.map((line) => (
            <li
              key={line}
              className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-1 before:h-1 before:rounded-full before:bg-ink-300 dark:before:bg-ink-600"
            >
              {line}
            </li>
          ))}
        </ul>

        <SmartButton
          featureKey="insurance.get_quote"
          variant="secondary"
          size="md"
          leftIcon={FileText}
          onClick={() => setIsModalOpen(true)}
          className="w-full min-h-[44px]"
        >
          How to get a real quote
        </SmartButton>
      </div>

      <InsuranceLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicleTitle={vehicleTitle}
      />
    </>
  );
}
