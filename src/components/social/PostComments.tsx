"use client";

import { MessageCircle, Info } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

/**
 * The reply area on a post.
 *
 * Phase 43 is meant to build the full thread, so this is deliberately the
 * smallest honest version rather than a box that looks like it works. It opens
 * from the Comment button, explains why there is nothing to show, and does not
 * offer a reply field: a field that discards what someone types is the same
 * problem the composer had in Phase 41.
 */
export function PostComments({ postId }: { postId: string }) {
  return (
    <div className="mt-3 rounded-xl border border-ink-100 dark:border-ink-800 bg-ink-50/60 dark:bg-ink-950/60 px-3.5 py-3">
      <p className="flex items-center gap-2 text-[11px] font-semibold text-ink-500 dark:text-ink-400 mb-1.5">
        <Icon icon={MessageCircle} size={12} />
        Replies
      </p>
      <p className="flex gap-2 text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
        <Icon icon={Info} size={12} className="flex-shrink-0 mt-0.5" />
        <span>
          TrueWheels does not store replies, so there is no thread to show for post {postId} and no
          way to add one. A reply box here would accept what you wrote and throw it away.
        </span>
      </p>
    </div>
  );
}
