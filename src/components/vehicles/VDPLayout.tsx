"use client";

import type { ReactNode } from "react";
import { FeatureGate } from "@/components/feature/FeatureGate";

/**
 * 12-column detail layout: content on the left, the conversion panel pinned to
 * the right on desktop and to the bottom of the viewport on mobile.
 */
export function VDPLayout({
  children,
  actionPanel,
  compactActionPanel,
}: {
  children: ReactNode;
  actionPanel: ReactNode;
  /** Shorter version for the bottom bar, which has less room. */
  compactActionPanel?: ReactNode;
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

        {/* Bottom bar on small screens. Padding clears the home indicator. */}
        <div
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pt-3 bg-white/95 dark:bg-ink-950/95 backdrop-blur-xl border-t border-ink-100 dark:border-ink-800"
          style={{ paddingBottom: "calc(0.75rem + var(--sab))" }}
        >
          <FeatureGate featureKey="vdp.action_panel">{compactActionPanel ?? actionPanel}</FeatureGate>
        </div>
      </div>

      {/* Space so the bottom bar never covers the end of the page. */}
      <div className="lg:hidden h-28" aria-hidden="true" />
    </div>
  );
}
