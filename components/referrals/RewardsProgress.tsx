"use client";

import { Award, Lock, Check, Crown } from "lucide-react";
import { useTranslation } from "@/components/providers/LanguageProvider";
import { REWARD_TIERS, nextTier } from "@/lib/referrals/referral-data";

interface RewardsProgressProps {
  referrals: number;
}

export function RewardsProgress({ referrals }: RewardsProgressProps) {
  const { t } = useTranslation();
  const maxMin = REWARD_TIERS[REWARD_TIERS.length - 1].min;
  const progress = Math.min((referrals / maxMin) * 100, 100);
  const upcoming = nextTier(referrals);

  return (
    <div className="rounded-xl border border-brand-silver bg-surface-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award size={20} className="text-brand-red" aria-hidden="true" />
          <h2 className="text-lg font-bold text-brand-graphite">{t("referral.rewardsTitle")}</h2>
        </div>
        <span className="text-sm font-bold text-brand-red">
          {t("referral.referralsCount").replace("{count}", String(referrals))}
        </span>
      </div>

      {/* Markers are positioned at each tier's true share of the final tier, so
          they line up with the bar instead of being evenly spaced. */}
      <div className="relative mb-8 h-3">
        <div className="absolute inset-0 overflow-hidden rounded-full bg-surface-grey">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-red to-amber-500 transition-all duration-700"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={Math.min(referrals, maxMin)}
            aria-valuemin={0}
            aria-valuemax={maxMin}
            aria-label={t("referral.rewardsTitle")}
          />
        </div>
        {REWARD_TIERS.map((tier) => {
          const reached = referrals >= tier.min;
          const left = (tier.min / maxMin) * 100;
          return (
            <div
              key={tier.name}
              className={`absolute top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 ${
                reached ? "border-brand-red bg-brand-red" : "border-brand-silver bg-surface-white"
              }`}
              style={{ left: `${left}%` }}
              title={`${tier.name}: ${tier.min}+`}
            >
              {reached && <Check size={10} className="text-white" aria-hidden="true" />}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {REWARD_TIERS.map((tier) => {
          const unlocked = referrals >= tier.min;
          const remaining = Math.max(tier.min - referrals, 0);
          return (
            <div
              key={tier.name}
              className={`rounded-xl border p-4 text-center transition-all ${
                unlocked
                  ? "border-brand-silver bg-surface-white shadow-sm"
                  : "border-brand-silver/50 bg-surface-grey/50 opacity-60"
              }`}
            >
              <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${tier.gradient}`}>
                {tier.name === "Platinum" ? (
                  <Crown size={18} className="text-white" aria-hidden="true" />
                ) : (
                  <Award size={18} className="text-white" aria-hidden="true" />
                )}
              </div>
              <p className="text-sm font-bold text-brand-graphite">{tier.name}</p>
              <p className="mb-1 text-[10px] text-neutral-muted">
                {t("referral.tierThreshold").replace("{count}", String(tier.min))}
              </p>
              <p className="text-xs font-semibold text-brand-graphite">{t(tier.rewardKey)}</p>
              <div className="mt-2">
                {unlocked ? (
                  <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-semantic-success">
                    <Check size={10} aria-hidden="true" /> {t("referral.unlocked")}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1 text-[10px] text-neutral-subtle">
                    <Lock size={10} aria-hidden="true" />
                    {t("referral.moreNeeded").replace("{count}", String(remaining))}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {upcoming && (
        <p className="mt-4 text-center text-xs text-neutral-muted">
          {t("referral.nextTierHint")
            .replace("{count}", String(upcoming.min - referrals))
            .replace("{tier}", upcoming.name)}
        </p>
      )}
    </div>
  );
}
