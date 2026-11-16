"use client";

import { Search } from "lucide-react";
import { useCommandPalette } from "@/components/providers/CommandPaletteProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";

/** Header search affordance that opens the command palette. */
export function CommandPaletteTrigger() {
  const { open } = useCommandPalette();
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={open}
      aria-label={`${t("action.search")} (Command K)`}
      className="flex items-center gap-2 rounded-lg border border-brand-silver bg-surface-grey px-3 py-2 text-sm text-neutral-muted transition-colors hover:border-neutral-strong hover:text-brand-graphite"
    >
      <Search size={16} aria-hidden="true" />
      <span className="hidden lg:inline">{t("action.search")}...</span>
      <kbd className="hidden rounded border border-brand-silver bg-surface-white px-1.5 py-0.5 text-[10px] lg:inline">
        ⌘K
      </kbd>
    </button>
  );
}
