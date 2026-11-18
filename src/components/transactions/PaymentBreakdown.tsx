"use client";

import { Info } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { formatRand } from "@/lib/secure-pay";
import type { DemoVehicle } from "@/lib/demo/vehicles";

/**
 * What the sale actually costs, which is the asking price and nothing to us.
 *
 * The brief's breakdown charged a "Platform Fee (1.5%)" and a "Bank Transfer Fee"
 * of R150, and told the reader the fee "covers escrow services, independent
 * inspection coordination, and 24/7 dispute resolution". TrueWheels provides none
 * of those, so the fee would be a charge for nothing, and the sentence describing
 * what it buys would be false. It also presented a "Total" larger than the price,
 * which is the number a buyer would act on.
 *
 * There is no fee, because there is no service behind it. What the panel can show
 * honestly is the price, that TrueWheels adds nothing, and the costs a private sale
 * genuinely carries — which are real and which the buyer should budget for.
 */
export function PaymentBreakdown({ vehicle }: { vehicle: DemoVehicle }) {
  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-ink-900 dark:text-white">What this costs</h3>
        <span className="flex items-center gap-1 text-ink-400" title="TrueWheels charges nothing">
          <Icon icon={Info} size={12} />
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-600 dark:text-ink-300">Seller&apos;s asking price</span>
          <span className="text-sm font-mono font-bold text-ink-900 dark:text-white tabular-nums">
            {formatRand(vehicle.price)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-600 dark:text-ink-300">
            TrueWheels fee
          </span>
          <span className="text-sm font-mono text-ink-600 dark:text-ink-300 tabular-nums">
            {formatRand(0)}
          </span>
        </div>

        <div className="h-px bg-ink-100 dark:bg-ink-800 my-3" />

        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-ink-900 dark:text-white">
            Payable to the seller
          </span>
          <span className="text-xl font-display font-bold text-ink-900 dark:text-white tabular-nums">
            {formatRand(vehicle.price)}
          </span>
        </div>
      </div>

      <p className="text-[10px] text-ink-400 mt-4 leading-relaxed">
        TrueWheels charges no fee and takes no cut of a sale, because it is not part of
        the payment. The price is paid directly to the seller.
      </p>

      <div className="mt-5 pt-5 border-t border-ink-100 dark:border-ink-800">
        <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-2">
          Costs a private sale does carry
        </p>
        <ul className="space-y-2">
          {[
            "A vehicle history check, if you buy one. This is the cheapest protection against a written-off or stolen vehicle.",
            "An independent mechanical inspection, if you arrange one.",
            "The change-of-ownership fee at a registering authority.",
            "If the vehicle is financed, the outstanding settlement, which must be paid before ownership can be transferred.",
            "Your own insurance, from the day you take the vehicle.",
          ].map((line) => (
            <li
              key={line}
              className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-1 before:h-1 before:rounded-full before:bg-ink-300 dark:before:bg-ink-600"
            >
              {line}
            </li>
          ))}
        </ul>
        <p className="text-[10px] text-ink-400 mt-3 leading-relaxed">
          TrueWheels does not arrange, quote or take payment for any of these. Each is
          paid to the provider you choose.
        </p>
      </div>
    </div>
  );
}
