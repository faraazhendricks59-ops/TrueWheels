"use client";

import { useMemo, useState } from "react";
import { Calculator, Info } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { CountUp } from "@/components/motion/CountUp";
import { quoteFor, asPercent, ILLUSTRATIVE_PRIME, DEFAULT_FINANCE } from "@/lib/finance";
import { localeTag } from "@/lib/i18n/locale";

const TERMS = [12, 24, 36, 48, 60, 72, 84, 96];

function rand(value: number): string {
  return `R ${Math.round(value).toLocaleString(localeTag("en"))}`;
}

/**
 * An illustration, not a quotation. Every figure the user can change is theirs
 * to change, and the panel states the rate, the fees and the balloon that the
 * numbers assume, because the National Credit Act requires the total cost of
 * credit to be shown alongside the instalment rather than instead of it.
 */
export function FinanceCalculator({ vehiclePrice }: { vehiclePrice: number }) {
  const [deposit, setDeposit] = useState(Math.round(vehiclePrice * DEFAULT_FINANCE.depositRate));
  const [ratePercent, setRatePercent] = useState(asPercent(DEFAULT_FINANCE.annualRate));
  const [termMonths, setTermMonths] = useState<number>(DEFAULT_FINANCE.termMonths);
  const [balloon, setBalloon] = useState(0);

  const quote = useMemo(
    () =>
      quoteFor(vehiclePrice, {
        depositRate: vehiclePrice > 0 ? deposit / vehiclePrice : 0,
        annualRate: ratePercent / 100,
        termMonths,
        balloon,
      }),
    [vehiclePrice, deposit, ratePercent, termMonths, balloon]
  );

  const maxDeposit = Math.round(vehiclePrice * 0.5);
  const maxBalloon = Math.round(vehiclePrice * 0.4);

  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
          <Icon icon={Calculator} size={16} />
        </span>
        <h3 className="text-base font-display font-bold text-ink-900 dark:text-white">
          Repayment illustration
        </h3>
      </div>

      <div className="text-center py-5 mb-5 bg-ink-50 dark:bg-ink-950 rounded-xl border border-ink-100 dark:border-ink-800">
        <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-1">
          Estimated monthly repayment
        </p>
        <p className="text-3xl font-display font-bold text-ink-900 dark:text-white tabular-nums">
          <span className="text-base text-ink-400 mr-1">R</span>
          <CountUp end={quote.monthly} duration={400} />
        </p>
        <p className="text-[10px] text-ink-400 mt-2">
          Includes R {quote.monthlyServiceFee.toLocaleString(localeTag("en"))} monthly fees
        </p>
      </div>

      <div className="space-y-4">
        <Slider
          label="Deposit"
          value={deposit}
          min={0}
          max={maxDeposit}
          step={5000}
          display={rand(deposit)}
          onChange={setDeposit}
        />
        <Slider
          label="Interest rate"
          value={ratePercent}
          min={7}
          max={24}
          step={0.1}
          display={`${ratePercent.toFixed(1)}%`}
          onChange={setRatePercent}
        />
        <div>
          <span className="block text-xs font-semibold text-ink-600 dark:text-ink-300 mb-2">
            Term
          </span>
          <div className="flex flex-wrap gap-1.5">
            {TERMS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setTermMonths(term)}
                aria-pressed={termMonths === term}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  termMonths === term
                    ? "bg-brand text-white"
                    : "bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 hover:bg-ink-200 dark:hover:bg-ink-700"
                }`}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
        <Slider
          label="Balloon payment"
          value={balloon}
          min={0}
          max={maxBalloon}
          step={5000}
          display={rand(balloon)}
          onChange={setBalloon}
        />
      </div>

      <dl className="mt-5 pt-5 border-t border-ink-100 dark:border-ink-800 grid grid-cols-2 gap-4">
        <div>
          <dt className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-1">
            Total cost of credit
          </dt>
          <dd className="text-sm font-bold text-ink-900 dark:text-white tabular-nums">
            {rand(quote.totalCost)}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-1">
            Cost above the price
          </dt>
          <dd className="text-sm font-bold text-semantic-error tabular-nums">
            {rand(quote.totalInterest)}
          </dd>
        </div>
      </dl>

      <p className="flex items-start gap-2 text-[10px] text-ink-500 dark:text-ink-400 leading-relaxed mt-4">
        <Icon icon={Info} size={11} className="mt-0.5 flex-shrink-0" />
        An illustration using {ratePercent.toFixed(1)}% ({asPercent(ILLUSTRATIVE_PRIME).toFixed(2)}%
        prime plus {(ratePercent - asPercent(ILLUSTRATIVE_PRIME)).toFixed(2)}%). It is not a
        quotation and not a credit offer. Your rate, fees and terms are set by the lender after an
        assessment.
        {quote.balloon > 0 &&
          ` A balloon of ${rand(quote.balloon)} is owed at the end of the term.`}
      </p>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
}) {
  const id = `finance-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="text-xs font-semibold text-ink-600 dark:text-ink-300">
          {label}
        </label>
        <span className="text-xs font-bold text-ink-900 dark:text-white tabular-nums">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        // h-11 gives the control a 44px touch area; the visible track stays thin.
        className="w-full h-11 bg-transparent appearance-none cursor-pointer accent-brand"
      />
    </div>
  );
}
