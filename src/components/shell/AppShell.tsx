"use client";

import { ReactNode } from "react";
import { clsx } from "clsx";
import { BottomNav } from "./BottomNav";
import { FloatingActionButton } from "./FloatingActionButton";
import { Footer } from "./Footer";
import { CookieBanner } from "@/components/compliance/CookieBanner";
import { FeatureGate } from "@/components/feature/FeatureGate";

interface AppShellProps {
  children: ReactNode;
  className?: string;
  /**
   * Full-bleed pages (maps, auction room) manage their own insets. The header
   * clearance is still applied, since the fixed nav would otherwise cover them.
   */
  disablePadding?: boolean;
  /** Full-bleed surfaces (map, auction room) opt out of the mobile chrome. */
  hideMobileNav?: boolean;
  hideFooter?: boolean;
}

export function AppShell({
  children,
  className,
  disablePadding = false,
  hideMobileNav = false,
  hideFooter = false,
}: AppShellProps) {
  return (
    <div
      className={clsx(
        "min-h-screen w-full flex flex-col",
        "bg-surface-paper dark:bg-ink-950 text-ink-900 dark:text-white",
        "transition-colors duration-300 ease-swift",
        // Header clearance plus the top safe area. The header itself is fixed,
        // so it takes no space in flow and must be compensated here.
        "pt-[calc(var(--header-height)+var(--sat))]",
        // Clearance for the fixed mobile tab bar; desktop has no bottom bar.
        hideMobileNav
          ? "pb-[calc(var(--sab))]"
          : "pb-[calc(var(--mobile-nav-height)+var(--sab))]",
        "md:pb-[var(--sab)]",
        !disablePadding && "px-4 md:px-6 lg:px-8",
        className
      )}
    >
      {children}

      {!hideMobileNav && (
        <>
          <BottomNav />
          <FloatingActionButton />
        </>
      )}

      {!hideFooter && (
        <FeatureGate featureKey="ui.footer">
          <Footer />
        </FeatureGate>
      )}
      <CookieBanner />
    </div>
  );
}
