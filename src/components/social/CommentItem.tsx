"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Reply } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { CommentComposer } from "./CommentComposer";
import { countReplies, type CommentNode } from "@/lib/comments";
import { localeTag } from "@/lib/i18n/locale";

/**
 * One comment.
 *
 * The trust badges are gone. The brief attached "Verified Driver", "Certified
 * Mechanic" and "Verified Dealer" to each author, with a source line reading
 * "Identity verified via CIPC/FICA" for dealers. CIPC registers companies and
 * FICA obliges accountable institutions to identify their clients. TrueWheels is
 * neither, and has verified nobody, so the badge would claim a check by two real
 * regulators we have no relationship with. A dealer badge is the one a buyer
 * leans on hardest.
 *
 * The like button is gone as well. Nothing records how many people liked a
 * comment, so the count would be invented, and the brief's own like path could
 * never fail, which means a wrong count could never be corrected.
 *
 * The report button is gone because there is no moderation queue for a report to
 * reach. A "Report submitted" toast promising review "within 24 hours" would be
 * a promise about a process that does not exist. That is stated in the thread
 * header instead of hidden behind a button.
 *
 * Nesting is capped at two levels: a reply to a reply attaches to the same
 * parent rather than opening a third level, which is what the brief's depth
 * cap implied but did not implement.
 */
export function CommentItem({
  comment,
  depth = 0,
  onReply,
}: {
  comment: CommentNode;
  depth?: number;
  onReply: (parentId: string, content: string) => void;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const replyCount = countReplies(comment);
  const hasChildren = comment.children.length > 0;
  const isExample = comment.author.roleLabel.includes("example");
  // Absolute, because a relative label is computed from the current time and
  // would differ between the server and the browser.
  const posted = new Intl.DateTimeFormat(localeTag("en"), {
    day: "numeric",
    month: "short",
  }).format(new Date(comment.postedAt));

  // A reply to a reply attaches to the same top-level parent.
  const replyTarget = depth === 0 ? comment.id : (comment.parentId ?? comment.id);

  return (
    <div className={clsx("relative", depth > 0 && "mt-3")}>
      <div className="flex gap-3">
        <div className="flex flex-col items-center flex-shrink-0">
          <div
            className="w-8 h-8 rounded-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-[10px] font-bold text-ink-500 dark:text-ink-300"
            aria-hidden="true"
          >
            {initials(comment.author.name)}
          </div>
          {/* Thread connector: only when there is something below to connect to. */}
          {hasChildren && !isCollapsed && (
            <span className="w-px flex-1 mt-1.5 bg-ink-100 dark:bg-ink-800" aria-hidden="true" />
          )}
        </div>

        <div className="flex-1 min-w-0 pb-1">
          <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5 mb-1">
            <span className="text-sm font-bold text-ink-900 dark:text-white">
              {comment.author.name}
            </span>
            <span className="text-xs text-ink-400">@{comment.author.handle}</span>
            <span className="text-ink-300" aria-hidden="true">
              ·
            </span>
            <span className="text-xs text-ink-400">{posted}</span>
            {isExample && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-400 bg-ink-100 dark:bg-ink-800 rounded px-1.5 py-0.5">
                {comment.author.roleLabel}
              </span>
            )}
          </div>

          <p className="text-sm text-ink-700 dark:text-ink-200 leading-relaxed mb-2">
            {renderContent(comment.content)}
          </p>

          <div className="flex items-center gap-1 -ml-2">
            <button
              type="button"
              onClick={() => setIsReplying((open) => !open)}
              aria-expanded={isReplying}
              aria-label={`Reply to ${comment.author.name}`}
              className="flex items-center gap-1.5 min-h-[36px] px-2.5 rounded-full text-xs font-medium text-ink-400 hover:text-aurora-blue hover:bg-aurora-blue/5 transition-colors"
            >
              <Icon icon={Reply} size={13} />
              Reply
            </button>
          </div>

          {isReplying && (
            <div className="mt-3">
              <CommentComposer
                isReply
                autoFocus
                replyToHandle={comment.author.handle}
                onSave={(content) => {
                  onReply(replyTarget, content);
                  setIsReplying(false);
                }}
                onCancel={() => setIsReplying(false)}
              />
            </div>
          )}

          {hasChildren && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setIsCollapsed((collapsed) => !collapsed)}
                aria-expanded={!isCollapsed}
                className="flex items-center gap-1.5 min-h-[32px] text-xs font-semibold text-aurora-blue hover:underline"
              >
                <Icon icon={isCollapsed ? ChevronDown : ChevronUp} size={12} />
                {isCollapsed
                  ? `Show ${replyCount} ${replyCount === 1 ? "reply" : "replies"}`
                  : "Hide replies"}
              </button>

              {!isCollapsed && (
                <div className="mt-2">
                  {comment.children.map((child) => (
                    <CommentItem
                      key={child.id}
                      comment={child}
                      depth={depth + 1}
                      onReply={onReply}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

/**
 * Highlights @names and #tags.
 *
 * The brief made these clickable, with a pointer cursor and an underline on
 * hover, but gave them no destination. There is no member directory and no tag
 * index, so a link would go nowhere. They are highlighted, not linked.
 */
function renderContent(text: string) {
  const parts = text.split(/(@[a-zA-Z0-9_]+|#[a-zA-Z0-9_]+)/g);
  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      return (
        <span key={index} className="text-aurora-blue font-medium">
          {part}
        </span>
      );
    }
    if (part.startsWith("#")) {
      return (
        <span key={index} className="text-aurora-purple font-medium">
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

/** Kept for the thread header, which needs the same total. */
export function totalReplies(nodes: CommentNode[]): number {
  return nodes.reduce((sum, node) => sum + countReplies(node), 0);
}
