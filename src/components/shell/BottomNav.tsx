"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Home, MessageSquare, Search, User, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { useTranslation } from "@/components/providers/I18nProvider";
import type { FeatureKey, } from "@/lib/feature-flags";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

const NAV_ITEMS: {
  href: string;
  labelKey: TranslationKey;
  icon: LucideIcon;
  featureKey: FeatureKey;
}[] = [
  { href: "/", labelKey: "nav.home", icon: Home, featureKey: "nav.mobile_home" },
  { href: "/marketplace", labelKey: "nav.marketplace", icon: Search, featureKey: "nav.mobile_search" },
  { href: "/garage", labelKey: "nav.garage", icon: Car, featureKey: "nav.mobile_garage" },
  { href: "/network", labelKey: "nav.network", icon: Users, featureKey: "nav.mobile_network" },
  { href: "/messages", labelKey: "nav.messages", icon: MessageSquare, featureKey: "nav.mobile_messages" },
  { href: "/profile", labelKey: "nav.profile", icon: User, featureKey: "nav.mobile_profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <FeatureGate featureKey="ui.mobile_nav">
      <nav
        className="fixed bottom-0 inset-x-0 z-40 md:hidden"
        style={{ paddingBottom: "var(--sab)" }}
        aria-label="Primary"
      >
        <div className="mx-4 mb-2 glass rounded-2xl border border-ink-100/50 dark:border-ink-800/50 shadow-lift overflow-hidden">
          <ul className="flex items-center justify-around h-[calc(var(--mobile-nav-height)-16px)] px-2">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <FeatureGate key={item.href} featureKey={item.featureKey}>
                  <li className="flex-1">
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={clsx(
                        "flex flex-col items-center justify-center gap-1 h-full rounded-xl transition-colors duration-200 ease-swift",
                        isActive
                          ? "text-brand bg-brand/5"
                          : "text-ink-400 hover:text-ink-600 dark:hover:text-ink-200"
                      )}
                    >
                      <Icon icon={item.icon} size={20} strokeWidth={isActive ? 2.5 : 1.75} />
                      <span className="text-[10px] font-semibold">{t(item.labelKey)}</span>
                    </Link>
                  </li>
                </FeatureGate>
              );
            })}
          </ul>
        </div>
      </nav>
    </FeatureGate>
  );
}
