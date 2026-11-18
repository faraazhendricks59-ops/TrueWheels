"use client";

import { FileText } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { NO_GROUP_POSTS } from "@/lib/groups";

/**
 * A group's feed.
 *
 * There is no post store (src/lib/social.ts, NO_POST_STORE) and no way to scope a
 * post to a group, so this renders the honest empty state rather than seeding the
 * group with example posts. The brief supplied one invented post ("Just booked the
 * group track day at Kyalami…") carrying reply, boost and like counts; the counts
 * would be fabricated, and the post would attribute a dated event to a person who
 * does not exist.
 *
 * The composer is deliberately absent. The community feed's composer explains that
 * a post cannot be published; offering one inside a group would imply a publishing
 * path that does not exist, and posting "to" a group that nobody else can see.
 */
export function GroupFeed() {
  return (
    <EmptyState
      icon={FileText}
      title="No group posts"
      description={NO_GROUP_POSTS}
    />
  );
}
