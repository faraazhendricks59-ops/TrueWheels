"use client";

import { Globe, Check } from "lucide-react";
import { Magnetic } from "@/components/motion/Magnetic";
import { Dropdown, DropdownItem } from "@/components/ui/Floating";
import { Icon } from "@/components/ui/Icon";
import { useTranslation } from "@/components/providers/I18nProvider";
import { SUPPORTED_LOCALES } from "@/lib/i18n/dictionaries";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation();
  const current = SUPPORTED_LOCALES.find((l) => l.code === locale) ?? SUPPORTED_LOCALES[0];

  return (
    <Magnetic strength={0.15}>
      <Dropdown
        label={t("a11y.change_language")}
        trigger={
          <span className="inline-flex items-center gap-1.5 h-10 px-2.5 rounded-xl text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors">
            <Icon icon={Globe} size={16} />
            <span className="text-xs font-semibold uppercase">{current.code}</span>
          </span>
        }
      >
        {SUPPORTED_LOCALES.map((option) => (
          <DropdownItem
            key={option.code}
            selected={option.code === locale}
            onClick={() => setLocale(option.code)}
          >
            <span className="flex-1 text-left">
              {option.label}
              <span className="block text-[10px] text-ink-400">{option.english}</span>
            </span>
            {option.code === locale && <Icon icon={Check} size={14} />}
          </DropdownItem>
        ))}
      </Dropdown>
    </Magnetic>
  );
}
