"use client";

import { clsx } from "clsx";
import { Gauge } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Switch } from "@/components/ui/Toggles";
import { useAccessibility } from "@/components/providers/AccessibilityProvider";
import { HERO_VIDEO_BYTES, formatBytes } from "@/lib/pwa";

/**
 * Data Saver, reusing the setting the project already has.
 *
 * The brief asked for a new Data Saver with its own context, claiming it would
 * compress images to 50% quality, pause background sync and save "up to 70%" or
 * "~15MB per session".
 *
 * The project already had this feature. `AccessibilityProvider` holds a `lowData`
 * flag that flips a `low-data` class on `<html>`, applies it before first paint via a
 * boot script, and is honoured throughout `globals.css` and the motion primitives —
 * the home-page video checks it, and animation, blur and decorative effects are all
 * suppressed under it. Adding a second provider would have created two switches for
 * one behaviour, which drift apart and then contradict each other.
 *
 * So this is a thin wrapper over the existing setting, for the PWA surfaces. It adds
 * no state. It also drops the invented numbers: there is no image proxy to compress
 * through and no background sync to pause, so the only figure stated is the one that
 * is real — the size of the video that stops loading.
 */
export function DataSaverToggle({ className }: { className?: string }) {
  const { lowData, toggleLowData } = useAccessibility();

  return (
    <div
      className={clsx(
        "bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              lowData
                ? "bg-semantic-success/10 text-semantic-success"
                : "bg-ink-100 dark:bg-ink-800 text-ink-500"
            )}
          >
            <Icon icon={Gauge} size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-ink-900 dark:text-white">Data Saver</p>
            <p className="text-[10px] text-ink-500 dark:text-ink-400">
              For a slow or metered connection
            </p>
          </div>
        </div>
        <Switch
          label={<span className="sr-only">Data Saver</span>}
          checked={lowData}
          onChange={toggleLowData}
        />
      </div>

      <p className="mt-4 pt-4 border-t border-ink-100 dark:border-ink-800 text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
        Turns off animation, backdrop blur and video across the site, and is applied
        before the page first paints. The largest single download it stops is the
        home-page background video, which is {formatBytes(HERO_VIDEO_BYTES)}. It does not
        compress images, and no figure is claimed for the rest of the page because none
        has been measured.
      </p>
    </div>
  );
}
