"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { AlertOctagon, Info, ScrollText, ToggleLeft } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { GOD_MODE_DISCLOSURE } from "@/lib/god-mode-data";
import { FeatureFlagMatrix } from "./FeatureFlagMatrix";
import { KillSwitchPanel } from "./KillSwitchPanel";
import { AuditTrail } from "./AuditTrail";

type Tab = "flags" | "switches" | "audit";

const TABS: { id: Tab; label: string; icon: typeof ToggleLeft }[] = [
  { id: "flags", label: "Feature flags", icon: ToggleLeft },
  { id: "switches", label: "Kill switches", icon: AlertOctagon },
  { id: "audit", label: "Audit trail", icon: ScrollText },
];

/**
 * The console shell.
 *
 * The brief's shell carried an environment selector (Production / Staging / Preview)
 * and sidebar links to five sub-routes. There is one build with one set of constants,
 * so an environment selector would switch a label and nothing else, and the sub-routes
 * do not exist. Both are removed rather than faked; the three panels are tabs on one
 * page, which is what the content actually is.
 */
export function GodModeConsole() {
  const [tab, setTab] = useState<Tab>("flags");

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-aurora-blue/5 border border-aurora-blue/20 flex items-start gap-3">
        <Icon icon={Info} size={16} className="text-aurora-blue mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-ink-900 dark:text-white">
            Read-only: flags are set in code, not in a database
          </p>
          <p className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed mt-1">
            {GOD_MODE_DISCLOSURE}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Console sections">
        {TABS.map((item) => {
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(item.id)}
              className={clsx(
                "inline-flex items-center gap-2 min-h-[40px] px-4 rounded-xl text-sm font-semibold transition-colors border",
                isActive
                  ? "bg-brand/10 border-brand/30 text-brand"
                  : "border-ink-100 dark:border-ink-800 text-ink-600 dark:text-ink-300 hover:border-brand/30"
              )}
            >
              <Icon icon={item.icon} size={15} />
              {item.label}
            </button>
          );
        })}
        <span className="inline-flex items-center ml-auto">
          <Badge variant="status" tone="ink">
            No runtime control
          </Badge>
        </span>
      </div>

      <div role="tabpanel">
        {tab === "flags" && <FeatureFlagMatrix />}
        {tab === "switches" && <KillSwitchPanel />}
        {tab === "audit" && <AuditTrail />}
      </div>
    </div>
  );
}
