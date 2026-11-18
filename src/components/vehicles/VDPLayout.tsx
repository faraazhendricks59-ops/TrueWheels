"use client";

import type { ReactNode } from "react";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { MobileActionBar } from "./MobileActionBar";
import { VehicleMobileActions } from "./VehicleMobileActions";
import type { DemoVehicle } from "@/lib/demo/vehicles";

/**
 * 12-column detail layout: content on the left, the conversion panel pinned to
 * the right on desktop and to the bottom of the viewport on mobile.
 */
export function VDPLayout({
  children,
  actionPanel,
  compactActionPanel,
  mobilePrice,
  vehicle,
}: {
  children: ReactNode;
  actionPanel: ReactNode;
  /** Shorter version for the bottom bar, which has less room. */
  compactActionPanel?: ReactNode;
  /** Formatted asking price, shown above the actions on small screens. */
  mobilePrice: string;
  /** The vehicle the mobile bar acts on. */
  vehicle: DemoVehicle;
}) {
  return (
    <div className="w-full max-w-[1600px] mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-8 xl:col-span-9 min-w-0 space-y-10">{children}</div>

        <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
          <div className="sticky top-[calc(var(--header-height)+1.5rem)]">
            <FeatureGate featureKey="vdp.action_panel">{actionPanel}</FeatureGate>
          </div>
        </aside>

        {/* Bottom bar on small screens. There is only one, rendered here. */}
        <MobileActionBar price={mobilePrice}>
          <FeatureGate featureKey="vdp.action_panel">
            {compactActionPanel ?? <VehicleMobileActions vehicle={vehicle} />}
          </FeatureGate>
        </MobileActionBar>
      </div>

      {/* Space so the bottom bar never covers the end of the page. */}
      <div className="lg:hidden h-28" aria-hidden="true" />
    </div>
  );
}
