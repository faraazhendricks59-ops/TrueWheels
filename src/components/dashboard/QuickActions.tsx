"use client";

import { Plus, Search, MessageSquare, Gavel } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import type { FeatureKey } from "@/lib/feature-flags";

const ACTIONS: { label: string; icon: LucideIcon; featureKey: FeatureKey; variant: "primary" | "secondary" }[] = [
  { label: "List a Vehicle", icon: Plus, featureKey: "dashboard.action_list", variant: "primary" },
  { label: "Saved Searches", icon: Search, featureKey: "dashboard.action_saved", variant: "secondary" },
  { label: "Messages", icon: MessageSquare, featureKey: "dashboard.action_messages", variant: "secondary" },
  { label: "My Bids", icon: Gavel, featureKey: "dashboard.action_bids", variant: "secondary" },
];

export function QuickActions() {
  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6 shadow-lift">
      <h2 className="font-display font-bold text-ink-900 dark:text-white mb-5">Quick actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ACTIONS.map((action) => (
          <SmartButton
            key={action.label}
            featureKey={action.featureKey}
            variant={action.variant}
            className="h-20 w-full flex-col gap-2 !rounded-xl"
          >
            <Icon
              icon={action.icon}
              size={20}
              className={action.variant === "primary" ? "text-white" : "text-ink-600 dark:text-ink-300"}
            />
            <span className="text-xs font-semibold">{action.label}</span>
          </SmartButton>
        ))}
      </div>
    </div>
  );
}
