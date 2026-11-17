"use client";

import { Sheet } from "@/components/ui/Sheet";
import { useTranslation } from "@/components/providers/I18nProvider";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { AIOmnibox } from "@/components/search/AIOmnibox";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

const LINKS: { href: string; key: TranslationKey }[] = [
  { href: "/marketplace", key: "nav.marketplace" },
  { href: "/#list", key: "nav.list_vehicle" },
  { href: "/#auctions", key: "nav.auctions" },
  { href: "/#community", key: "nav.community" },
  { href: "/#parts", key: "nav.parts" },
];

export function MobileMenuSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="Menu" side="right">
      {/* Inline search: the header omnibox is hidden below md, so the sheet is
          where a phone reaches search. */}
      <FeatureGate featureKey="ui.omnibox">
        <div className="pb-4">
          <AIOmnibox />
        </div>
      </FeatureGate>
      <nav className="flex flex-col">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="px-1 py-3 text-sm font-medium text-ink-700 dark:text-ink-200 border-b border-ink-100 dark:border-ink-800 hover:text-brand transition-colors"
          >
            {t(link.key)}
          </a>
        ))}
      </nav>
    </Sheet>
  );
}
