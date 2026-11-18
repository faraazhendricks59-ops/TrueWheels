"use client";

import { useState } from "react";
import { VehicleEmbed } from "./VehicleEmbed";
import { ActionBar } from "./ActionBar";
import { CommentThread } from "./CommentThread";
import { PostShareSheet } from "./PostShareSheet";
import { initialsFor, vehicleForPost, type CommunityPost } from "@/lib/social";
import { localeTag } from "@/lib/i18n/locale";

/**
 * A post in the community feed.
 *
 * Three things the brief asked for are not here, because each would have been a
 * claim rather than a decoration:
 *
 *  - The "Verified Driver" badge, which asserted "Completed 5+ transactions.
 *    Identity verified." There is no transaction history and no identity check,
 *    so the badge would have told a buyer that a stranger had been vetted by us.
 *    That is the most harmful thing in this brief: it is the badge a buyer would
 *    rely on before sending money to someone they have never met.
 *  - Reply, boost and rev counts. Nothing records them, and a count of zero is
 *    also a claim.
 *  - The overflow menu. Its only honest options would be "report" and "copy
 *    link", and there is no moderation queue for a report to reach.
 *
 * Every seeded post carries a visible "Demo post" label, so a reader cannot
 * mistake the example feed for a room full of members.
 */
export function PostCard({ post }: { post: CommunityPost }) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const vehicle = vehicleForPost(post);
  // An absolute date, not "2h ago": a relative label is computed from the
  // current time, so the server and the browser would disagree and React would
  // report a hydration mismatch.
  const posted = new Intl.DateTimeFormat(localeTag("en"), {
    day: "numeric",
    month: "short",
  }).format(new Date(post.postedAt));

  return (
    <article className="bg-white dark:bg-ink-900 border-b border-ink-100 dark:border-ink-800 p-5">
      <div className="flex gap-3">
        <div
          className="w-11 h-11 rounded-full bg-ink-100 dark:bg-ink-800 flex-shrink-0 flex items-center justify-center text-xs font-bold text-ink-500 dark:text-ink-300"
          aria-hidden="true"
        >
          {initialsFor(post.authorName)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-x-2 gap-y-0.5 flex-wrap mb-1.5">
            <span className="font-bold text-sm text-ink-900 dark:text-white">
              {post.authorName}
            </span>
            <span className="text-xs text-ink-400">@{post.authorHandle}</span>
            <span className="text-ink-300" aria-hidden="true">
              ·
            </span>
            <time dateTime={post.postedAt} className="text-xs text-ink-400">
              {posted}
            </time>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-ink-400 border border-ink-200 dark:border-ink-700 rounded-full px-2 py-0.5">
              Demo post
            </span>
          </div>

          <p className="text-[15px] text-ink-700 dark:text-ink-200 leading-relaxed whitespace-pre-wrap">
            {post.content.split(/(#[a-zA-Z0-9_]+)/g).map((part, index) =>
              part.startsWith("#") ? (
                // Not a link: there are no topic pages, so a link would go
                // nowhere. It is emphasised because it is a topic tag.
                <span key={index} className="text-aurora-blue font-medium">
                  {part}
                </span>
              ) : (
                <span key={index}>{part}</span>
              ),
            )}
          </p>

          {vehicle && <VehicleEmbed vehicle={vehicle} />}

          <ActionBar
            postId={post.id}
            isCommentsOpen={isCommentsOpen}
            onOpenComments={() => setIsCommentsOpen((open) => !open)}
            onOpenShare={() => setIsShareOpen(true)}
          />

          <CommentThread
            isOpen={isCommentsOpen}
            onClose={() => setIsCommentsOpen(false)}
            postId={post.id}
          />
        </div>
      </div>

      <PostShareSheet isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} post={post} />
    </article>
  );
}
