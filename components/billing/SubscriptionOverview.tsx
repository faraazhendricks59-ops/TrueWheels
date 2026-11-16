"use client";

import { Calendar, CreditCard, Crown, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/components/providers/LanguageProvider";
import {
  PAYMENT_METHOD,
  PLAN_PRICE,
  RENEWS_ON,
  USAGE,
  formatLongDate,
  formatZar,
} from "@/lib/billing/demo-billing";

interface SubscriptionOverviewProps {
  onUpgrade: () => void;
}

export function SubscriptionOverview({ onUpgrade }: SubscriptionOverviewProps) {
  const { t, locale } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Current plan. Uses brand-ink, not brand-graphite: graphite is the body
          text token and flips to near-white in dark mode, which would render
          white-on-white here. */}
      <div className="relative overflow-hidden rounded-2xl bg-brand-ink p-6 text-white md:p-8">
        <div
          className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-brand-red/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-brand-red">
              <Crown size={26} aria-hidden="true" />
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <h2 className="text-xl font-bold">{t("billing.currentPlanName")}</h2>
                <Badge variant="live">{t("billing.active")}</Badge>
              </div>
              <p className="text-2xl font-extrabold tabular-nums">
                {formatZar(PLAN_PRICE)}
                <span className="text-sm font-medium text-gray-400">{t("billing.perMonth")}</span>
              </p>
              <p className="mt-1 text-xs text-gray-400">{t("billing.exVat")}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar size={14} aria-hidden="true" />
              {t("billing.renewsOn").replace("{date}", formatLongDate(RENEWS_ON, locale))}
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <CreditCard size={14} aria-hidden="true" />
              {PAYMENT_METHOD}
            </div>
          </div>

          <Button onClick={onUpgrade} className="bg-white text-brand-ink hover:bg-gray-100">
            <Zap size={16} aria-hidden="true" />
            {t("billing.upgrade")}
          </Button>
        </div>
      </div>

      {/* Usage against plan limits */}
      <div className="rounded-xl border border-brand-silver bg-surface-white p-6 shadow-card">
        <h3 className="mb-5 font-bold text-brand-graphite">{t("billing.yourUsage")}</h3>

        <div className="space-y-5">
          {USAGE.map((item) => {
            const pct = Math.min((item.used / item.limit) * 100, 100);
            const isHigh = pct >= 80;

            return (
              <div key={item.labelKey}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-neutral-muted">{t(item.labelKey)}</span>
                  <span className="font-bold tabular-nums text-brand-graphite">
                    {item.used} / {item.limit}
                  </span>
                </div>

                <div
                  className="h-2.5 overflow-hidden rounded-full bg-surface-grey"
                  role="progressbar"
                  aria-valuenow={item.used}
                  aria-valuemin={0}
                  aria-valuemax={item.limit}
                  aria-label={t(item.labelKey)}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isHigh ? "bg-semantic-warning" : "bg-brand-red"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {isHigh && (
                  <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                    {t("billing.approachingLimit")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
