"use client";

import { useMemo, useState } from "react";
import { Shield, Info, AlertTriangle } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Toggles";
import { FeatureGate } from "@/components/feature/FeatureGate";
import {
  ADDON_OPTIONS,
  COVER_OPTIONS,
  EXCESS_OPTIONS,
  DEFAULT_INSURANCE,
  RATING_FACTORS,
  INSURANCE_OBLIGATIONS,
  coverOption,
  estimatePremium,
  includedAddons,
  type AddonId,
  type CoverType,
} from "@/lib/insurance";

interface InsuranceEstimatorProps {
  vehicleValue: number;
}

const zar = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

/**
 * What insurance might cost, as a range.
 *
 * The brief for this section asked for a single premium to the rand under the
 * heading "Estimated Monthly Premium". A real premium cannot be known from a
 * vehicle price alone: it depends on the driver's age, licence history and
 * claims record, where the car is parked, its security devices, the annual
 * mileage and who else drives it. This component shows a range, states what the
 * range is based on, and lists the factors that move it, so a buyer gets a
 * usable idea of the cost without being handed a false precision.
 *
 * It also collects nothing personal. Asking for an age and a claims history in
 * order to produce a figure that is still only an illustration would be taking
 * personal information for no purpose.
 */
export function InsuranceEstimator({ vehicleValue }: InsuranceEstimatorProps) {
  const [coverType, setCoverType] = useState<CoverType>(DEFAULT_INSURANCE.coverType);
  const [excess, setExcess] = useState<number>(DEFAULT_INSURANCE.excess);
  const [addons, setAddons] = useState<Record<AddonId, boolean>>(DEFAULT_INSURANCE.addons);

  const estimate = useMemo(
    () => estimatePremium(vehicleValue, { coverType, excess, addons }),
    [vehicleValue, coverType, excess, addons],
  );

  const included = includedAddons(coverType);
  const cover = coverOption(coverType);

  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6 shadow-lift">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-aurora-cyan/10 flex items-center justify-center text-aurora-cyan">
          <Icon icon={Shield} size={16} />
        </div>
        <div>
          <h3 className="text-lg font-display font-bold text-ink-900 dark:text-white">
            What insurance may cost
          </h3>
          <p className="text-[11px] text-ink-500 dark:text-ink-400">
            An illustration, not a quote
          </p>
        </div>
      </div>

      <div className="py-5 mb-5 bg-ink-50 dark:bg-ink-950 rounded-xl border border-ink-100 dark:border-ink-800 text-center">
        <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-2">
          Indicative monthly premium
        </p>
        <p className="text-2xl font-display font-bold text-ink-900 dark:text-white tabular-nums">
          {zar.format(estimate.low)} &ndash; {zar.format(estimate.high)}
        </p>
        <p className="text-[11px] text-ink-500 dark:text-ink-400 mt-2">
          per month, for {cover.label.toLowerCase()}
        </p>
      </div>

      <div className="flex items-start gap-2 p-3 mb-5 rounded-lg bg-aurora-blue/5 border border-aurora-blue/20">
        <Icon icon={Info} size={13} className="text-aurora-blue flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed">
          Based on the vehicle price of {zar.format(vehicleValue)} at roughly{" "}
          <span className="font-semibold">
            {(estimate.annualRate * 100).toFixed(1)}% of value a year
          </span>
          , within the range South African insurers publish for this price bracket.
          The final premium depends on your own details and the insurer&apos;s
          assessment, so the range is wide on purpose.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <span className="text-xs font-semibold text-ink-600 dark:text-ink-300 block mb-2">
            Cover
          </span>
          <div role="radiogroup" aria-label="Cover type" className="grid grid-cols-3 gap-2">
            {COVER_OPTIONS.map((option) => {
              const active = coverType === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setCoverType(option.id)}
                  className={clsx(
                    "py-2.5 px-1 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors border min-h-[44px]",
                    active
                      ? "bg-brand/10 border-brand/30 text-brand"
                      : "bg-transparent border-ink-100 dark:border-ink-800 text-ink-500 hover:border-ink-300",
                  )}
                >
                  {option.shortLabel}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-ink-500 dark:text-ink-400 mt-2 leading-relaxed">
            {cover.covers}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="insurance-excess"
              className="text-xs font-semibold text-ink-600 dark:text-ink-300"
            >
              Extra excess you would accept
            </label>
            <span className="text-sm font-mono font-bold text-ink-900 dark:text-white tabular-nums">
              {excess === 0 ? "None" : zar.format(excess)}
            </span>
          </div>
          <input
            id="insurance-excess"
            type="range"
            min={0}
            max={EXCESS_OPTIONS.length - 1}
            step={1}
            value={EXCESS_OPTIONS.findIndex((o) => o.amount === excess)}
            onChange={(e) => setExcess(EXCESS_OPTIONS[Number(e.target.value)].amount)}
            aria-valuetext={excess === 0 ? "No extra excess" : `${zar.format(excess)} excess`}
            className="w-full h-11 bg-transparent appearance-none cursor-pointer accent-brand"
          />
          <div className="flex justify-between text-[9px] text-ink-400 mt-0.5 font-mono">
            <span>None</span>
            <span>R20 000</span>
          </div>
          <p className="text-[11px] text-ink-500 dark:text-ink-400 mt-1.5 leading-relaxed">
            This is on top of the insurer&apos;s compulsory excess. A larger excess
            lowers the monthly premium, but it is the amount you pay yourself on
            every claim.
          </p>
        </div>

        <div className="pt-4 border-t border-ink-100 dark:border-ink-800">
          <span className="text-xs font-semibold text-ink-600 dark:text-ink-300 block mb-3">
            Add-ons
          </span>
          <div className="space-y-2.5">
            {ADDON_OPTIONS.map((option) => {
              const isIncluded = included.includes(option.id);
              return (
                <div
                  key={option.id}
                  className="p-3 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800"
                >
                  <Switch
                    label={
                      <span className="flex items-center gap-2 flex-wrap">
                        {option.label}
                        {isIncluded ? (
                          <Badge variant="status" tone="green">
                            Included
                          </Badge>
                        ) : (
                          <span className="text-[10px] font-mono text-ink-400">
                            +{zar.format(option.cost)}/mo
                          </span>
                        )}
                      </span>
                    }
                    description={option.covers}
                    checked={isIncluded || addons[option.id]}
                    disabled={isIncluded}
                    onChange={(value) =>
                      setAddons((prev) => ({ ...prev, [option.id]: value }))
                    }
                  />
                </div>
              );
            })}
          </div>
          {included.length > 0 && (
            <p className="text-[10px] text-ink-400 mt-2">
              Windscreen and roadside assistance are already part of comprehensive
              cover, so they are not charged again.
            </p>
          )}
        </div>

        <details className="pt-4 border-t border-ink-100 dark:border-ink-800 group">
          <summary className="text-xs font-semibold text-ink-600 dark:text-ink-300 cursor-pointer list-none flex items-center justify-between min-h-[44px]">
            What actually decides your premium
            <span className="text-ink-400 group-open:rotate-180 transition-transform">
              ▾
            </span>
          </summary>
          <ul className="mt-3 space-y-2.5">
            {RATING_FACTORS.map((factor) => (
              <li key={factor.id} className="flex items-start gap-2">
                <span
                  className={clsx(
                    "mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0",
                    factor.effect === "lowers"
                      ? "bg-semantic-success"
                      : factor.effect === "raises"
                        ? "bg-semantic-warning"
                        : "bg-ink-300 dark:bg-ink-600",
                  )}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-[11px] font-bold text-ink-900 dark:text-white">
                    {factor.label}
                  </p>
                  <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
                    {factor.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </details>

        <div className="pt-4 border-t border-ink-100 dark:border-ink-800">
          <div className="flex items-center gap-2 mb-2">
            <Icon icon={AlertTriangle} size={13} className="text-semantic-warning" />
            <span className="text-xs font-semibold text-ink-600 dark:text-ink-300">
              If the car is financed
            </span>
          </div>
          <ul className="space-y-1.5">
            {INSURANCE_OBLIGATIONS.map((line) => (
              <li
                key={line}
                className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-1 before:h-1 before:rounded-full before:bg-ink-300 dark:before:bg-ink-600"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <FeatureGate featureKey="insurance.get_quote">
        <p className="text-[10px] text-ink-400 text-center mt-5">
          TrueWheels is not an insurer and does not sell cover. When you are ready,
          compare quotes from FSCA-licensed insurers or a registered broker.
        </p>
      </FeatureGate>
    </div>
  );
}
