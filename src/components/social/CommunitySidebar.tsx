"use client";

import { TrendingUp, Calendar, Users } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SIDEBAR_DISCLOSURE } from "@/lib/social";

const BLOCKS = [
  { icon: TrendingUp, heading: "Trending topics", body: SIDEBAR_DISCLOSURE[0] },
  { icon: Calendar, heading: "Meets and events", body: SIDEBAR_DISCLOSURE[1] },
  { icon: Users, heading: "Who to follow", body: SIDEBAR_DISCLOSURE[2] },
];

/**
 * The right column of the community page.
 *
 * The brief filled this with trending hashtags whose counts came from
 * Math.random(), two meets with RSVP numbers, and two accounts to follow. A
 * random number is not a trend, and it changes on every render, so two visitors
 * looking at the same topic would see different figures. The meets were invented,
 * and a fake RSVP count could send someone to a venue on the wrong date. The
 * accounts would have been fabricated people presented as real members.
 *
 * Rather than invent three panels, this states what is not available and what to
 * do instead. It is the honest version of an empty column.
 */
export function CommunitySidebar() {
  return (
    <div className="space-y-4">
      {BLOCKS.map((block) => (
        <div
          key={block.heading}
          className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5"
        >
          <h3 className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <Icon icon={block.icon} size={14} /> {block.heading}
          </h3>
          <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">{block.body}</p>
        </div>
      ))}
    </div>
  );
}
