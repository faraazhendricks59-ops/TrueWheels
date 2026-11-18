"use client";

import { ImageOff } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

/**
 * Drawn in place of a photograph. Nothing is requested over the network, so a
 * listing with no images produces no failed requests and no broken icon.
 */
export function MediaPlaceholder({ label, year }: { label: string; year: number }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-ink-100 to-ink-200 dark:from-ink-800 dark:to-ink-700">
      <span className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-ink-900/60 flex items-center justify-center text-ink-400">
        <Icon icon={ImageOff} size={20} />
      </span>
      <span className="text-center px-6">
        <span className="block font-display font-bold text-ink-500 dark:text-ink-300">
          {label}
        </span>
        <span className="block text-[11px] text-ink-400 mt-1">
          No photo supplied for this {year} listing
        </span>
      </span>
    </div>
  );
}
