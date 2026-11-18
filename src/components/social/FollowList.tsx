"use client";

import { UserCheck, UserPlus, Users } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { Magnetic } from "@/components/motion/Magnetic";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { useOptimistic } from "@/hooks/useOptimistic";

export interface NetworkUser {
  id: string;
  name: string;
  handle: string;
  /** Followers in common with the reader. Only ever a real, counted figure. */
  mutualFollowers: number;
  isFollowing: boolean;
}

interface FollowListProps {
  users: NetworkUser[];
  title: string;
  emptyMessage?: string;
  emptyHint?: string;
}

/**
 * A dense, actionable member list.
 *
 * The component is real: give it members and it renders them with a working
 * follow toggle (persisted per-reader through useOptimistic) and a mutual-follower
 * indicator. The network page passes an empty list, because this project has no
 * accounts, so in practice it shows the empty state.
 *
 * Two things from the brief are deliberately absent:
 *
 *  - The `trustLevel` badges ("Verified Driver — identity & 5+ transactions
 *    verified", "Verified Dealer — CIPC & FICA verified by TrueWheels Admin",
 *    "Certified Mechanic — MIWA & workshop registration verified"). Each asserts a
 *    check against a real register that nothing here performs, and Phase 45 removed
 *    the same badges from the footer, the profile menu and the listing cards. A
 *    verification badge is read as evidence, so it is not restored here.
 *  - The `mutualFollowers` badge is only rendered when the count is greater than
 *    zero, so a row can never imply a shared network it does not have.
 */
export function FollowList({
  users,
  title,
  emptyMessage = "No users to display.",
  emptyHint,
}: FollowListProps) {
  return (
    <section className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between">
        <h2 className="text-sm font-bold text-ink-900 dark:text-white flex items-center gap-2">
          <Icon icon={Users} size={14} className="text-ink-400" />
          {title}
        </h2>
        <span className="text-xs font-mono font-bold text-ink-400 tabular-nums">{users.length}</span>
      </div>

      <div className="divide-y divide-ink-100 dark:divide-ink-800 max-h-[600px] overflow-y-auto">
        {users.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-ink-500 dark:text-ink-400">{emptyMessage}</p>
            {emptyHint && (
              <p className="text-xs text-ink-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
                {emptyHint}
              </p>
            )}
          </div>
        ) : (
          users.map((user) => <FollowRow key={user.id} user={user} />)
        )}
      </div>
    </section>
  );
}

function FollowRow({ user }: { user: NetworkUser }) {
  const follow = useOptimistic(`follow:${user.handle}`, user.isFollowing);

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-ink-50/50 dark:hover:bg-ink-950/50 transition-colors group">
      <a href={`/profile/${user.handle}`} className="relative flex-shrink-0">
        <span className="w-12 h-12 rounded-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-sm font-bold text-ink-600 dark:text-ink-300 ring-2 ring-white dark:ring-ink-900">
          {user.name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? "")
            .join("")}
        </span>
        {user.mutualFollowers > 0 && (
          <span className="absolute -bottom-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-ink-900 dark:bg-white text-white dark:text-ink-900 text-[9px] font-bold flex items-center justify-center border-2 border-white dark:border-ink-900">
            {user.mutualFollowers}
          </span>
        )}
      </a>

      <div className="flex-1 min-w-0">
        <a
          href={`/profile/${user.handle}`}
          className="block text-sm font-bold text-ink-900 dark:text-white truncate hover:underline"
        >
          {user.name}
        </a>
        <p className="text-xs text-ink-500 dark:text-ink-400 truncate">
          @{user.handle}
          {user.mutualFollowers > 0 && (
            <span className="text-ink-400 ml-2">· {user.mutualFollowers} mutual</span>
          )}
        </p>
      </div>

      <FeatureGate featureKey="social.follow_user">
        <Magnetic strength={0.1}>
          <SmartButton
            featureKey="social.follow_toggle"
            variant={follow.isActive ? "secondary" : "outline"}
            size="sm"
            className={clsx("!h-8 !px-4")}
            onClick={follow.toggle}
            leftIcon={follow.isActive ? UserCheck : UserPlus}
            aria-pressed={follow.isActive}
          >
            {follow.isActive ? "Following" : "Follow"}
          </SmartButton>
        </Magnetic>
      </FeatureGate>
    </div>
  );
}
