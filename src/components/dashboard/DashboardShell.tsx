"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { LayoutDashboard, Car, Gavel, MessageSquare, Heart, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { FeatureGate } from "@/components/feature/FeatureGate";
import type { FeatureKey } from "@/lib/feature-flags";

const NAV_ITEMS: { href: string; label: string; icon: LucideIcon; featureKey: FeatureKey }[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, featureKey: "dashboard.nav_overview" },
  { href: "/dashboard/listings", label: "My Listings", icon: Car, featureKey: "dashboard.nav_listings" },
  { href: "/dashboard/bids", label: "Auctions & Bids", icon: Gavel, featureKey: "dashboard.nav_bids" },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, featureKey: "dashboard.nav_messages" },
  { href: "/dashboard/saved", label: "Saved Vehicles", icon: Heart, featureKey: "dashboard.nav_saved" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, featureKey: "dashboard.nav_settings" },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <FeatureGate featureKey="ui.dashboard">
      {/* Not a <main>: the root layout already provides the single main
          landmark, and nesting landmarks is invalid. */}
      <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 py-8">
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-2">
          <div className="sticky top-[calc(var(--header-height)+var(--sat)+1.5rem)]">
            <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-4 px-3">Command Center</h2>
            <nav aria-label="Dashboard" className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <FeatureGate key={item.href} featureKey={item.featureKey}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={clsx(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ease-swift",
                        isActive
                          ? "bg-brand/10 text-brand-700 dark:text-brand-400"
                          : "text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900 hover:text-ink-900 dark:hover:text-white"
                      )}
                    >
                      <Icon icon={item.icon} size={16} strokeWidth={isActive ? 2.5 : 1.75} />
                      {item.label}
                    </Link>
                  </FeatureGate>
                );
              })}
            </nav>
          </div>
        </aside>

        <div className="lg:hidden col-span-1 -mx-4 px-4 overflow-x-auto hide-scrollbar">
          <nav aria-label="Dashboard" className="flex gap-2 min-w-max pb-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <FeatureGate key={item.href} featureKey={item.featureKey}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={clsx(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors",
                      isActive
                        ? "bg-brand text-white"
                        : "bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 text-ink-600 dark:text-ink-300"
                    )}
                  >
                    <Icon icon={item.icon} size={14} />
                    {item.label}
                  </Link>
                </FeatureGate>
              );
            })}
          </nav>
        </div>

        <div className="col-span-1 lg:col-span-9 xl:col-span-10 min-w-0">{children}</div>
      </div>
    </FeatureGate>
  );
}
