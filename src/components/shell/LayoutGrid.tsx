"use client";

import { createContext, useContext, ReactNode } from "react";
import { clsx } from "clsx";
import { useFeatureFlags, type FeatureKey } from "@/lib/feature-flags";

interface LayoutContextValue {
  hasSidebar: boolean;
  hasRightRail: boolean;
}

const LayoutContext = createContext<LayoutContextValue>({
  hasSidebar: false,
  hasRightRail: false,
});

interface LayoutGridProps {
  children: ReactNode;
  showSidebar?: boolean;
  showRightRail?: boolean;
  /** God-Mode kill switch for the right rail. */
  rightRailFeatureKey?: FeatureKey;
  className?: string;
}

/**
 * 12-column shell. Slots derive their spans from this context rather than
 * hardcoding them, because fixed spans break as soon as a sibling slot is
 * absent: sidebar(3) + main(8) + rail(4) sums to 15 and wraps, and a lone
 * main(8) leaves a quarter of the row empty.
 *
 * The right rail only appears at xl when a sidebar is also present, so the row
 * never has to fit four columns into an uncomfortable width.
 */
export function LayoutGrid({
  children,
  showSidebar = false,
  showRightRail = false,
  rightRailFeatureKey = "ui.right_rail",
  className,
}: LayoutGridProps) {
  const { isEnabled } = useFeatureFlags();
  const railEnabled = showRightRail && isEnabled(rightRailFeatureKey);

  return (
    <LayoutContext.Provider value={{ hasSidebar: showSidebar, hasRightRail: railEnabled }}>
      <div className={clsx("w-full max-w-[1600px] mx-auto grid gap-6 lg:gap-8 grid-cols-1 md:grid-cols-12", className)}>
        {children}
      </div>
    </LayoutContext.Provider>
  );
}

interface GridSlotProps {
  children: ReactNode;
  className?: string;
}

export function MainSlot({ children, className }: GridSlotProps) {
  const { hasSidebar, hasRightRail } = useContext(LayoutContext);
  return (
    <div
      className={clsx(
        "col-span-1 min-w-0",
        hasSidebar
          ? hasRightRail
            ? "md:col-span-8 lg:col-span-9 xl:col-span-6"
            : "md:col-span-8 lg:col-span-9"
          : hasRightRail
            ? "md:col-span-12 lg:col-span-9 xl:col-span-9"
            : "md:col-span-12",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SidebarSlot({ children, className }: GridSlotProps) {
  // Hidden below md, where filters move into a Sheet.
  return (
    <div className={clsx("hidden md:block md:col-span-4 lg:col-span-3 min-w-0", className)}>
      {children}
    </div>
  );
}

export function RightRailSlot({ children, className }: GridSlotProps) {
  const { hasSidebar } = useContext(LayoutContext);
  return (
    <div
      className={clsx(
        "hidden min-w-0",
        hasSidebar ? "xl:block xl:col-span-3" : "lg:block lg:col-span-3",
        className
      )}
    >
      {children}
    </div>
  );
}
