"use client";

import Link from "next/link";
import { LayoutGrid, MainSlot, RightRailSlot } from "@/components/shell/LayoutGrid";
import { HeroOmnibox } from "@/components/home/HeroOmnibox";
import { HeroBackdrop } from "@/components/home/HeroBackdrop";
import { LiveTicker } from "@/components/home/LiveTicker";
import { ForYouRail } from "@/components/personalization/ForYouRail";
import { RecentlyViewedRail } from "@/components/personalization/RecentlyViewedRail";
import { PersonalizedRail, RailCard } from "@/components/home/PersonalizedRail";
import { AIConciergeDock } from "@/components/home/AIConciergeDock";
import { LiveActivityRail } from "@/components/marketplace/LiveActivityRail";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { DEMO_VEHICLES } from "@/lib/demo/vehicles";
import { localeTag } from "@/lib/i18n/dictionaries";
import { VehicleThumb } from "@/components/vehicles/VehicleThumb";

/** Deterministic picks from the shared demo set, so home and marketplace agree. */
const CONTINUE_SEARCH = DEMO_VEHICLES.slice(12, 20);

/** Matches the marketplace card format so prices read identically everywhere. */
const zar = (value: number) => `R ${value.toLocaleString(localeTag("en"))}`;

export function HomeCockpit() {
  return (
    <>
      {/* The video hero sits OUTSIDE the 12-column grid. Inside a grid slot it
          stopped at the right rail: it reached the left window edge but not the
          right, so the video ended mid-screen while the rail sat beside it on a
          plain background. The band bleeds past the shell's page padding to both
          window edges and up behind the fixed transparent header. It is not
          clipped, so the search dropdown can hang below it; the video is clipped
          in its own wrapper instead. */}
      <div className="relative -mx-4 md:-mx-6 lg:-mx-8 -mt-[calc(var(--header-height)+var(--sat))] pt-[calc(var(--header-height)+var(--sat)+1.5rem)] pb-12 md:pb-16">
        <HeroBackdrop />
        <div className="relative z-10">
          <HeroOmnibox />
        </div>
      </div>

      <LayoutGrid showRightRail rightRailFeatureKey="home.live_rail">
        <MainSlot>
          <div className="-mx-4 md:-mx-6 lg:-mx-8 mb-12">
            <LiveTicker />
          </div>

          <div className="space-y-12">
            <ForYouRail />
            <RecentlyViewedRail />

            <FeatureGate featureKey="home.personalized_rails">
              <PersonalizedRail
                title="More from the catalogue"
                subtitle="Sample listings, picked to show the layout"
                delay={100}
                action={
                  <Link href="/marketplace" className="inline-block py-1.5 text-sm font-semibold text-brand hover:underline whitespace-nowrap">
                    See all
                  </Link>
                }
              >
                {CONTINUE_SEARCH.map((vehicle) => (
                  <RailCard key={vehicle.id}>
                    <VehicleThumb vehicle={vehicle} className="aspect-[16/10] w-full" />
                    <div className="p-4">
                      <h3 className="font-bold text-ink-900 dark:text-white truncate mb-1">{vehicle.title}</h3>
                      <p className="text-lg font-display font-bold text-brand mb-2 tabular-nums">
                        {zar(vehicle.price)}
                      </p>
                      <p className="text-xs text-ink-500 dark:text-ink-300">
                        {vehicle.mileage.toLocaleString("en-ZA")} km &middot; {vehicle.location}
                      </p>
                    </div>
                  </RailCard>
                ))}
              </PersonalizedRail>

            </FeatureGate>
          </div>
        </MainSlot>

        <RightRailSlot>
          <div className="sticky top-[calc(var(--header-height)+var(--sat)+1.5rem)] space-y-6">
            <LiveActivityRail />
          </div>
        </RightRailSlot>
      </LayoutGrid>

      <AIConciergeDock />
    </>
  );
}
