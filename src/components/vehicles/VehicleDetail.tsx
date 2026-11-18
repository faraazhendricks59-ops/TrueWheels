"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Heart } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { Reveal } from "@/components/motion/Reveal";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { VDPLayout } from "./VDPLayout";
import { StickyActionPanel } from "./StickyActionPanel";
import { TrustHeader, VehicleTitle } from "./TrustHeader";
import { SpecGrid } from "./SpecGrid";
import { VehicleGallery } from "./VehicleGallery";
import { SpecTabs } from "./SpecTabs";
import { FinanceCalculator } from "@/components/finance/FinanceCalculator";
import { LenderComparison } from "@/components/finance/LenderComparison";
import { mediaFor } from "@/lib/gallery-media";
import { SimilarCarsWidget } from "@/components/personalization/SimilarCarsWidget";
import { usePersonalization } from "@/components/providers/PersonalizationProvider";
import { vehicleBodyType } from "@/lib/vehicle-facets";
import type { DemoVehicle } from "@/lib/demo/vehicles";

export function VehicleDetail({ vehicle }: { vehicle: DemoVehicle }) {
  const { trackView, toggleSave, savedVehicles } = usePersonalization();
  const isSaved = savedVehicles.includes(vehicle.id);
  const media = mediaFor(vehicle);

  useEffect(() => {
    trackView(vehicle.id);
  }, [vehicle.id, trackView]);

  return (
    <VDPLayout
      actionPanel={
        <div className="space-y-5">
          <StickyActionPanel vehicle={vehicle} />
          <FeatureGate featureKey="vdp.finance_calculator">
            <FinanceCalculator vehiclePrice={vehicle.price} />
          </FeatureGate>
        </div>
      }
      compactActionPanel={<StickyActionPanel vehicle={vehicle} compact />}
    >
      <Reveal variant="up" delay={100}>
        <FeatureGate featureKey="vdp.gallery">
          <VehicleGallery vehicle={vehicle} media={media} />
        </FeatureGate>
      </Reveal>

      <VehicleTitle vehicle={vehicle} />

      <TrustHeader vehicle={vehicle} />

      <SpecGrid vehicle={vehicle} />

      <Reveal variant="up" delay={200}>
        <FeatureGate featureKey="vdp.description">
          <section>
            <h2 className="text-xl font-display font-bold text-ink-900 dark:text-white mb-3">
              About this {vehicleBodyType(vehicle).toLowerCase()}
            </h2>
            <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
              A {vehicle.year} {vehicle.title.replace(/^\d{4}\s/, "")} with{" "}
              {vehicle.mileage.toLocaleString("en-ZA")} km, advertised in {vehicle.location}. The
              seller has not supplied a written description. Ask them directly about service
              history, accident repairs, outstanding finance and whether the vehicle is still under
              warranty.
            </p>
          </section>
        </FeatureGate>
      </Reveal>

      <Reveal variant="up" delay={300}>
        <SpecTabs vehicle={vehicle} />
      </Reveal>

      <div className="flex flex-wrap items-center gap-4">
        <FeatureGate featureKey="personalization.save_vehicle">
          <SmartButton
            featureKey="personalization.save_vehicle"
            variant="secondary"
            leftIcon={Heart}
            onClick={() => toggleSave(vehicle.id)}
          >
            {isSaved ? "Saved" : "Save this car"}
          </SmartButton>
        </FeatureGate>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-brand transition-colors"
        >
          <Icon icon={ArrowLeft} size={14} /> Back to the marketplace
        </Link>
      </div>

      <FeatureGate featureKey="vdp.report_listing">
        <p className="flex items-center gap-2 text-[11px] text-ink-400 pt-6 border-t border-ink-100 dark:border-ink-800">
          <Icon icon={Clock} size={12} />
          Listing reference {vehicle.id}. Report anything that looks wrong to the TrueWheels team.
        </p>
      </FeatureGate>

      <FeatureGate featureKey="vdp.lender_comparison">
        <LenderComparison />
      </FeatureGate>

      <FeatureGate featureKey="vdp.similar_cars">
        <SimilarCarsWidget vehicle={vehicle} />
      </FeatureGate>
    </VDPLayout>
  );
}
