"use client";

import Link from "next/link";
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/components/providers/LanguageProvider";

interface ApplicationSuccessProps {
  businessName: string;
}

export function ApplicationSuccess({ businessName }: ApplicationSuccessProps) {
  const { t } = useTranslation();

  const steps = [
    { icon: Clock, titleKey: "dealer.nextReview", descKey: "dealer.nextReviewDesc" },
    { icon: ShieldCheck, titleKey: "dealer.nextBadge", descKey: "dealer.nextBadgeDesc" },
    { icon: CheckCircle2, titleKey: "dealer.nextLive", descKey: "dealer.nextLiveDesc" },
  ] as const;

  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-semantic-success/10">
        <CheckCircle2 size={40} className="text-semantic-success" aria-hidden="true" />
      </div>

      <h1 className="mb-2 text-2xl font-bold text-brand-graphite">{t("dealer.successTitle")}</h1>
      <p className="mb-8 text-sm text-neutral-muted">
        {t("dealer.successBody").replace("{business}", businessName)}
      </p>

      <div className="mb-8 space-y-4 rounded-xl border border-brand-silver bg-surface-white p-6 text-left">
        <h2 className="text-sm font-bold text-brand-graphite">{t("dealer.nextHeading")}</h2>
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.titleKey} className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-surface-grey">
                <Icon size={16} className="text-brand-red" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-graphite">{t(item.titleKey)}</p>
                <p className="text-xs text-neutral-muted">{t(item.descKey)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Button asChild className="w-full">
        <Link href="/">{t("dealer.backHome")}</Link>
      </Button>
    </div>
  );
}
