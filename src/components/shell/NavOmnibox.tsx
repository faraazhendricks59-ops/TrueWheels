"use client";

import { Search, Command } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { COMMAND_PALETTE_OPEN_EVENT } from "@/components/command/CommandPalette";

/** Search entry point that opens the command palette. */
export function NavOmnibox() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(COMMAND_PALETTE_OPEN_EVENT))}
      aria-keyshortcuts="Meta+K Control+K"
      className="w-full h-10 flex items-center gap-3 px-4 rounded-full bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 shadow-sm hover:shadow-md hover:border-ink-200 dark:hover:border-ink-700 transition-all ease-swift group text-left"
    >
      <Icon icon={Search} size={16} className="text-ink-400 group-hover:text-brand transition-colors" />
      <span className="flex-1 text-sm text-ink-400 truncate">Search make, model, or keyword...</span>
      <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md bg-ink-50 dark:bg-ink-800 border border-ink-100 dark:border-ink-700">
        <Icon icon={Command} size={10} className="text-ink-400" />
        <span className="text-[10px] font-mono font-semibold text-ink-400">K</span>
      </span>
    </button>
  );
}
