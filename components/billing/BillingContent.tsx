"use client";

import { useState } from "react";
import { SubscriptionOverview } from "@/components/billing/SubscriptionOverview";
import { BillingHistory } from "@/components/billing/BillingHistory";
import { PlanSelector } from "@/components/billing/PlanSelector";
import { useTranslation } from "@/components/providers/LanguageProvider";

export function BillingContent() {
  const { t } = useTranslation();
  const [isPlanSelectorOpen, setIsPlanSelectorOpen] = useState(false);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-graphite">{t("billing.pageTitle")}</h1>
        <p className="mt-1 text-sm text-neutral-muted">{t("billing.pageSubtitle")}</p>
      </div>

      <div className="space-y-6">
        <SubscriptionOverview onUpgrade={() => setIsPlanSelectorOpen(true)} />
        <BillingHistory />
      </div>

      {isPlanSelectorOpen && <PlanSelector onClose={() => setIsPlanSelectorOpen(false)} />}
    </>
  );
}
