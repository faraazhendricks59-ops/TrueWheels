"use client";

import Link from "next/link";
import { ShieldAlert, ExternalLink, ArrowLeft } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { VehicleThumb } from "@/components/vehicles/VehicleThumb";
import { EscrowStatusCard } from "./EscrowStatusCard";
import { PaymentBreakdown } from "./PaymentBreakdown";
import { HandoverVerification } from "./HandoverVerification";
import {
  PAYMENT_CHECKS,
  SAFE_PAYMENT_RULES,
  SECURE_PAY_DISCLOSURE,
  formatRand,
  saleRef,
} from "@/lib/secure-pay";
import type { DemoVehicle } from "@/lib/demo/vehicles";

/**
 * The transaction page, which is a safety page rather than a payment page.
 *
 * The brief called this "Secure Pay" and gave it an escrow tracker, deposit bank
 * details, an OTP handover flow and a fee breakdown, under a badge reading "Funds
 * held in escrow by TrueWheels Secure Pay (Pty) Ltd. FSCA regulated." Not one part
 * of that is real, and taken together they are a working scam page: a reader would
 * pay a deposit into an account that does not exist, for a car they might never see.
 * See `src/lib/secure-pay.ts` for the full account.
 *
 * So this page does the opposite. It says plainly, first, that TrueWheels holds no
 * money and has no licence, and then gives the reader the things that actually
 * protect them in a private South African vehicle sale: the safety rules, the
 * regulator and history services they can check for themselves, and a checklist the
 * two parties work through together.
 */
export function SecurePayDashboard({ vehicle }: { vehicle: DemoVehicle }) {
  const ref = saleRef(vehicle);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href={`/vehicles/${vehicle.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 dark:text-ink-400 hover:text-brand transition-colors"
      >
        <Icon icon={ArrowLeft} size={14} />
        Back to the full listing
      </Link>

      {/* Header: the real listing and the real asking price, not a held amount. */}
      <Reveal variant="up">
        <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-1">
                Listing reference
              </p>
              <p className="text-sm font-mono font-bold text-ink-900 dark:text-white">{ref}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 h-16 rounded-lg overflow-hidden bg-ink-100 dark:bg-ink-800 flex-shrink-0">
              <VehicleThumb vehicle={vehicle} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-display font-bold text-ink-900 dark:text-white truncate">
                {vehicle.title}
              </h2>
              <p className="text-2xl font-display font-bold text-ink-900 dark:text-white tabular-nums mt-1">
                {formatRand(vehicle.price)}
              </p>
              <p className="text-[11px] text-ink-400 mt-0.5">Asking price</p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Say it before anything else can be mistaken for a payment flow. */}
      <Reveal variant="up" delay={50}>
        <div className="rounded-xl border border-semantic-warning/30 bg-semantic-warning/5 p-4 flex items-start gap-3">
          <Icon icon={ShieldAlert} size={18} className="text-semantic-warning mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-ink-900 dark:text-white">
              TrueWheels does not hold your money
            </p>
            <p className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed mt-1">
              {SECURE_PAY_DISCLOSURE}
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal variant="up" delay={100}>
        <EscrowStatusCard vehicleId={vehicle.id} />
      </Reveal>

      <Reveal variant="up" delay={150}>
        <PaymentBreakdown vehicle={vehicle} />
      </Reveal>

      {/* The safety rules. This is the substance of the page. */}
      <Reveal variant="up" delay={200}>
        <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6">
          <h3 className="text-lg font-display font-bold text-ink-900 dark:text-white mb-1">
            How to pay safely in a private sale
          </h3>
          <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mb-5">
            These are the things that actually protect a buyer. Each one is something
            you can check yourself, without trusting TrueWheels or anyone else.
          </p>
          <div className="space-y-4">
            {SAFE_PAYMENT_RULES.map((rule) => (
              <div key={rule.title} className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-ink-900 dark:text-white">{rule.title}</p>
                  <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mt-0.5">
                    {rule.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal variant="up" delay={250}>
        <HandoverVerification />
      </Reveal>

      {/* Where to check the things this page cannot. */}
      <Reveal variant="up" delay={300}>
        <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-ink-900 dark:text-white mb-3">
            Check for yourself
          </h3>
          <div className="space-y-3">
            {PAYMENT_CHECKS.map((check) => (
              <a
                key={check.label}
                href={check.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-xl border border-ink-100 dark:border-ink-800 hover:border-brand/30 transition-colors"
              >
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-bold text-ink-900 dark:text-white">
                    {check.label}
                  </span>
                  <span className="block text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mt-0.5">
                    {check.body}
                  </span>
                </span>
                <Icon icon={ExternalLink} size={14} className="text-ink-400 mt-1 flex-shrink-0" />
              </a>
            ))}
          </div>
          <p className="text-[10px] text-ink-400 mt-4 leading-relaxed">
            TrueWheels is not affiliated with any of these services and does not
            receive anything if you use them.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
