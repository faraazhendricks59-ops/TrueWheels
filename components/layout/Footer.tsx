"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { openConsentPreferences } from "@/lib/legal/cookie-consent";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

const legalLinks: { labelKey: TranslationKey; href: string }[] = [
  { labelKey: "footer.terms", href: "/legal/terms" },
  { labelKey: "footer.privacy", href: "/legal/privacy" },
  { labelKey: "footer.cookies", href: "/legal/cookies" },
  { labelKey: "footer.popia", href: "/legal/popia" },
];

const exploreLinks: { labelKey: TranslationKey; href: string }[] = [
  { labelKey: "nav.marketplace", href: "/marketplace" },
  { labelKey: "nav.auctions", href: "/auctions" },
  { labelKey: "nav.dealers", href: "/dealers" },
  { labelKey: "nav.community", href: "/community" },
  { labelKey: "footer.referrals", href: "/referrals" },
];

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-brand-silver bg-surface-white pb-20 md:pb-0">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2" aria-label="TrueWheels home">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-red text-lg font-bold text-white">T</span>
              <span className="text-lg font-bold tracking-tight text-brand-graphite">
                True<span className="text-brand-red">Wheels</span>
              </span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-neutral-muted">{t("footer.tagline")}</p>
          </div>

          <nav aria-label={t("footer.explore")}>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-subtle">{t("footer.explore")}</h2>
            <ul className="space-y-2">
              {exploreLinks.map(({ labelKey, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-neutral-muted transition-colors hover:text-brand-red">
                    {t(labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("footer.legal")}>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-subtle">{t("footer.legal")}</h2>
            <ul className="space-y-2">
              {legalLinks.map(({ labelKey, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-neutral-muted transition-colors hover:text-brand-red">
                    {t(labelKey)}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={openConsentPreferences}
                  className="text-sm text-neutral-muted transition-colors hover:text-brand-red"
                >
                  {t("footer.manageCookies")}
                </button>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-subtle">{t("footer.contact")}</h2>
            <a href="mailto:privacy@truewheels.co.za" className="text-sm text-neutral-muted transition-colors hover:text-brand-red">
              privacy@truewheels.co.za
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-brand-silver pt-6 text-xs text-neutral-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} TrueWheels. {t("footer.rights")}</p>
          <p>{t("footer.regulator")}</p>
        </div>
      </div>
    </footer>
  );
}
