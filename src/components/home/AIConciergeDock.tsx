"use client";

import { Sparkles } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/motion/Magnetic";
import { SmartButton } from "@/components/ui/SmartButton";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { useConcierge } from "@/components/providers/ConciergeProvider";

/**
 * The mobile floating action button and the bottom navigation already occupy
 * the bottom centre below md, so the dock is desktop-only. Showing it there too
 * would stack three controls on the same spot.
 */
export function AIConciergeDock() {
  const { open } = useConcierge();

  return (
    <FeatureGate featureKey="ai.concierge_dock">
      <div className="hidden md:flex fixed bottom-0 left-0 right-0 z-30 justify-center pointer-events-none pb-8 md:pb-12">
        <div className="pointer-events-auto">
          <Magnetic strength={0.2}>
            <SmartButton
              featureKey="ai.concierge_dock"
              variant="primary"
              size="lg"
              onClick={open}
              className="!rounded-full !h-14 !px-6 !shadow-glow-aurora relative overflow-hidden group"
            >
              <span className="absolute inset-0 aurora-bg opacity-90 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              <span className="relative flex items-center gap-2 text-white font-semibold">
                <Icon icon={Sparkles} size={18} className="text-white" />
                Ask TrueWheels &mdash; find my next car
              </span>
            </SmartButton>
          </Magnetic>
        </div>
      </div>
    </FeatureGate>
  );
}
