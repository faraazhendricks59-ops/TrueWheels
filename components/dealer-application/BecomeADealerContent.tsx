"use client";

import { useTranslation } from "@/components/providers/LanguageProvider";
import { DealerApplicationForm } from "./DealerApplicationForm";

/**
 * Hero copy lives here rather than in the route so it can be translated: the
 * route stays a server component in order to export metadata, and server
 * components cannot use the client-side translation hook.
 */
export function BecomeADealerContent() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-surface-grey">
      <div className="px-4 py-10">
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-brand-graphite">
            {t("dealer.pageTitle")}
          </h1>
          <p className="mx-auto max-w-lg text-neutral-muted">{t("dealer.pageSubtitle")}</p>
        </div>
        <DealerApplicationForm />
      </div>
    </div>
  );
}
