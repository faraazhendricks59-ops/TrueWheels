"use client";

import type { ReactNode } from "react";
import { clsx } from "clsx";

/**
 * The mobile action bar.
 *
 * This exists because two components were competing for the same fixed slot at
 * the bottom of the screen. VDPLayout rendered one, and Phase 40's brief added a
 * StickyMobileCTA rendering another, both `fixed bottom-0`, so one would have sat
 * on top of the other with the page scrolling behind both. The brief also gave
 * the CTA its own Message and Call handlers, but there is no messaging service
 * and no seller phone number, so both would have been inert.
 *
 * There is exactly one bar now, and this is it. The price and the actions come
 * from the caller, so the panel and the bar cannot disagree about what the
 * vehicle costs. The safe-area inset is applied here rather than by the caller,
 * because getting it wrong puts the buttons under the home indicator.
 *
 * Hidden from lg upward, where the sidebar takes over.
 */
export function MobileActionBar({
  price,
  children,
  className,
}: {
  price: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pt-3",
        "bg-white/95 dark:bg-ink-950/95 backdrop-blur-xl border-t border-ink-100 dark:border-ink-800",
        className,
      )}
      style={{ paddingBottom: "calc(0.75rem + var(--sab))" }}
    >
      <div className="max-w-lg mx-auto">
        <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider">
          Asking price
        </p>
        <p className="text-lg font-display font-bold text-ink-900 dark:text-white tabular-nums mb-2">
          {price}
        </p>
        {children}
      </div>
    </div>
  );
}
