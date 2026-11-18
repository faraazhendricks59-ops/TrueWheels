"use client";

import { Icon } from "@/components/ui/Icon";
import { Calendar } from "lucide-react";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { vehicleSpecs } from "@/lib/vehicle-trust";
import type { DemoVehicle } from "@/lib/demo/vehicles";

export function SpecGrid({ vehicle }: { vehicle: DemoVehicle }) {
  const specs = vehicleSpecs(vehicle);
  const hasEstimates = specs.some((spec) => spec.estimated);

  return (
    <FeatureGate featureKey="vdp.spec_grid">
      <section>
        <h2 className="text-xl font-display font-bold text-ink-900 dark:text-white mb-4">
          Specifications
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-ink-100 dark:bg-ink-800 border border-ink-100 dark:border-ink-800 rounded-2xl overflow-hidden">
          {specs.map((spec) => (
            <div key={spec.label} className="bg-white dark:bg-ink-900 p-4">
              <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-1.5">
                {spec.label}
              </p>
              <p className="text-sm font-bold text-ink-900 dark:text-white tabular-nums">
                {spec.value}
                {spec.estimated && (
                  <span className="ml-1.5 text-[10px] font-medium text-ink-400">est.</span>
                )}
              </p>
            </div>
          ))}
        </div>

        {hasEstimates && (
          <p className="flex items-start gap-2 text-[11px] text-ink-500 dark:text-ink-400 mt-3 leading-relaxed">
            <Icon icon={Calendar} size={12} className="mt-0.5 flex-shrink-0" />
            Figures marked est. are typical for this model and year. They are not measurements of
            this vehicle and should be confirmed before you rely on them.
          </p>
        )}
      </section>
    </FeatureGate>
  );
}
