"use client";

import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useTranslation } from "@/components/providers/I18nProvider";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

const LINKS: { href: string; key: TranslationKey }[] = [
  { href: "#marketplace", key: "nav.marketplace" },
  { href: "#list", key: "nav.list_vehicle" },
  { href: "#auctions", key: "nav.auctions" },
];

export function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-ink-100 dark:border-ink-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Logo size="sm" />
        <div className="flex items-center gap-3">
          <ul className="hidden md:flex items-center gap-6">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-ink-600 dark:text-ink-300 hover:text-brand transition-colors"
                >
                  {t(link.key)}
                </a>
              </li>
            ))}
          </ul>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
