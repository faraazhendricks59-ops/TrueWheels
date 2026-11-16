"use client";

import { useEffect, useState } from "react";
import { Gift, Users, UserCheck, Wallet, Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/components/providers/LanguageProvider";
import { copyToClipboard } from "@/lib/utils/clipboard";
import {
  CREDIT_PER_REFERRAL,
  DEMO_REFERRAL_SUMMARY,
  pendingCredits,
  referralLink,
} from "@/lib/referrals/referral-data";
import { ReferralShareSheet } from "./ReferralShareSheet";
import { RewardsProgress } from "./RewardsProgress";

export function ReferralDashboard() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [link, setLink] = useState(() => referralLink(DEMO_REFERRAL_SUMMARY.code));

  // Prefer the live origin so a shared link points at the host the user is on
  // (preview deployments, local dev) rather than always production.
  useEffect(() => {
    setLink(referralLink(DEMO_REFERRAL_SUMMARY.code, window.location.origin));
  }, []);

  const summary = DEMO_REFERRAL_SUMMARY;
  const pending = pendingCredits(summary);

  const stats = [
    { label: t("referral.invitesSent"), value: String(summary.invitesSent), icon: Users, color: "text-blue-600", bg: "bg-blue-500/10" },
    { label: t("referral.friendsJoined"), value: String(summary.friendsJoined), icon: UserCheck, color: "text-semantic-success", bg: "bg-emerald-500/10" },
    { label: t("referral.creditsEarned"), value: `R ${summary.creditsPaidOut.toLocaleString("en-ZA")}`, icon: Wallet, color: "text-brand-red", bg: "bg-brand-red/10" },
  ];

  const steps = [
    { step: "1", titleKey: "referral.step1Title", descKey: "referral.step1Desc" },
    { step: "2", titleKey: "referral.step2Title", descKey: "referral.step2Desc" },
    { step: "3", titleKey: "referral.step3Title", descKey: "referral.step3Desc" },
  ] as const;

  const handleCopy = async () => {
    const ok = await copyToClipboard(link);
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-brand-ink p-6 text-white md:p-8">
        <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-brand-red/20 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <Gift size={24} className="text-brand-red" aria-hidden="true" />
            <h1 className="text-2xl font-bold">{t("referral.heroTitle")}</h1>
          </div>
          <p className="mb-6 max-w-md text-sm leading-relaxed text-gray-300">
            {t("referral.heroBody").replace("{amount}", `R ${CREDIT_PER_REFERRAL}`)}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3">
              <span className="flex-1 truncate font-mono text-sm text-gray-200">{link}</span>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 text-gray-300 transition-colors hover:text-white"
                title={t("referral.copyLink")}
                aria-label={t("referral.copyLink")}
              >
                {copied ? <Check size={18} className="text-semantic-success" /> : <Copy size={18} />}
              </button>
            </div>
            <Button onClick={() => setIsShareOpen(true)} className="h-12">
              <Sparkles size={16} className="mr-2" aria-hidden="true" /> {t("referral.inviteFriends")}
            </Button>
          </div>

          {copied && (
            <p className="mt-2 text-xs text-semantic-success" role="status">
              {t("referral.linkCopied")}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center gap-4 rounded-xl border border-brand-silver bg-surface-white p-5 shadow-sm">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg}`}>
                <Icon size={22} className={stat.color} aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-extrabold tabular-nums text-brand-graphite">{stat.value}</p>
                <p className="text-xs text-neutral-muted">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {pending > 0 && (
        <p className="rounded-xl border border-brand-silver bg-surface-white p-4 text-sm text-neutral-muted shadow-sm">
          {t("referral.pendingCredits").replace("{amount}", `R ${pending.toLocaleString("en-ZA")}`)}
        </p>
      )}

      <RewardsProgress referrals={summary.friendsJoined} />

      <div className="rounded-xl border border-brand-silver bg-surface-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-brand-graphite">{t("referral.howItWorks")}</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-red/10 font-bold text-brand-red">
                {item.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-graphite">{t(item.titleKey)}</p>
                <p className="mt-0.5 text-xs text-neutral-muted">{t(item.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isShareOpen && <ReferralShareSheet link={link} onClose={() => setIsShareOpen(false)} />}
    </div>
  );
}
