"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { usePersonalization } from "@/components/providers/PersonalizationProvider";
import { useToast } from "@/components/ui/Toast";

/**
 * Save a vehicle to the garage.
 *
 * The saved state is real: it lives in PersonalizationProvider and persists to
 * localStorage, so the button reflects something that actually happened.
 *
 * The brief reported "We will notify you of any price drops on this vehicle"
 * and "Saved to Garage ID: #GRG-<id>". There is no price-drop alerting and no
 * garage identifier, and the number would have been the vehicle id dressed up as
 * a reference. Saving does exactly one thing here, and the confirmation says so.
 *
 * The state is read from the provider rather than local state, so two of these
 * on one page cannot disagree and the icon is correct after a reload.
 */
export function DigitalGarageButton({
  vehicleId,
  variant = "icon",
}: {
  vehicleId: string;
  variant?: "icon" | "full";
}) {
  const { savedVehicles, toggleSave, isHydrated } = usePersonalization();
  const { toast } = useToast();
  const [pulse, setPulse] = useState(false);

  const isSaved = savedVehicles.includes(vehicleId);

  useEffect(() => {
    if (!pulse) return;
    const timer = setTimeout(() => setPulse(false), 400);
    return () => clearTimeout(timer);
  }, [pulse]);

  const label = useMemo(
    () => (isSaved ? "Remove from garage" : "Save to garage"),
    [isSaved],
  );

  const handleToggle = () => {
    setPulse(true);
    toggleSave(vehicleId);
    if (!isSaved) {
      toast({
        variant: "success",
        title: "Saved to your garage",
        description: "It is stored in this browser on this device only.",
      });
    }
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={isSaved}
        aria-label={label}
        className={clsx(
          "inline-flex items-center justify-center gap-2 w-full min-h-[44px] px-4 rounded-xl border text-sm font-semibold transition-colors",
          isSaved
            ? "border-brand/30 bg-brand/5 text-brand"
            : "border-ink-100 dark:border-ink-800 text-ink-600 dark:text-ink-300 hover:border-brand/40 hover:text-brand",
          pulse && "scale-[0.98]",
        )}
      >
        <Icon icon={Heart} size={16} className={isSaved ? "fill-brand" : undefined} />
        {isSaved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={isSaved}
      aria-label={label}
      title={label}
      className="relative inline-flex items-center justify-center w-11 h-11 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-ink-200 dark:hover:border-ink-700 transition-colors"
    >
      <Icon
        icon={Heart}
        size={18}
        className={clsx(
          "transition-colors",
          isSaved ? "text-brand fill-brand" : "text-ink-400",
        )}
        strokeWidth={isSaved ? 0 : 1.75}
      />
      {pulse && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-xl border-2 border-brand opacity-30"
        />
      )}
      {!isHydrated && <span className="sr-only">Loading saved state</span>}
    </button>
  );
}
