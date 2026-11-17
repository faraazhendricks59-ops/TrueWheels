"use client";

import { Circle, Maximize2, Minus, Plus } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { FeatureGate } from "@/components/feature/FeatureGate";

interface MapControlsProps {
  isRadiusActive: boolean;
  hasRadius: boolean;
  radiusKm: number;
  onToggleRadius: () => void;
  onClearRadius: () => void;
  onRadiusChange: (km: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitBounds: () => void;
}

const RADIUS_STEPS = [5, 10, 25, 50, 100];

const controlClass =
  "w-10 h-10 rounded-xl flex items-center justify-center shadow-lift glass text-ink-600 dark:text-ink-300 hover:scale-105 transition-all";

export function MapControls({
  isRadiusActive,
  hasRadius,
  radiusKm,
  onToggleRadius,
  onClearRadius,
  onRadiusChange,
  onZoomIn,
  onZoomOut,
  onFitBounds,
}: MapControlsProps) {
  return (
    <FeatureGate featureKey="map.controls">
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        <FeatureGate featureKey="map.radius">
          <button
            type="button"
            onClick={onToggleRadius}
            aria-pressed={isRadiusActive}
            aria-label="Draw search radius"
            title="Draw search radius"
            className={clsx(
              controlClass,
              isRadiusActive && "bg-brand text-white border-brand hover:scale-105"
            )}
          >
            <Icon icon={Circle} size={18} />
          </button>
        </FeatureGate>

        <button type="button" onClick={onZoomIn} aria-label="Zoom in" title="Zoom in" className={controlClass}>
          <Icon icon={Plus} size={18} />
        </button>
        <button type="button" onClick={onZoomOut} aria-label="Zoom out" title="Zoom out" className={controlClass}>
          <Icon icon={Minus} size={18} />
        </button>
        <button
          type="button"
          onClick={onFitBounds}
          aria-label="Fit all results"
          title="Fit all results"
          className={controlClass}
        >
          <Icon icon={Maximize2} size={18} />
        </button>
      </div>

      {isRadiusActive && (
        <div className="absolute top-4 left-4 z-[400] glass rounded-xl px-3 py-2 max-w-[15rem]">
          <p className="text-xs font-semibold text-ink-900 dark:text-white">Click the map to set a centre</p>
          <p className="text-[11px] text-ink-500 dark:text-ink-300 mt-0.5">
            Showing listings within the radius you pick.
          </p>
        </div>
      )}

      {hasRadius && (
        <FeatureGate featureKey="map.radius">
          <div className="absolute bottom-4 left-4 z-[400] glass rounded-xl px-3 py-3 space-y-2">
            <p className="text-[10px] font-bold text-ink-500 uppercase tracking-wider">Search radius</p>
            <div className="flex items-center gap-1" role="group" aria-label="Search radius in kilometres">
              {RADIUS_STEPS.map((step) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => onRadiusChange(step)}
                  aria-pressed={radiusKm === step}
                  className={clsx(
                    "px-2 py-1 rounded-lg text-[11px] font-bold tabular-nums transition-colors",
                    radiusKm === step
                      ? "bg-brand text-white"
                      : "bg-white/60 dark:bg-ink-800/60 text-ink-600 dark:text-ink-300 hover:bg-white"
                  )}
                >
                  {step}
                </button>
              ))}
              <span className="text-[10px] text-ink-500 ml-0.5">km</span>
            </div>
            <button
              type="button"
              onClick={onClearRadius}
              className="text-[11px] font-semibold text-brand hover:underline"
            >
              Clear radius
            </button>
          </div>
        </FeatureGate>
      )}
    </FeatureGate>
  );
}
