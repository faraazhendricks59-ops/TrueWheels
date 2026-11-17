"use client";

import Link from "next/link";
import { LayoutGrid, MainSlot, RightRailSlot } from "@/components/shell/LayoutGrid";
import { HeroOmnibox } from "@/components/home/HeroOmnibox";
import { LiveTicker } from "@/components/home/LiveTicker";
import { PersonalizedRail, RailCard } from "@/components/home/PersonalizedRail";
import { AIConciergeDock } from "@/components/home/AIConciergeDock";
import { LiveActivityRail } from "@/components/marketplace/LiveActivityRail";
import { Badge } from "@/components/ui/Badge";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { DEMO_VEHICLES } from "@/lib/demo/vehicles";
import { localeTag } from "@/lib/i18n/dictionaries";

/** Deterministic picks from the shared demo set, so home and marketplace agree. */
const CONTINUE_SEARCH = DEMO_VEHICLES.slice(12, 20);
const ENDING_SOON = DEMO_VEHICLES.slice(40, 46);

/** Matches the marketplace card format so prices read identically everywhere. */
const zar = (value: number) => `R ${value.toLocaleString(localeTag("en"))}`;

function VehicleMedia({ year }: { year: number }) {
  // Gradient placeholder rather than a photograph: the demo set ships no imagery
  // and the photo URLs in the brief do not resolve. Matching VehicleCard keeps
  // the two surfaces visually consistent.
  return (
    <div className="aspect-[16/10] w-full bg-gradient-to-br from-ink-100 to-ink-200 dark:from-ink-800 dark:to-ink-700 flex items-center justify-center">
      <span className="font-display font-bold text-ink-400 dark:text-ink-500 text-lg">{year}</span>
    </div>
  );
}

export function HomeCockpit() {
  return (
    <>
      <LayoutGrid showRightRail rightRailFeatureKey="home.live_rail">
        <MainSlot>
          <div className="pt-4 pb-10">
            <HeroOmnibox />
          </div>

          <div className="-mx-4 md:-mx-6 lg:-mx-8 mb-12">
            <LiveTicker />
          </div>

          <div className="space-y-12">
            <FeatureGate featureKey="home.personalized_rails">
              <PersonalizedRail
                title="Continuing your search"
                subtitle="Based on your recent activity"
                delay={100}
                action={
                  <Link href="/marketplace" className="text-sm font-semibold text-brand hover:underline whitespace-nowrap">
                    See all
                  </Link>
                }
              >
                {CONTINUE_SEARCH.map((vehicle) => (
                  <RailCard key={vehicle.id}>
                    <VehicleMedia year={vehicle.year} />
                    <div className="p-4">
                      <h3 className="font-bold text-ink-900 dark:text-white truncate mb-1">{vehicle.title}</h3>
                      <p className="text-lg font-display font-bold text-brand mb-2 tabular-nums">
                        {zar(vehicle.price)}
                      </p>
                      <p className="text-xs text-ink-500 dark:text-ink-300">
                        {vehicle.mileage.toLocaleString("en-ZA")} km &middot; {vehicle.location}
                      </p>
                      <div className="mt-3">
                        <Badge variant="trust" tone="green">Verified</Badge>
                      </div>
                    </div>
                  </RailCard>
                ))}
              </PersonalizedRail>

              <PersonalizedRail
                title="Live auctions ending soon"
                subtitle="Bid before the clock runs out"
                delay={200}
                action={
                  <Link href="/marketplace" className="text-sm font-semibold text-brand hover:underline whitespace-nowrap">
                    See all
                  </Link>
                }
              >
                {ENDING_SOON.map((vehicle) => (
                  <RailCard key={vehicle.id}>
                    <div className="relative">
                      <VehicleMedia year={vehicle.year} />
                      <span className="absolute top-3 left-3">
                        <Badge variant="live" tone="red" dot pulse>Live</Badge>
                      </span>
                    </div>
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
