"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Gauge, Heart, MapPin } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { SmartButton } from "@/components/ui/SmartButton";
import { Reveal } from "@/components/motion/Reveal";
import { SimilarCarsWidget } from "@/components/personalization/SimilarCarsWidget";
import { usePersonalization } from "@/components/providers/PersonalizationProvider";
import { specsFor } from "@/lib/comparison-data";
import type { DemoVehicle } from "@/lib/demo/vehicles";
import { localeTag } from "@/lib/i18n/locale";

const SPEC_ROWS = [
  ["0-100 km/h", "s"],
  ["Power", "kW"],
  ["Torque", "Nm"],
  ["Top Speed", "km/h"],
] as const;

export function VehicleDetail({ vehicle }: { vehicle: DemoVehicle }) {
  const { trackView, toggleSave, savedVehicles } = usePersonalization();
  const isSaved = savedVehicles.includes(vehicle.id);
  const specs = specsFor(vehicle);

  // Recorded once per vehicle, so opening the same page twice does not add it
  // to the history twice.
  useEffect(() => {
    trackView(vehicle.id);
  }, [vehicle.id, trackView]);

  return (
    <div className="w-full max-w-[1200px] mx-auto py-8">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-brand mb-6 transition-colors"
      >
        <Icon icon={ArrowLeft} size={14} /> Back to the marketplace
      </Link>

      <Reveal variant="up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-[16/10] rounded-2xl bg-gradient-to-br from-ink-100 to-ink-200 dark:from-ink-800 dark:to-ink-700 flex items-center justify-center">
            <span className="font-display font-bold text-ink-400 dark:text-ink-500 text-4xl">
              {vehicle.year}
            </span>
          </div>

          <div>
            <h1 className="text-3xl font-display font-bold text-ink-900 dark:text-white">
              {vehicle.title}
            </h1>
            <p className="text-3xl font-display font-bold text-brand mt-2 tabular-nums">
              R {vehicle.price.toLocaleString(localeTag("en"))}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-ink-500 dark:text-ink-300 mt-4">
              <span className="flex items-center gap-1.5">
                <Icon icon={Gauge} size={14} />
                {vehicle.mileage.toLocaleString(localeTag("en"))} km
              </span>
              <span className="flex items-center gap-1.5">
                <Icon icon={MapPin} size={14} />
                {vehicle.location}
              </span>
              <Badge variant="trust" tone="green">Verified dealer</Badge>
            </div>

            <dl className="grid grid-cols-2 gap-4 mt-6">
              {SPEC_ROWS.map(([label, unit]) => (
                <div key={label} className="p-3 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
                  <dt className="text-[11px] text-ink-400 uppercase tracking-wide">{label}</dt>
                  <dd className="text-lg font-display font-bold text-ink-900 dark:text-white tabular-nums">
                    {specs.performance[label]} {unit}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex items-center gap-3 mt-6">
              <SmartButton
                featureKey="personalization.save_vehicle"
                variant="secondary"
                onClick={() => toggleSave(vehicle.id)}
                leftIcon={isSaved ? Heart : Heart}
              >
                {isSaved ? "Saved" : "Save this car"}
              </SmartButton>
              <Link href="/compare" className="text-sm font-semibold text-brand hover:underline">
                Compare with another car
              </Link>
            </div>
          </div>
        </div>
      </Reveal>

      <SimilarCarsWidget vehicle={vehicle} />
    </div>
  );
}
