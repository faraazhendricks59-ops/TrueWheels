"use client";

import { Download, FileText } from "lucide-react";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { useTranslation } from "@/components/providers/LanguageProvider";
import { INVOICES, formatLongDate, formatZarWithVat } from "@/lib/billing/demo-billing";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  paid: "verified",
  due: "featured",
  failed: "sold",
};

const STATUS_LABEL_KEY: Record<string, TranslationKey> = {
  paid: "billing.status.paid",
  due: "billing.status.due",
  failed: "billing.status.failed",
};

export function BillingHistory() {
  const { t, locale } = useTranslation();

  return (
    <div className="overflow-hidden rounded-xl border border-brand-silver bg-surface-white shadow-card">
      <div className="flex items-center justify-between border-b border-brand-silver p-5">
        <h3 className="font-bold text-brand-graphite">{t("billing.historyTitle")}</h3>
        <span className="text-xs text-neutral-subtle">{t("billing.vatIncluded")}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{t("billing.historyCaption")}</caption>
          <thead>
            <tr className="border-b border-brand-silver bg-surface-grey/50 text-xs font-bold uppercase tracking-wider text-neutral-muted">
              <th scope="col" className="p-4">
                {t("billing.colInvoice")}
              </th>
              <th scope="col" className="p-4">
                {t("billing.colDate")}
              </th>
              <th scope="col" className="p-4">
                {t("billing.colAmount")}
              </th>
              <th scope="col" className="p-4">
                {t("billing.colStatus")}
              </th>
              <th scope="col" className="w-12 p-4">
                <span className="sr-only">{t("billing.colDownload")}</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-brand-silver">
            {INVOICES.map((invoice) => (
              <tr key={invoice.id} className="transition-colors hover:bg-surface-grey/30">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-neutral-subtle" aria-hidden="true" />
                    <span className="font-mono text-sm font-medium text-brand-graphite">{invoice.id}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-neutral-muted">{formatLongDate(invoice.date, locale)}</td>
                <td className="p-4 text-sm font-bold tabular-nums text-brand-graphite">
                  {formatZarWithVat(invoice.amount)}
                </td>
                <td className="p-4">
                  <Badge variant={STATUS_VARIANT[invoice.status]}>{t(STATUS_LABEL_KEY[invoice.status])}</Badge>
                </td>
                <td className="p-4 text-right">
                  <button
                    type="button"
                    aria-label={`${t("billing.downloadInvoice")} ${invoice.id}`}
                    className="rounded-lg p-2 text-neutral-subtle transition-colors hover:bg-brand-red/10 hover:text-brand-red"
                  >
                    <Download size={16} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
