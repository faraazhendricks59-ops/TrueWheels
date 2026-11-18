"use client";

import { MessageSquare, Gavel, Eye, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";

type ActivityType = "message" | "bid" | "view" | "save";

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  subtitle: string;
  time: string;
  isVerified?: boolean;
}

/**
 * This feed used to be four invented events, including "Bid accepted on BMW M3 —
 * you are now the highest bidder at R 1 450 000" carrying a badge reading "Bid
 * verified by the TrueWheels Auction Engine". There is no auction engine and no
 * bid was placed, so the panel told a signed-in user that they had won something
 * and that the platform had confirmed it.
 *
 * There is no activity store to read from, so the feed is empty and says why.
 * A dashboard is the worst place to invent activity, because the reader assumes
 * the events happened to them.
 */
const MOCK_ACTIVITIES: ActivityItem[] = [];

const TYPE_CONFIG: Record<ActivityType, { icon: LucideIcon; color: string }> = {
  message: { icon: MessageSquare, color: "text-aurora-blue" },
  bid: { icon: Gavel, color: "text-brand" },
  view: { icon: Eye, color: "text-ink-400" },
  save: { icon: Heart, color: "text-semantic-error" },
};

export function ActivityFeed() {
  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-lift overflow-hidden">
      <div className="p-5 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between">
        <h2 className="font-display font-bold text-ink-900 dark:text-white">Recent activity</h2>
        <button type="button" className="text-xs font-semibold text-brand hover:underline">
          View all
        </button>
      </div>

      <ul className="divide-y divide-ink-100 dark:divide-ink-800">
        {MOCK_ACTIVITIES.map((item) => {
          const { icon, color } = TYPE_CONFIG[item.type];
          return (
            <li
              key={item.id}
              className="p-5 flex items-start gap-4 hover:bg-ink-50/50 dark:hover:bg-ink-950/50 transition-colors"
            >
              <span className={clsx("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-ink-50 dark:bg-ink-800", color)}>
                <Icon icon={icon} size={16} />
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <p className="text-sm font-semibold text-ink-900 dark:text-white truncate">{item.title}</p>
                </div>
                <p className="text-xs text-ink-500 dark:text-ink-300 truncate">{item.subtitle}</p>
              </div>

              <span className="text-[10px] font-medium text-ink-400 whitespace-nowrap">{item.time}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
