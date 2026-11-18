"use client";

import { useId, useState } from "react";
import { Flame } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { FeatureGate } from "@/components/feature/FeatureGate";

/**
 * Eight particles, spaced evenly, with fixed variation.
 *
 * The brief generated the angle, distance and delay with Math.random() inside a
 * useMemo. That is a hydration mismatch: useMemo runs on the server as well as
 * the client, the two calls produce different numbers, and React then reports a
 * mismatch on the style attribute of every particle. Spacing the angles evenly
 * and varying the distance in a fixed pattern looks the same and renders the
 * same on both sides.
 */
const PARTICLES = Array.from({ length: 8 }, (_, index) => ({
  id: index,
  angle: index * 45,
  distance: 20 + (index % 3) * 6,
  delay: (index % 4) * 0.025,
}));

/**
 * The Rev button.
 *
 * The count is gone. Nothing records how many people have revved a post, so a
 * number would be invented, and the brief's own simulated API returned true
 * unconditionally, meaning a number could never be corrected by a failure. What
 * the button honestly reports is whether *you* revved it, on this device.
 *
 * The burst is decorative, so it is skipped entirely when the reader has asked
 * for reduced motion. The brief's version ran it regardless, which is the one
 * place a physics animation can actually cause harm.
 */
export function ReactionButton({
  storageKey,
  initiallyActive,
  isActive,
  isPending,
  onToggle,
}: {
  storageKey: string;
  initiallyActive: boolean;
  isActive: boolean;
  isPending: boolean;
  onToggle: () => void;
}) {
  const [burstKey, setBurstKey] = useState(0);
  const burstId = useId();
  const [showBurst, setShowBurst] = useState(false);

  const handleClick = () => {
    if (isPending) return;

    if (!isActive) {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!prefersReduced) {
        setBurstKey((value) => value + 1);
        setShowBurst(true);
        window.setTimeout(() => setShowBurst(false), 700);
      }
    }

    onToggle();
  };

  return (
    <FeatureGate featureKey="social.reaction_rev">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={isActive}
        aria-label={isActive ? "Remove your rev" : "Rev this post"}
        data-storage-key={storageKey}
        data-initial={initiallyActive ? "active" : "inactive"}
        className={clsx(
          "flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] px-2 sm:px-2.5 rounded-full transition-colors",
          isActive ? "text-brand" : "text-ink-400 hover:text-brand hover:bg-brand/5",
        )}
      >
        <span className="relative inline-flex p-0.5">
          <Icon
            icon={Flame}
            size={16}
            strokeWidth={isActive ? 2.5 : 1.75}
            className={clsx(isActive && "fill-brand")}
          />
          {showBurst && (
            <span key={burstKey} id={burstId} className="absolute inset-0 pointer-events-none" aria-hidden="true">
              {PARTICLES.map((particle) => (
                <span
                  key={particle.id}
                  className="rev-particle absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-brand"
                  style={
                    {
                      "--angle": `${particle.angle}deg`,
                      "--distance": `${particle.distance}px`,
                      animationDelay: `${particle.delay}s`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </span>
          )}
        </span>
        <span className={clsx("hidden sm:inline text-xs font-medium", isActive && "font-bold")}>
          {isActive ? "Revved" : "Rev"}
        </span>
      </button>
    </FeatureGate>
  );
}
