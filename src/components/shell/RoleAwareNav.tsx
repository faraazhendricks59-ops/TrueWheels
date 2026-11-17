"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Gavel, Heart, Car, Briefcase, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { RoleGate } from "@/components/auth/RoleGate";
import { FeatureGate } from "@/components/feature/FeatureGate";
import type { UserRole } from "@/lib/auth/roles";
import type { FeatureKey } from "@/lib/feature-flags";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
  featureKey: FeatureKey;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, roles: ["buyer", "seller", "dealer", "admin"], featureKey: "nav.dash_overview" },
  { href: "/dashboard/bids", label: "My Bids", icon: Gavel, roles: ["buyer", "seller"], featureKey: "nav.dash_bids" },
  { href: "/dashboard/saved", label: "Saved Cars", icon: Heart, roles: ["buyer"], featureKey: "nav.dash_saved" },
  { href: "/dealer/inventory", label: "Inventory", icon: Car, roles: ["dealer", "admin"], featureKey: "nav.dealer_inventory" },
  { href: "/dealer/leads", label: "Leads & CRM", icon: Briefcase, roles: ["dealer", "admin"], featureKey: "nav.dealer_leads" },
  { href: "/admin/users", label: "User Mgmt", icon: Users, roles: ["admin"], featureKey: "nav.admin_users" },
];

/**
 * Role-and-flag aware navigation. Both gates must pass: the admin can disable a
 * destination platform-wide, and the viewer's tier must include it.
 */
export function RoleAwareNav({ variant = "desktop" }: { variant?: "desktop" | "mobile" | "topnav" }) {
  const pathname = usePathname();

  return (
    <>
      {ALL_NAV_ITEMS.map((item) => (
        <RoleGate key={item.href} allowedRoles={item.roles}>
          <FeatureGate featureKey={item.featureKey}>
            <Link
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={clsx(
                variant === "topnav"
                  ? "text-sm font-medium transition-colors"
                  : "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ease-swift",
                variant === "topnav" &&
                  (pathname === item.href
                    ? "text-brand"
                    : "text-ink-600 dark:text-ink-300 hover:text-brand"),
                variant !== "topnav" &&
                  (pathname === item.href
                    ? "bg-brand/10 text-brand"
                    : "text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900"),
                variant === "mobile" && "flex-col gap-1 px-2 py-1.5 text-[10px]"
              )}
            >
              {variant !== "topnav" && <Icon icon={item.icon} size={variant === "mobile" ? 18 : 16} />}
              {item.label}
            </Link>
          </FeatureGate>
        </RoleGate>
      ))}
    </>
  );
}
