"use client";

import { Plus } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { useTranslation } from "@/components/providers/I18nProvider";

export function FloatingActionButton() {
  const { t } = useTranslation();

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 md:hidden flex justify-center pointer-events-none"
      style={{ paddingBottom: "var(--sab)" }}
    >
      <div className="pointer-events-auto mb-[calc(var(--mobile-nav-height)+12px)]">
        <SmartButton
            featureKey="listings.create"
            data-tour="fab-list-vehicle"
            size="lg"
            className="!h-14 !w-14 !rounded-full !p-0 shadow-lift"
            aria-label={t("nav.list_vehicle")}
          >
            <span className="flex items-center justify-center">
              <Icon icon={Plus} size={22} className="text-white" strokeWidth={2.5} />
            </span>
        </SmartButton>
      </div>
    </div>
  );
}
