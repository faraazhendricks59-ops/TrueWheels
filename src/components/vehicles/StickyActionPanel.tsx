"use client";

import Link from "next/link";
import { Calculator, Gavel, MessageSquare, Scale } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { useToast } from "@/components/ui/Toast";
import { instalmentFor } from "@/lib/finance";
import type { DemoVehicle } from "@/lib/demo/vehicles";
import { localeTag } from "@/lib/i18n/locale";

export function StickyActionPanel({
  vehicle,
  compact = false,
}: {
  vehicle: DemoVehicle;
  compact?: boolean;
}) {
  const { toast } = useToast();
  const { monthly, deposit, termMonths, annualRate } = instalmentFor(vehicle.price);
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

      <div className={compact ? "flex items-center gap-2 mt-3" : "space-y-3"}>
        <SmartButton
          featureKey="vdp.contact_seller"
          className="flex-1 !h-11"
          leftIcon={MessageSquare}
          onClick={() =>
            toast({
              variant: "info",
              title: "Messaging is not connected yet",
              description: "There is no message service behind this button, so nothing was sent.",
            })
          }
        >
          Contact seller
        </SmartButton>
        <SmartButton
          featureKey="vdp.make_offer"
          variant="secondary"
          className="flex-1 !h-11"
          leftIcon={Gavel}
          onClick={() =>
            toast({
              variant: "info",
              title: "Offers are not connected yet",
              description: "There is no offer service behind this button, so nothing was submitted.",
            })
          }
        >
          Make an offer
        </SmartButton>
        {!compact && (
          <Link
            href={`/compare?v=${vehicle.id}`}
            className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-ink-100 dark:border-ink-800 text-sm font-semibold text-ink-600 dark:text-ink-300 hover:border-brand/40 hover:text-brand transition-colors"
          >
            <Icon icon={Scale} size={14} />
            Add to comparison
          </Link>
        )}
      </div>

      {!compact && (
        <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mt-5 pt-5 border-t border-ink-100 dark:border-ink-800">
          TrueWheels does not hold payments or inspect vehicles. Check the vehicle in person and
          confirm ownership before paying anyone.
        </p>
      )}
    </div>
  );
}
