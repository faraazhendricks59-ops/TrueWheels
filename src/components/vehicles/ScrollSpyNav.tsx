"use client";

import { useCallback, useEffect, useState } from "react";
import { clsx } from "clsx";
import { FeatureGate } from "@/components/feature/FeatureGate";
import type { TranslationKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/components/providers/I18nProvider";

/**
 * The sections of the vehicle page, in the order they appear.
 *
 * These ids must match the `id` attributes rendered by VehicleDetail. They are
 * listed here rather than passed in so a rename shows up as a dead anchor that
 * this component can skip, instead of a crash. `SECTIONS` is the contract; the
 * page is responsible for honouring it.
 */
export const VDP_SECTIONS = [
  { id: "gallery", labelKey: "vdp.section_gallery" },
  { id: "overview", labelKey: "vdp.section_overview" },
  { id: "specs", labelKey: "vdp.section_specs" },
  { id: "finance", labelKey: "vdp.section_finance" },
  { id: "seller", labelKey: "vdp.section_seller" },
] as const satisfies readonly { id: string; labelKey: TranslationKey }[];

/**
 * A section rail for the vehicle page.
 *
 * Two corrections to the brief. It rendered its own `<div className="sticky">`
 * directly beneath a header that is already `fixed`, so the rail would have
 * floated at the top of the document rather than below the header, and it
 * assumed 80px of offset while the header is 4rem plus a safe-area inset. This
 * rail is placed in the document flow by the page and scrolls away, which is
 * what a page of this length needs: the sticky mobile action bar already
 * occupies the one fixed slot worth having.
 *
 * The observer watches the real sections. The brief's list included ids the page
 * never rendered, so most of its tabs did nothing when clicked.
 */
export function ScrollSpyNav({ className }: { className?: string }) {
  const { t } = useTranslation();
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const targets = VDP_SECTIONS.map((section) => document.getElementById(section.id)).filter(
      (element): element is HTMLElement => element !== null,
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // A band near the top of the viewport decides the active section, so the
      // highlight changes as a section reaches reading position rather than when
      // it merely appears at the bottom edge.
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const headerHeight =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) ||
      64;
    const top = element.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }, []);

  return (
    <FeatureGate featureKey="vdp.scroll_spy">
      <nav
        aria-label={t("vdp.sections_nav")}
        className={clsx(
          "hidden lg:flex items-center gap-1 overflow-x-auto rounded-xl border border-ink-100 dark:border-ink-800 bg-white/80 dark:bg-ink-900/80 backdrop-blur-md px-2 py-1.5",
          className,
        )}
      >
        {VDP_SECTIONS.map((section) => {
          const isActive = active === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollTo(section.id)}
              aria-current={isActive ? "true" : undefined}
              className={clsx(
                "min-h-[36px] px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors",
                isActive
                  ? "text-brand-700 dark:text-brand-400 bg-brand/10"
                  : "text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-50 dark:hover:bg-ink-800",
              )}
            >
              {t(section.labelKey)}
            </button>
          );
        })}
      </nav>
    </FeatureGate>
  );
}
