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
            size="lg"
            className="!rounded-full !h-14 !w-14 !p-0 shadow-glow relative overflow-hidden group"
            aria-label={t("nav.list_vehicle")}
          >
            <span
              className="absolute inset-0 aurora-bg opacity-90 group-hover:opacity-100 transition-opacity"
              aria-hidden="true"
            />
            <span className="relative flex items-center justify-center">
              <Icon icon={Plus} size={24} className="text-white" strokeWidth={2.5} />
            </span>
        </SmartButton>
      </div>
    </div>
  );
}
