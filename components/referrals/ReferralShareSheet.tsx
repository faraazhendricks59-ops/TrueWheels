"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, MessageCircle, Smartphone, Mail, Link2, Check } from "lucide-react";
import { useTranslation } from "@/components/providers/LanguageProvider";
import { FocusTrap } from "@/components/ui/FocusTrap";
import { useAnnounce } from "@/components/ui/AriaLiveAnnouncer";
import { copyToClipboard } from "@/lib/utils/clipboard";

interface ReferralShareSheetProps {
  link: string;
  onClose: () => void;
}

export function ReferralShareSheet({ link, onClose }: ReferralShareSheetProps) {
  const { t } = useTranslation();
  const { announce } = useAnnounce();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const message = t("referral.shareMessage").replace("{link}", link);

  const channels = [
    {
      id: "whatsapp",
      label: t("referral.whatsapp"),
      icon: MessageCircle,
      color: "bg-emerald-500",
      href: `https://wa.me/?text=${encodeURIComponent(message)}`,
    },
    {
      id: "sms",
      label: t("referral.sms"),
      icon: Smartphone,
      color: "bg-blue-500",
      href: `sms:?body=${encodeURIComponent(message)}`,
    },
    {
      id: "email",
      label: t("referral.email"),
      icon: Mail,
      color: "bg-gray-600",
      href: `mailto:?subject=${encodeURIComponent(t("referral.emailSubject"))}&body=${encodeURIComponent(message)}`,
    },
  ];

  // Body scroll lock only — focus containment, Escape and focus restore are
  // handled by FocusTrap.
  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  const handleCopy = async () => {
    const ok = await copyToClipboard(link);
    if (!ok) return;
    setCopied(true);
    announce(t("a11y.linkCopied"));
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="presentation">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <FocusTrap
        active
        onEscape={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={t("referral.shareTitle")}
        className="animate-sheet-in relative w-full overflow-hidden rounded-t-2xl bg-surface-white shadow-2xl sm:max-w-md sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-brand-silver p-5">
          <h3 className="font-bold text-brand-graphite">{t("referral.shareTitle")}</h3>
          <button
            onClick={onClose}
            aria-label={t("referral.close")}
            className="rounded-full p-1.5 transition-colors hover:bg-surface-grey"
          >
            <X size={18} className="text-neutral-muted" />
          </button>
        </div>

        <div className="space-y-2 p-5">
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <a
                key={channel.id}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-brand-silver p-3 transition-colors hover:bg-surface-grey"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-white ${channel.color}`}>
                  <Icon size={20} aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold text-brand-graphite">{t("referral.shareOn")} {channel.label}</span>
              </a>
            );
          })}

          <button
            onClick={handleCopy}
            className="flex w-full items-center gap-4 rounded-xl border border-brand-silver p-3 transition-colors hover:bg-surface-grey"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-grey text-neutral-muted">
              <Link2 size={20} aria-hidden="true" />
            </div>
            <span className="text-sm font-semibold text-brand-graphite">
              {copied ? t("referral.linkCopied") : t("referral.copyLink")}
            </span>
            {copied && <Check size={16} className="ml-auto text-semantic-success" aria-hidden="true" />}
          </button>
        </div>

        <div className="p-5 pt-0">
          <div className="rounded-lg border border-brand-silver bg-surface-grey p-3">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-neutral-subtle">
              {t("referral.messagePreview")}
            </p>
            <p className="text-xs leading-relaxed text-neutral-muted">{message}</p>
          </div>
        </div>
      </FocusTrap>
    </div>,
    document.body,
  );
}
