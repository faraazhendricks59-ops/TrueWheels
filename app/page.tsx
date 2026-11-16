"use client";

import { useTranslation } from "@/components/providers/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

const pillars: { titleKey: TranslationKey; textKey: TranslationKey }[] = [
  { titleKey: "home.pillar.discover", textKey: "home.pillar.discoverText" },
  { titleKey: "home.pillar.buySell", textKey: "home.pillar.buySellText" },
  { titleKey: "home.pillar.own", textKey: "home.pillar.ownText" },
];

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-center px-6 py-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-brand-red">{t("home.eyebrow")}</p>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-brand-graphite sm:text-6xl">
            {t("home.title")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-muted sm:text-xl">
            {t("home.subtitle")}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button className="rounded-lg bg-brand-red px-6 py-3 font-semibold text-white shadow-card transition hover:bg-brand-red-dark">{t("home.explore")}</button>
            <button className="rounded-lg border border-brand-silver bg-surface-white px-6 py-3 font-semibold text-brand-graphite shadow-card transition hover:shadow-card-hover">{t("home.listVehicle")}</button>
          </div>
        </div>
        <div className="mt-20 grid gap-4 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.titleKey} className="rounded-xl bg-surface-white p-6 shadow-card">
              <h2 className="text-xl font-bold tracking-tight">{t(pillar.titleKey)}</h2>
              <p className="mt-2 leading-relaxed text-neutral-muted">{t(pillar.textKey)}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
