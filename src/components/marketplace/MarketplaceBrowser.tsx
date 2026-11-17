"use client";

import { LayoutGrid, MainSlot, SidebarSlot, RightRailSlot } from "@/components/shell/LayoutGrid";
import { FilterPanel } from "@/components/marketplace/FilterPanel";
import { LiveActivityRail } from "@/components/marketplace/LiveActivityRail";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { DEMO_VEHICLES } from "@/lib/demo/vehicles";

export function MarketplaceBrowser() {
  const listings = DEMO_VEHICLES.slice(0, 9);

  return (
    <>
      <LayoutGrid showSidebar showRightRail rightRailFeatureKey="ui.right_rail">
        <SidebarSlot>
          <div className="sticky top-[calc(var(--header-height)+var(--sat)+1.5rem)]">
            <FilterPanel />
          </div>
        </SidebarSlot>

        <MainSlot>
          <div className="space-y-6">
            <header className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-display font-bold text-ink-900 dark:text-white">Marketplace</h1>
                <p className="text-sm text-ink-500 dark:text-ink-300">
                  {DEMO_VEHICLES.length.toLocaleString("en-ZA")} vehicles found
                </p>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </div>
        </MainSlot>

        <RightRailSlot>
          <div className="sticky top-[calc(var(--header-height)+var(--sat)+1.5rem)] space-y-6">
            <LiveActivityRail />
          </div>
        </RightRailSlot>
      </LayoutGrid>
    </>
  );
}
