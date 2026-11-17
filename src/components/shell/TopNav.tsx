"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Menu } from "lucide-react";
import { useScrollFrost } from "@/hooks/useScrollFrost";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { useTranslation } from "@/components/providers/I18nProvider";
import type { TranslationKey } from "@/lib/i18n/dictionaries";
import { NavOmnibox } from "./NavOmnibox";
import { AIPill } from "./AIPill";
import { ProfileMenu } from "./ProfileMenu";
import { RoleAwareNav } from "./RoleAwareNav";
import { NotificationBell } from "./NotificationBell";
import { MobileMenuSheet } from "./MobileMenuSheet";

const DESKTOP_LINKS: { href: string; key: TranslationKey }[] = [
  { href: "/marketplace", key: "nav.marketplace" },
  { href: "/#auctions", key: "nav.auctions" },
  { href: "/#community", key: "nav.community" },
  { href: "/#parts", key: "nav.parts" },
];

export function TopNav() {
  const isScrolled = useScrollFrost(20);
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={clsx(
        "fixed top-0 inset-x-0 z-40 h-[var(--header-height)] flex items-center px-4 md:px-6 lg:px-8",
        "transition-colors duration-300 ease-swift",
        isScrolled
          ? "glass border-b border-ink-100/60 dark:border-ink-800/60"
          : "bg-transparent border-b border-transparent"
      )}
      style={{ paddingTop: "var(--sat)" }}
    >
      <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between gap-4 lg:gap-6">
        <div className="flex items-center gap-8 flex-shrink-0">
          <Logo size="sm" />

          <nav className="hidden lg:flex items-center gap-6" aria-label="Main">
            {DESKTOP_LINKS.map((link) => (
              <FeatureGate key={link.href} featureKey={link.key as "nav.marketplace"}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-ink-600 dark:text-ink-300 hover:text-brand transition-colors"
                >
                  {t(link.key)}
                </a>
              </FeatureGate>
            ))}
            {/* Tier-specific destinations, shown only when the viewer holds the
                role. Public links above stay visible for everyone. */}
            <RoleAwareNav variant="topnav" />
          </nav>
        </div>

        <div className="flex-1 max-w-2xl hidden md:block">
          <FeatureGate featureKey="ui.omnibox">
            <NavOmnibox />
          </FeatureGate>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <FeatureGate featureKey="ui.ai_pill">
            <AIPill />
          </FeatureGate>

          <span className="lg:hidden">
            <SmartButton
              featureKey="ui.mobile_menu"
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Icon icon={Menu} size={18} />
            </SmartButton>
          </span>

          <FeatureGate featureKey="ui.profile_menu">
            <NotificationBell />
            <ProfileMenu />
          </FeatureGate>
        </div>
      </div>

      <MobileMenuSheet isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
