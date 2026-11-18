"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  BarChart3,
  Car,
  LayoutDashboard,
  Settings,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Logo } from "@/components/brand/Logo";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/components/providers/AuthProvider";
import { FeatureGate } from "@/components/feature/FeatureGate";
import type { FeatureKey } from "@/lib/feature-flags";

const DEALER_NAV: { href: string; label: string; icon: LucideIcon; exact?: boolean; featureKey: FeatureKey }[] = [
  { href: "/dealer", label: "Overview", icon: LayoutDashboard, exact: true, featureKey: "dealer.nav_overview" },
  { href: "/dealer/inventory", label: "Inventory", icon: Car, featureKey: "dealer.nav_inventory" },
  { href: "/dealer/leads", label: "Lead pipeline", icon: Users, featureKey: "dealer.nav_leads" },
  { href: "/dealer/analytics", label: "Analytics", icon: BarChart3, featureKey: "dealer.nav_analytics" },
  { href: "/dealer/settings", label: "Showroom settings", icon: Settings, featureKey: "dealer.nav_settings" },
];

/**
 * The dealer command centre shell.
 *
 * The role gate lives here rather than in each page, so a new dealer route
 * cannot be added without it. `AuthGuard` blocks anyone who is not a dealer or
 * an admin and never renders the protected tree while a redirect is pending.
 *
 * The root layout already provides the single `<main>` landmark, so the content
 * column is a plain element — nesting a second main landmark is invalid.
 */
export function DealerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  // The name comes from the signed session, so the sidebar shows whoever is
  // actually signed in. It is deliberately not a hardcoded showroom name.
  const showroomName = user?.name ?? "Your dealership";

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const navLinks = (variant: "sidebar" | "tabs") =>
    DEALER_NAV.map((item) => (
      <FeatureGate key={item.href} featureKey={item.featureKey}>
        <Link
          href={item.href}
          aria-current={isActive(item.href, item.exact) ? "page" : undefined}
          className={clsx(
            variant === "sidebar"
              ? "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ease-swift"
              : "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors",
            variant === "sidebar" &&
              (isActive(item.href, item.exact)
                ? "bg-brand/10 text-brand"
                : "text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-white"),
            variant === "tabs" &&
              (isActive(item.href, item.exact)
                ? "bg-brand text-white"
                : "bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 text-ink-600 dark:text-ink-300")
          )}
        >
          <Icon icon={item.icon} size={variant === "sidebar" ? 16 : 14} strokeWidth={2} />
          {item.label}
        </Link>
      </FeatureGate>
    ));

  return (
    <AuthGuard allowedRoles={["dealer", "admin"]}>
      <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 py-8">
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-2">
          <div
            className={clsx(
              "sticky rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-4",
              // The header is fixed, so the sticky offset has to clear it or the
              // sidebar top slides underneath and the logo is hidden.
              "top-[calc(var(--header-height)+var(--sat)+1.5rem)]"
            )}
          >
            <div className="mb-5 px-1">
              <Logo variant="full" size="xs" />
              <div className="mt-3 flex items-center gap-2 min-w-0">
                <Icon icon={Store} size={14} className="text-ink-400 flex-shrink-0" />
                <span className="text-xs font-bold text-ink-900 dark:text-white truncate">
                  {showroomName}
                </span>
              </div>
              {/* A plain tier label. No verification is performed in this build,
                  so nothing here claims the dealership has been vetted. */}
              <div className="mt-2">
                <Badge tone="ink">Dealer account</Badge>
              </div>
            </div>

            <nav aria-label="Dealer" className="space-y-1">
              {navLinks("sidebar")}
            </nav>

            <div className="pt-4 mt-4 border-t border-ink-100 dark:border-ink-800">
              <p className="text-[10px] text-ink-400 leading-relaxed">
                Sample data. No dealership system is connected to this build.
              </p>
            </div>
          </div>
        </aside>

        {/* Below lg the sidebar becomes a scrolling tab strip. */}
        <div className="lg:hidden col-span-1 -mx-4 px-4 overflow-x-auto hide-scrollbar">
          <nav aria-label="Dealer" className="flex gap-2 min-w-max pb-2">
            {navLinks("tabs")}
          </nav>
        </div>

        <div className="min-w-0 lg:col-span-9 xl:col-span-10">{children}</div>
      </div>
    </AuthGuard>
  );
}
