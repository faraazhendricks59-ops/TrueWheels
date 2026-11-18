"use client";

import Link from "next/link";
import { Calculator, Scale } from "lucide-react";
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
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5 shadow-lift">
      <div className={compact ? "flex items-center justify-between gap-4" : "mb-5"}>
        <div>
          <p className="text-[11px] font-bold text-ink-400 uppercase tracking-wider">Asking price</p>
          <p className="text-2xl font-display font-bold text-ink-900 dark:text-white tabular-nums">
            {price}
          </p>
          <p className="text-[11px] text-ink-500 dark:text-ink-400 mt-0.5">
            Est. R {monthly.toLocaleString(localeTag("en"))}/month
          </p>
        </div>

        {!compact && (
          <div className="p-3 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
            <p className="flex items-center gap-1.5 text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-1">
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
        <div className="flex items-center gap-2 mt-3">
          <ContactActionBar vehicle={vehicle} seller={seller} />
        </div>
      ) : (
        <div className="space-y-3">
          <ContactActionBar vehicle={vehicle} seller={seller} />

          <div className="grid grid-cols-2 gap-2">
            <DigitalGarageButton vehicleId={vehicle.id} variant="full" />
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="inline-flex items-center justify-center gap-2 w-full min-h-[44px] px-4 rounded-xl border border-ink-100 dark:border-ink-800 text-sm font-semibold text-ink-600 dark:text-ink-300 hover:border-brand/40 hover:text-brand transition-colors"
            >
              <Icon icon={Share2} size={15} />
              Share
            </button>
          </div>

          <Link
            href={`/compare?v=${vehicle.id}`}
            className="flex items-center justify-center gap-2 w-full min-h-[44px] rounded-xl border border-ink-100 dark:border-ink-800 text-sm font-semibold text-ink-600 dark:text-ink-300 hover:border-brand/40 hover:text-brand transition-colors"
          >
            <Icon icon={Scale} size={14} />
            Add to comparison
          </Link>
        </div>
      )}

      {!compact && (
        <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mt-5 pt-5 border-t border-ink-100 dark:border-ink-800">
          TrueWheels does not hold payments or inspect vehicles. Check the vehicle in person and
          confirm ownership before paying anyone.
        </p>
      )}

      <ShareSheet isOpen={shareOpen} onClose={() => setShareOpen(false)} vehicle={vehicle} />
    </div>
  );
}
