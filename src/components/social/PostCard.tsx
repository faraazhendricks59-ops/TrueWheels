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
    <article className="relative border-b border-ink-100 px-4 py-3 transition-colors hover:bg-ink-50/60 dark:border-ink-800 dark:hover:bg-ink-950/40">
      <div className="flex gap-3">
        <div
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-ink-100 text-xs font-bold text-ink-500 dark:bg-ink-800 dark:text-ink-300"
          aria-hidden="true"
        >
          {initialsFor(post.authorName)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <span className="text-sm font-bold text-ink-900 dark:text-white">
              {post.authorName}
            </span>
            <span className="text-sm text-ink-400 dark:text-ink-300">@{post.authorHandle}</span>
            <span className="text-ink-300" aria-hidden="true">
              ·
            </span>
            <time dateTime={post.postedAt} className="text-sm text-ink-400 hover:underline dark:text-ink-300">
              {posted}
            </time>
            <span className="ml-1 inline-flex items-center rounded-full border border-ink-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-400 dark:border-ink-700 dark:text-ink-300">
              Example
            </span>
          </div>

          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-ink-800 dark:text-ink-100">
            {post.content.split(/(#[a-zA-Z0-9_]+)/g).map((part, index) =>
              part.startsWith("#") ? (
                // Not a link: there are no topic pages, so a link would go
                // nowhere. It is emphasised because it is a topic tag.
                <span key={index} className="font-medium text-aurora-blue dark:text-aurora-blue-light">
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
