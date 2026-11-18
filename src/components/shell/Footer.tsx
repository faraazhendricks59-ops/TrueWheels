"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { SmartButton } from "@/components/ui/SmartButton";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/ui/Toast";
import { useTranslation } from "@/components/providers/I18nProvider";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

/**
 * Links point only at routes that exist. Destinations that are not built yet
 * (/sell, /about, /help, ...) are marked as planned and render as plain text,
 * so the footer never sends a visitor to a 404.
 */
const FOOTER_GROUPS: {
  title: string;
  links: { label: string; href?: string; key?: TranslationKey }[];
}[] = [
  {
    title: "Marketplace",
    links: [
      { label: "Browse listings", href: "/marketplace" },
      { label: "Sell a car", key: "nav.list_vehicle" },
      { label: "Live auctions" },
      { label: "Parts & spares" },
    ],
  },
  {
    title: "Company",
    links: [{ label: "About TrueWheels" }, { label: "Careers" }, { label: "Press & media" }, { label: "Become a dealer" }],
  },
  {
    title: "Support",
    links: [{ label: "Help centre" }, { label: "Safety & scams" }, { label: "Contact us" }, { label: "Report a bug" }],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "POPIA Statement", href: "/legal/popia" },
      { label: "Cookie Policy", href: "/legal/cookies" },
    ],
  },
];

export function Footer() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      variant: "success",
      title: "Almost there",
      description: `We'll confirm ${email} before sending any market alerts.`,
    });
    setEmail("");
  };

  return (
    <footer className="bg-ink-950 text-ink-300 pt-16 pb-8 border-t border-ink-800">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2 lg:col-span-1">
            <Logo size="sm" className="mb-4 [&_.tw-t]:text-white" />
            <p className="text-sm text-ink-400 leading-relaxed mb-6 max-w-xs">
              The Automotive Operating System. Search, buy, sell, bid and connect in South
              Africa&apos;s most trusted vehicle ecosystem.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1.5 rounded-lg bg-ink-900 border border-ink-800 text-[10px] font-semibold text-ink-300 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-semantic-success" aria-hidden="true" />
                POPIA compliant
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-ink-900 border border-ink-800 text-[10px] font-semibold text-ink-300 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-aurora-blue" aria-hidden="true" />
                AI verified
              </span>
            </div>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4">{group.title}</h2>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      // inline-block with vertical padding so the touch target
                      // clears 24px; a bare text link is only ~17px tall.
                      <a
                        href={link.href}
                        className="inline-block py-1.5 text-sm text-ink-400 hover:text-brand transition-colors"
                      >
                        {link.key ? t(link.key) : link.label}
                      </a>
                    ) : (
                      <span className="text-sm text-ink-600" title="Coming soon">
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="pt-8 border-t border-ink-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-ink-500">
            © {new Date().getFullYear()} TrueWheels (Pty) Ltd. All rights reserved.
          </p>

          <FeatureGate featureKey="marketing.newsletter_footer">
            <form onSubmit={subscribe} className="flex items-center gap-2 w-full md:w-auto max-w-sm">
              <div className="relative flex-1">
                <Icon
                  icon={Mail}
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none"
                />
                <label htmlFor="footer-newsletter" className="sr-only">
                  Email address for market alerts
                </label>
                <input
                  id="footer-newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Get market alerts"
                  className="w-full h-9 pl-9 pr-3 rounded-lg bg-ink-900 border border-ink-800 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-brand transition-colors"
                />
              </div>
              <SmartButton featureKey="marketing.newsletter_submit" size="sm" type="submit">
                Subscribe
              </SmartButton>
            </form>
          </FeatureGate>
        </div>
      </div>
    </footer>
  );
}
