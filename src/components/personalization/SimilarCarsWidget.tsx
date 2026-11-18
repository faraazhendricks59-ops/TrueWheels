"use client";

import Link from "next/link";
import { VehicleThumb } from "@/components/vehicles/VehicleThumb";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { ReasonTooltip } from "./ReasonTooltip";
import { similarTo, vehicleSummary } from "@/lib/personalization";
import type { DemoVehicle } from "@/lib/demo/vehicles";
import { localeTag } from "@/lib/i18n/locale";

export function SimilarCarsWidget({ vehicle }: { vehicle: DemoVehicle }) {
  const similar = similarTo(vehicle, 3);

  if (similar.length === 0) return null;

  return (
    <FeatureGate featureKey="personalization.similar_cars">
      <Reveal variant="up" delay={200}>
        <section className="mt-12">
          <h2 className="text-2xl font-display font-bold text-ink-900 dark:text-white">
            Cars like this
          </h2>
          <p className="text-sm text-ink-500 dark:text-ink-300 mt-1 mb-6">
            Matched on model, body type, price, mileage and age.
          </p>

          <div className="card-grid">
            {similar.map(({ vehicle: match, score, reasons }) => (
              <div
                key={match.id}
                className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl overflow-hidden hover:border-brand/30 hover:shadow-lift transition-all ease-swift flex flex-col"
              >
                <Link href={`/vehicles/${match.id}`} className="group block">
                  <span className="relative block aspect-[16/10]">
                    <VehicleThumb vehicle={match} className="absolute inset-0" />
                    <span className="absolute top-3 right-3">
                      <Badge variant="trust" tone="blue">
                        {score}% match
                      </Badge>
                    </span>
                  </span>
                  <span className="block p-4 pb-2">
                    <span className="block font-bold text-ink-900 dark:text-white truncate mb-1">
                      {match.title}
                    </span>
                    <span className="block text-lg font-display font-bold text-brand mb-2 tabular-nums">
                      R {match.price.toLocaleString(localeTag("en"))}
                    </span>
                    <span className="block text-xs text-ink-500 dark:text-ink-300">
                      {vehicleSummary(match)}
                    </span>
                  </span>
                </Link>
                <div className="px-4 pb-4 mt-auto">
                  <ReasonTooltip
                    label={`Why ${score}%?`}
                    reason={reasons.length > 0 ? reasons.join(". ") : "Broadly similar to this listing."}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>
    </FeatureGate>
  );
}
