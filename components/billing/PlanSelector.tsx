"use client";

import { Check, Crown, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FocusTrap } from "@/components/ui/FocusTrap";
import { useTranslation } from "@/components/providers/LanguageProvider";
import { CURRENT_PLAN_ID, PLANS, formatZar } from "@/lib/billing/demo-billing";

interface PlanSelectorProps {
  onClose: () => void;
}

export function PlanSelector({ onClose }: PlanSelectorProps) {
  const { t } = useTranslation();

  const currentPlan = PLANS.find((plan) => plan.id === CURRENT_PLAN_ID);
  const currentPrice = currentPlan?.price ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <FocusTrap
        active
        onEscape={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="plan-selector-title"
        className="animate-zoom-in relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-surface-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-silver bg-surface-white p-6">
          <div>
            <h3 id="plan-selector-title" className="text-xl font-bold text-brand-graphite">
              {t("billing.choosePlan")}
            </h3>
            <p className="mt-0.5 text-sm text-neutral-muted">{t("billing.choosePlanSubtitle")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("billing.closePlanSelector")}
            className="rounded-full p-2 transition-colors hover:bg-surface-grey"
          >
            <X size={20} className="text-neutral-muted" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
          {PLANS.map((plan) => {
            const isCurrent = plan.id === CURRENT_PLAN_ID;
            // Direction is derived from price vs the active plan, not a
            // hardcoded threshold, so adding a tier can't mislabel the CTA.
            const isUpgrade = plan.price > currentPrice;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-xl border p-5 transition-all ${
                  isCurrent
                    ? "border-brand-red bg-brand-red/5 shadow-card"
                    : "border-brand-silver bg-surface-white hover:shadow-card-hover"
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 rounded-full bg-brand-red px-3 py-1 text-[10px] font-bold text-white">
                      <Crown size={10} aria-hidden="true" />
                      {t("billing.currentBadge")}
                    </span>
                  </div>
                )}

                <h4 className="mb-1 text-lg font-bold text-brand-graphite">{t(plan.nameKey)}</h4>
                <p className="mb-4 text-2xl font-extrabold tabular-nums text-brand-graphite">
                  {plan.price === 0 ? t("billing.free") : formatZar(plan.price)}
                  {plan.price > 0 && (
                    <span className="text-sm font-medium text-neutral-subtle">{t("billing.perMonth")}</span>
                  )}
                </p>

                <ul className="mb-6 flex-1 space-y-2">
                  {plan.featureKeys.map((featureKey) => (
                    <li key={featureKey} className="flex items-start gap-2 text-sm text-neutral-muted">
                      <Check size={14} className="mt-0.5 flex-shrink-0 text-semantic-success" aria-hidden="true" />
                      {t(featureKey)}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isCurrent ? "outline" : "primary"}
                  disabled={isCurrent}
                  className="w-full"
                  aria-label={
                    isCurrent
                      ? t("billing.currentPlan")
                      : `${isUpgrade ? t("billing.upgrade") : t("billing.downgrade")} — ${t(plan.nameKey)}`
                  }
                >
                  {isCurrent ? t("billing.currentPlan") : isUpgrade ? t("billing.upgrade") : t("billing.downgrade")}
                </Button>
              </div>
            );
          })}
        </div>
      </FocusTrap>
    </div>
  );
}
