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
import { InsuranceEstimator } from "@/components/insurance/InsuranceEstimator";
import { InsuranceComparison } from "@/components/insurance/InsuranceComparison";
import { InsuranceActions } from "@/components/insurance/InsuranceActions";
import { SellerCard } from "./SellerCard";
import { ReviewsSection } from "./ReviewsSection";
import { sellerFor } from "@/lib/seller";
import { ScrollSpyNav } from "./ScrollSpyNav";
import { ActivityDisclosure } from "./ActivityDisclosure";
import { VDPJsonLd } from "@/components/seo/VDPJsonLd";
import { localeTag } from "@/lib/i18n/locale";
import { mediaFor } from "@/lib/gallery-media";
import { SimilarCarsWidget } from "@/components/personalization/SimilarCarsWidget";
import { usePersonalization } from "@/components/providers/PersonalizationProvider";
import { vehicleBodyType } from "@/lib/vehicle-facets";
import type { DemoVehicle } from "@/lib/demo/vehicles";

export function VehicleDetail({ vehicle }: { vehicle: DemoVehicle }) {
  const { trackView, toggleSave, savedVehicles } = usePersonalization();
  const isSaved = savedVehicles.includes(vehicle.id);
  const media = mediaFor(vehicle);
  const seller = sellerFor(vehicle);
  const price = `R ${vehicle.price.toLocaleString(localeTag("en"))}`;

  useEffect(() => {
    trackView(vehicle.id);
  }, [vehicle.id, trackView]);

  return (
    <VDPLayout
      mobilePrice={price}
      vehicle={vehicle}
      actionPanel={
        <div className="space-y-5">
          <StickyActionPanel vehicle={vehicle} />
          <FeatureGate featureKey="vdp.finance_calculator">
            <FinanceCalculator vehiclePrice={vehicle.price} />
          </FeatureGate>
          <FeatureGate featureKey="vdp.seller_card">
            <SellerCard seller={seller} />
          </FeatureGate>
        </div>
      }
    >
      {/* Structured data first, so a crawler that stops early still reads it. */}
      <FeatureGate featureKey="vdp.structured_data">
        <VDPJsonLd vehicle={vehicle} />
      </FeatureGate>

      <section id="gallery" className="scroll-mt-24">
        <Reveal variant="up" delay={100}>
          <FeatureGate featureKey="vdp.gallery">
            <VehicleGallery vehicle={vehicle} media={media} />
          </FeatureGate>
        </Reveal>
      </section>

      {/* The rail sits under the title, in the flow, so it scrolls away rather
          than competing with the fixed header for the top of the viewport. */}
      <ScrollSpyNav />

      <section id="overview" className="scroll-mt-24 space-y-6">
        <VehicleTitle vehicle={vehicle} />

        <FeatureGate featureKey="vdp.activity_disclosure">
          <ActivityDisclosure />
        </FeatureGate>

        <TrustHeader vehicle={vehicle} />

        <SpecGrid vehicle={vehicle} />
      </section>

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

      <section id="specs" className="scroll-mt-24">
        <Reveal variant="up" delay={300}>
          <SpecTabs vehicle={vehicle} />
        </Reveal>
      </section>

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
          className="inline-flex items-center gap-2 py-1.5 text-sm text-ink-500 hover:text-brand transition-colors"
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

      {/* The sidebar that holds the calculator is hidden below lg, so it is
          rendered here too rather than being unreachable on a phone. */}
      <section id="finance" className="scroll-mt-24 space-y-8">
        <FeatureGate featureKey="vdp.finance_calculator">
          <div className="lg:hidden">
            <FinanceCalculator vehiclePrice={vehicle.price} />
          </div>
        </FeatureGate>

        <FeatureGate featureKey="vdp.lender_comparison">
          <LenderComparison />
        </FeatureGate>
      </section>

      {/* Insurance sits under the same "Ownership Costs" heading as finance,
          because the two together are what the car costs to run. */}
      <FeatureGate featureKey="vdp.insurance_estimator">
        <section aria-labelledby="ownership-costs-heading" className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-ink-100 dark:bg-ink-800" aria-hidden="true" />
            <h2
              id="ownership-costs-heading"
              className="text-xl font-display font-bold text-ink-900 dark:text-white"
            >
              Ownership Costs
            </h2>
            <span className="h-px flex-1 bg-ink-100 dark:bg-ink-800" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <InsuranceEstimator vehicleValue={vehicle.price} />
            <InsuranceActions vehicleTitle={vehicle.title} />
          </div>
        </section>
      </FeatureGate>

      <FeatureGate featureKey="vdp.insurance_comparison">
        <InsuranceComparison />
      </FeatureGate>

      {/* The sidebar holding the seller card is hidden below lg, so the seller
          identity is repeated here on small screens: whether the seller is a
          trade or a private seller changes the buyer's legal protection, which
          matters most when someone is reading on a phone. */}
      <section id="seller" className="scroll-mt-24 space-y-8">
        <FeatureGate featureKey="vdp.seller_card">
          <div className="lg:hidden">
            <SellerCard seller={seller} />
          </div>
        </FeatureGate>

        <FeatureGate featureKey="vdp.reviews">
          <ReviewsSection vehicle={vehicle} seller={seller} />
        </FeatureGate>
      </section>

      <FeatureGate featureKey="vdp.similar_cars">
        <SimilarCarsWidget vehicle={vehicle} />
      </FeatureGate>
    </VDPLayout>
  );
}
