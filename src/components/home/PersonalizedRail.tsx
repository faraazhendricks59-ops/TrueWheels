"use client";

import type { ReactNode } from "react";
import { clsx } from "clsx";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";

interface PersonalizedRailProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  delay?: number;
  /** Optional trailing control, e.g. a "see all" link. */
  action?: ReactNode;
}

export function PersonalizedRail({ title, subtitle, children, delay = 0, action }: PersonalizedRailProps) {
  return (
    <Reveal variant="up" delay={delay}>
      <section>
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-ink-900 dark:text-white">{title}</h2>
            {subtitle && <p className="text-sm text-ink-500 dark:text-ink-300 mt-1">{subtitle}</p>}
          </div>
          {action}
        </div>

        {/* A rail that bleeds past the shell padding would widen the document.
            Padding is applied to the scroller instead of negative margins, so the
            first card lines up with the heading and nothing overflows the page. */}
        <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 snap-x snap-mandatory">
          {children}
        </div>
      </section>
    </Reveal>
  );
}

export function RailCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Magnetic strength={0.05} className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px] snap-start">
      <div
        className={clsx(
          "h-full overflow-hidden rounded-xl border border-ink-200/70 bg-white transition-colors hover:border-ink-300 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-ink-700",
          className
        )}
      >
        {children}
      </div>
    </Magnetic>
  );
}
