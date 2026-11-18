"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Calculator, Check, Copy, Minus, MessageCircle, Plus, ShieldAlert } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { offerMessage, whatsAppShareLink } from "@/lib/contact";
import {
  ILLUSTRATIVE_MONTHS,
  ILLUSTRATIVE_RATE,
  OFFER_STEPS,
  PAYMENT_DISCLOSURE,
  formatRand,
  monthlyRepayment,
} from "@/lib/auctions";
import type { DemoVehicle } from "@/lib/demo/vehicles";

/**
 * What a buyer can actually do here: work out a number, and send it to the seller.
 *
 * The brief's version was a "proxy-bidding engine": it took a maximum, computed a
 * minimum next bid, and on submit ran a one-second fake delay and then a toast
 * reading "Bid verified by TrueWheels Auction Engine. Funds pre-authorized." It
 * also carried a "You're Winning" badge and a "Reserve Met" trust badge.
 *
 * Every one of those claims a mechanism that does not exist. There is no auction
 * engine to verify a bid, no bank authorisation, no reserve and no proxy. The
 * toast was the worst of them: it told the reader their money was committed when
 * nothing had happened. That is the fabrication Phase 45 deleted from the
 * dashboard, and it is not acceptable to reintroduce it with a nicer panel.
 *
 * What replaces it is a calculator and a way to make contact. The buyer sets a
 * figure, sees what it means monthly at a rate that is stated as illustrative, and
 * sends it to the seller through the same honest enquiry channel the vehicle page
 * uses (WhatsApp with no recipient set — see src/lib/contact.ts). The panel states
 * plainly that no bid is placed and no money moves.
 */
export function BidPlacementPanel({ vehicle }: { vehicle: DemoVehicle }) {
  const [amount, setAmount] = useState(vehicle.price);
  const [deposit, setDeposit] = useState(Math.round(vehicle.price * 0.1));
  const [copied, setCopied] = useState(false);

  const nudge = (delta: number) => setAmount((value) => Math.max(0, value + delta));
  // A deposit larger than the offer is meaningless, so the effective deposit
  // follows the offer down even though the field keeps its own value.
  const effectiveDeposit = Math.min(deposit, amount);
  const financed = Math.max(0, amount - effectiveDeposit);
  const monthly = monthlyRepayment(financed);

  const message = offerMessage(vehicle, {
    amount,
    position: "unsure",
    note: "I am still arranging how I would pay.",
  });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6">
      {/* The asking price, stated as the asking price — not as a bid. */}
      <div className="mb-6 pb-6 border-b border-ink-100 dark:border-ink-800">
        <p className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-2">
          Seller&apos;s asking price
        </p>
        <p className="text-3xl font-display font-bold text-ink-900 dark:text-white tabular-nums">
          {formatRand(vehicle.price)}
        </p>
        <p className="text-[11px] text-ink-500 dark:text-ink-400 mt-2 leading-relaxed">
          This is a price, not a bid. Nothing has been offered and nothing can be bid
          here.
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Icon icon={Calculator} size={14} className="text-ink-400" />
        <p className="text-xs font-semibold text-ink-600 dark:text-ink-300 uppercase tracking-wide">
          What an offer would cost you
        </p>
      </div>

      {/* Offer amount, adjusted by real steps. */}
      <div className="mb-4">
        <label
          htmlFor="offer-amount"
          className="text-xs font-semibold text-ink-600 dark:text-ink-300 uppercase tracking-wide block mb-2"
        >
          Amount you have in mind
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 font-bold text-lg">
            R
          </span>
          <input
            id="offer-amount"
            type="number"
            inputMode="numeric"
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
            step={1000}
            min={0}
            className={clsx(
              "w-full h-14 pl-10 pr-4 rounded-xl bg-ink-50 dark:bg-ink-950 border text-xl font-mono font-bold text-ink-900 dark:text-white tabular-nums",
              "focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all border-ink-200 dark:border-ink-800"
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {OFFER_STEPS.map((step) => (
            <div key={step} className="flex gap-1">
              <button
                type="button"
                aria-label={`Reduce amount by ${formatRand(step)}`}
                onClick={() => nudge(-step)}
                className="flex-1 py-2 rounded-lg bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800 text-ink-500 hover:border-brand/30 hover:text-brand transition-colors min-h-[40px] flex items-center justify-center"
              >
                <Icon icon={Minus} size={12} />
              </button>
              <button
                type="button"
                aria-label={`Increase amount by ${formatRand(step)}`}
                onClick={() => nudge(step)}
                className="flex-1 py-2 rounded-lg bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800 text-ink-500 hover:border-brand/30 hover:text-brand transition-colors min-h-[40px] flex items-center justify-center"
              >
                <Icon icon={Plus} size={12} />
              </button>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-ink-400 mt-1.5">
          The three pairs adjust by {OFFER_STEPS.map((step) => formatRand(step)).join(", ")}.
        </p>
      </div>

      {/* Deposit, then the illustrative monthly figure. */}
      <div className="mb-4">
        <label
          htmlFor="offer-deposit"
          className="text-xs font-semibold text-ink-600 dark:text-ink-300 uppercase tracking-wide block mb-2"
        >
          Deposit you would put down
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 font-bold text-lg">
            R
          </span>
          <input
            id="offer-deposit"
            type="number"
            inputMode="numeric"
            value={deposit}
            onChange={(event) => setDeposit(Math.max(0, Math.min(amount, Number(event.target.value))))}
            step={5000}
            min={0}
            className="w-full h-14 pl-10 pr-4 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 text-xl font-mono font-bold text-ink-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
          />
        </div>
      </div>

      <div className="rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800 p-4 mb-4">
        <div className="flex items-baseline justify-between">
          <p className="text-xs font-semibold text-ink-500 dark:text-ink-400">
            Illustrative monthly repayment
          </p>
          <p className="text-xl font-mono font-bold text-ink-900 dark:text-white tabular-nums">
            {formatRand(monthly)}
          </p>
        </div>
        <p className="text-[10px] text-ink-400 mt-2 leading-relaxed">
          Illustrative only, on {formatRand(financed)} over {ILLUSTRATIVE_MONTHS} months at{" "}
          {(ILLUSTRATIVE_RATE * 100).toFixed(1)}% a year. TrueWheels does not lend and is not
          a credit provider. This is not a quotation and no finance has been arranged.
        </p>
      </div>

      {/* Send the figure to the seller, through the honest enquiry channel. */}
      <FeatureGate featureKey="contact.whatsapp">
        <SmartButton
          featureKey="contact.whatsapp"
          variant="primary"
          className="w-full min-h-[44px]"
          leftIcon={MessageCircle}
          onClick={() => window.open(whatsAppShareLink(message), "_blank", "noopener")}
        >
          Send {formatRand(amount)} offer on WhatsApp
        </SmartButton>
        <button
          type="button"
          onClick={copy}
          className="w-full mt-2 min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg border border-ink-200 dark:border-ink-700 text-xs font-semibold text-ink-600 dark:text-ink-300 hover:border-brand/40 hover:text-brand transition-colors"
        >
          <Icon icon={copied ? Check : Copy} size={13} />
          {copied ? "Offer copied" : "Copy the offer text"}
        </button>
      </FeatureGate>

      <p className="text-[10px] text-ink-400 leading-relaxed text-center mt-3">
        Opens WhatsApp with your offer written out and no recipient set, so you
        choose who receives it. TrueWheels does not hold the seller&apos;s number, and
        no bid is placed and no money moves.
      </p>

      {/* Payment, stated plainly. */}
      <div className="mt-4 p-3 bg-semantic-warning/5 border border-semantic-warning/20 rounded-xl flex items-start gap-2">
        <Icon
          icon={ShieldAlert}
          size={14}
          className="text-semantic-warning mt-0.5 flex-shrink-0"
        />
        <p className="text-[10px] text-ink-600 dark:text-ink-300 leading-relaxed">
          {PAYMENT_DISCLOSURE}
        </p>
      </div>
    </div>
  );
}
