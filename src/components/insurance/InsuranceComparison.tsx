"use client";

import { ShieldCheck, Info, ExternalLink } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { FeatureGate } from "@/components/feature/FeatureGate";

/**
 * How to compare insurers, without inventing any of their prices.
 *
 * The brief for this section supplied a table naming Discovery Insure,
 * OUTsurance and MiWay with specific premiums (R1 850, R1 920, R1 650), "match
 * scores" of 96%, 88% and 75%, star ratings, and reasoning presented as
 * personalised analysis: "Matches your profile: Low annual mileage (<15k km) and
 * garage-parked vehicle", "Strong match for Gauteng residents".
 *
 * None of that can be produced by this app. There is no insurer integration, no
 * underwriting engine, and no data about the viewer's mileage, address or
 * parking. A premium printed beside a named insurer is a statement about that
 * company's pricing, and a percentage "match" is a prediction about their
 * underwriting decision. The reasoning was worse still: it claimed to know the
 * viewer's annual mileage and that their car was garaged, which nothing here
 * knows. The ratings were invented too.
 *
 * So this section does the thing that actually helps a buyer: it explains what
 * separates one policy from another, which is where money is really won or lost
 * on a claim, and it points to the bodies that can be checked.
 */

interface ComparisonPoint {
  id: string;
  label: string;
  why: string;
}

/**
 * The questions that decide whether a policy pays out. Chosen because they are
 * the differences most often discovered only at claim time, when it is too late
 * to change insurer.
 */
const COMPARISON_POINTS: readonly ComparisonPoint[] = [
  {
    id: "excess",
    label: "Excess and additional excess",
    why: "Ask for both. A low monthly premium often carries a large additional excess for theft or hijacking, or for a young driver.",
  },
  {
    id: "value",
    label: "Insured value basis",
    why: "Retail, market or agreed value. On a financed car this decides whether a payout settles the settlement figure or leaves you owing the difference.",
  },
  {
    id: "exclusions",
    label: "What is excluded",
    why: "Read the exclusions, not the marketing. Wear and tear, tyres, and damage from driving on an unproclaimed road are common exclusions.",
  },
  {
    id: "tracker",
    label: "Tracking device requirement",
    why: "Some policies require an approved tracker and will reduce or refuse a theft claim without one. Factor the installation cost in.",
  },
  {
    id: "courtesy",
    label: "Courtesy car and towing",
    why: "Whether a replacement car is provided during repairs, and how many days, varies widely and matters most when you need it.",
  },
  {
    id: "claims",
    label: "Claims process and turnaround",
    why: "Who assesses the damage, whether you choose the repairer, and the published turnaround time. This is where policies feel different.",
  },
  {
    id: "broker",
    label: "Broker or direct",
    why: "A broker can argue a claim on your behalf; a direct insurer is usually cheaper. Both must be FSCA-registered.",
  },
  {
    id: "premium",
    label: "Premium stability",
    why: "Ask how premiums moved for existing clients over the last two years. A cheap first-year premium that jumps at renewal is not cheap.",
  },
] as const;

/**
 * Where to check an insurer before signing. These are regulators and ombuds,
 * not insurers, and each is a matter of public record.
 */
const REGULATORS: readonly { name: string; role: string; url: string }[] = [
  {
    name: "FSCA",
    role: "The Financial Sector Conduct Authority licenses every insurer and intermediary. Check the licence before you sign.",
    url: "https://www.fsca.co.za/",
  },
  {
    name: "National Credit Regulator",
    role: "Regulates credit providers, including the requirement that a financed vehicle is insured.",
    url: "https://www.ncr.org.za/",
  },
  {
    name: "Ombudsman for Short-Term Insurance",
    role: "Free dispute resolution if a claim is rejected and you believe the decision is wrong.",
    url: "https://www.osti.co.za/",
  },
];

export function InsuranceComparison() {
  return (
    <Reveal variant="up" delay={100}>
      <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6 shadow-lift">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <h3 className="text-lg font-display font-bold text-ink-900 dark:text-white">
              How to compare insurers
            </h3>
            <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">
              What separates one policy from another, and where to check them.
            </p>
          </div>
          <Badge variant="status" tone="ink">
            No rates published
          </Badge>
        </div>

        {/* Say plainly why there is no table of prices. */}
        <div className="flex items-start gap-2.5 p-4 mb-5 rounded-xl bg-aurora-blue/5 border border-aurora-blue/20">
          <Icon icon={Info} size={14} className="text-aurora-blue flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed">
            TrueWheels has no arrangement with any insurer, so it cannot show you
            what each one would charge. A premium depends on your age, licence
            history, claims record, where the car is parked and its security
            devices, none of which this app knows. The illustration on this page is
            a range for this vehicle only. For real prices, request quotes from at
            least three FSCA-licensed insurers and compare them line by line.
          </p>
        </div>

        <ul className="space-y-3">
          {COMPARISON_POINTS.map((point) => (
            <li
              key={point.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-ink-50/60 dark:bg-ink-950/60 border border-ink-100 dark:border-ink-800"
            >
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 flex items-center justify-center text-ink-500 flex-shrink-0">
                <Icon icon={ShieldCheck} size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-ink-900 dark:text-white">
                  {point.label}
                </p>
                <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mt-0.5">
                  {point.why}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="pt-5 mt-5 border-t border-ink-100 dark:border-ink-800">
          <h4 className="text-xs font-bold text-ink-900 dark:text-white mb-3">
            Where to check an insurer
          </h4>
          <ul className="space-y-2.5">
            {REGULATORS.map((body) => (
              <li key={body.name} className="flex items-start gap-2.5">
                <div className="min-w-0">
                  <a
                    href={body.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 py-1 text-xs font-bold text-brand hover:underline"
                  >
                    {body.name}
                    <Icon icon={ExternalLink} size={11} />
                  </a>
                  <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
                    {body.role}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <FeatureGate featureKey="insurance.get_quote">
          <p className="text-[10px] text-ink-400 text-center mt-5">
            The estimate above is for the vehicle only. It is not a quote and no
            insurer has assessed your risk.
          </p>
        </FeatureGate>
      </div>
    </Reveal>
  );
}
