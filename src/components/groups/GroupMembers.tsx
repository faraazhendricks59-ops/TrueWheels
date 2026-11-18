"use client";

import { Crown } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { NO_GROUP_MEMBERS } from "@/lib/groups";

/**
 * The member directory.
 *
 * The brief supplied a list of named people with avatars, join dates and admin or
 * moderator roles. There are no accounts in this project (src/lib/profile.ts,
 * NO_FOLLOW_GRAPH), so every one of those would be a fabricated person holding
 * fabricated authority over a group that does not exist.
 *
 * The only real member is the reader, who is the admin by virtue of having created
 * the group on this device. Their name comes from the session, not from a constant,
 * and no avatar photograph is used — initials stand in, as they do in the community
 * feed.
 */
export function GroupMembers({ ownerName }: { ownerName: string }) {
  return (
    <Reveal variant="up" delay={100}>
      <section className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-ink-100 dark:border-ink-800">
          <h2 className="text-sm font-bold text-ink-900 dark:text-white">Members (1)</h2>
        </div>

        <p className="px-5 pt-3 text-[11px] text-ink-400 leading-relaxed">{NO_GROUP_MEMBERS}</p>

        <div className="mt-3">
          <div className="px-5 py-2 bg-ink-50 dark:bg-ink-950 border-b border-ink-100 dark:border-ink-800">
            <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider">Admins (1)</p>
          </div>

          <div className="flex items-center gap-4 p-4">
            <span className="w-10 h-10 rounded-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-sm font-bold text-ink-600 dark:text-ink-300 flex-shrink-0">
              {ownerName
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase() ?? "")
                .join("")}
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-bold text-ink-900 dark:text-white truncate">
                  {ownerName}
                </span>
                <Badge variant="status" className="!h-5 !text-[9px] bg-semantic-warning/10 text-semantic-warning">
                  <Icon icon={Crown} size={8} />
                  Admin
                </Badge>
              </div>
              <p className="text-xs text-ink-500 dark:text-ink-400 truncate">
                You — the only member of this group
              </p>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
