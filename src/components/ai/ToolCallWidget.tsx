"use client";

import { Calculator, Search, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import type { ToolCall } from "@/lib/ai-concierge";
import { localeTag } from "@/lib/i18n/locale";

const CONFIG: Record<ToolCall["type"], { icon: typeof Search; label: string; color: string; bg: string }> = {
  search: { icon: Search, label: "Searched the listings", color: "text-aurora-blue", bg: "bg-aurora-blue/10" },
  finance: { icon: Calculator, label: "Calculated the instalment", color: "text-semantic-success", bg: "bg-semantic-success/10" },
  valuation: { icon: Sparkles, label: "Compared similar listings", color: "text-aurora-purple", bg: "bg-aurora-purple/10" },
};

export function ToolCallWidget({ tool }: { tool: ToolCall }) {
  const config = CONFIG[tool.type] ?? CONFIG.search;
  const IconComp = config.icon;

  return (
    <div className="w-full max-w-[300px] p-3 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 flex items-center gap-3">
      <span className={clsx("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", config.bg, config.color)}>
        <Icon icon={IconComp} size={14} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-xs font-bold text-ink-900 dark:text-white">{tool.label}</span>
        <span className="block text-[10px] text-ink-500 truncate font-mono mt-0.5">{tool.query}</span>
      </span>
      {typeof tool.resultCount === "number" && (
        <Badge variant="spec" tone={tool.resultCount > 0 ? "green" : "ink"}>
          {tool.resultCount.toLocaleString(localeTag("en"))} found
        </Badge>
      )}
    </div>
  );
}
