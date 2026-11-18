"use client";

import Link from "next/link";
import { Calculator, Scale, ShieldCheck } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { instalmentFor } from "@/lib/finance";
import type { DemoVehicle } from "@/lib/demo/vehicles";
import { localeTag } from "@/lib/i18n/locale";
import { sellerFor } from "@/lib/seller";
import { ContactActionBar } from "./ContactActionBar";
import { DigitalGarageButton } from "./DigitalGarageButton";
import { ShareSheet } from "./ShareSheet";
import { useState } from "react";
import { Share2 } from "lucide-react";

export function StickyActionPanel({
  vehicle,
  compact = false,
}: {
  vehicle: DemoVehicle;
  compact?: boolean;
}) {
  const { monthly, deposit, termMonths, annualRate } = instalmentFor(vehicle.price);
  const seller = sellerFor(vehicle);
  const [shareOpen, setShareOpen] = useState(false);
  const price = `R ${vehicle.price.toLocaleString(localeTag("en"))}`;

  return (
    <div className="rounded-xl border border-ink-200/70 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
      <div className={compact ? "flex items-center justify-between gap-4" : "mb-4"}>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-400">Asking price</p>
          <p className="text-[26px] font-display font-bold leading-tight text-ink-900 tabular-nums dark:text-white">
            {price}
          </p>
          <p className="text-[11px] text-ink-500 dark:text-ink-400 mt-0.5">
            Est. R {monthly.toLocaleString(localeTag("en"))}/month
          </p>
        </div>

        {!compact && (
          <div className="rounded-lg border border-ink-200/70 bg-ink-50 p-2.5 dark:border-ink-800 dark:bg-ink-950">
            <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-400">
              <Icon icon={Calculator} size={10} /> Estimate basis
            </p>
            <p className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed">
              R {deposit.toLocaleString(localeTag("en"))} deposit, {termMonths} months at{" "}
              {(annualRate * 100).toFixed(1)}%. Illustration only, not a credit offer.
            </p>
          </div>
        )}
      </div>

      {compact ? (
        <div className="mt-3">
          <ContactActionBar vehicle={vehicle} seller={seller} compact />
        </div>
      ) : (
        <div className="space-y-3">
          <ContactActionBar vehicle={vehicle} seller={seller} />

          <div className="grid grid-cols-2 gap-2">
            <DigitalGarageButton vehicleId={vehicle.id} variant="full" />
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-ink-200/70 px-4 text-sm font-semibold text-ink-600 transition-colors hover:border-brand/40 hover:text-brand dark:border-ink-800 dark:text-ink-300"
            >
              <Icon icon={Share2} size={15} />
              Share
            </button>
          </div>

          <Link
            href={`/compare?v=${vehicle.id}`}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-ink-200/70 text-sm font-semibold text-ink-600 transition-colors hover:border-brand/40 hover:text-brand dark:border-ink-800 dark:text-ink-300"
          >
            <Icon icon={Scale} size={14} />
            Add to comparison
          </Link>
        </div>
      )}

      {!compact && (
        <div className="mt-4 border-t border-ink-200/70 pt-4 dark:border-ink-800">
          <p className="text-[11px] leading-relaxed text-ink-500 dark:text-ink-400">
            TrueWheels does not hold payments or inspect vehicles. Check the vehicle in person and
            confirm ownership before paying anyone.
          </p>
          <Link
            href={`/transactions/${vehicle.id}`}
            className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline"
          >
            <Icon icon={ShieldCheck} size={13} />
            How to pay safely
          </Link>
        </div>
      )}

      <ShareSheet isOpen={shareOpen} onClose={() => setShareOpen(false)} vehicle={vehicle} />
    </div>
  );
}
