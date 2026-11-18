"use client";

import { useEffect, useId, useState } from "react";
import { Info, MessageSquare } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Sheet } from "@/components/ui/Sheet";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { useToast } from "@/components/ui/Toast";
import { CommentComposer } from "./CommentComposer";
import { CommentItem } from "./CommentItem";
import { useCommentPagination } from "@/hooks/useCommentPagination";
import {
  buildThread,
  ROLE_DISCLOSURE,
  THREAD_DISCLOSURE,
  threadSize,
  writeReply,
  type CommentNode,
} from "@/lib/comments";

/**
 * The comment thread.
 *
 * Two layout details from the brief are fixed here. The desktop panel rendered
 * with both `hidden lg:block` and `isOpen ? 'block' : 'hidden'`, so the two rules
 * fought and the `block` class won at every width, showing the thread on mobile
 * as well as desktop. The mobile sheet was gated on `window.innerWidth` read
 * during render, which is unavailable on the server and stale after a resize.
 * The panel is now gated on one media query and the sheet on the small breakpoint.
 *
 * A saved reply is genuinely written to this device, so it is still there after a
 * reload, and the save rolls back with an explanation if storage refuses. That is
 * the only real write in this feature, and it is labelled as such.
 */
export function CommentThread({
  isOpen,
  onClose,
  postId,
}: {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}) {
  const { toast } = useToast();
  const { comments, loadMore, hasMore, remaining, addReply, reload } = useCommentPagination(postId);
  const headingId = useId();
  const [isSheet, setIsSheet] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsSheet(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const saveReply = (parentId: string | null, content: string) => {
    const node: CommentNode = {
      id: `r-${Date.now()}`,
      parentId,
      author: { name: "You", handle: "you", roleLabel: "This device" },
      content,
      postedAt: new Date().toISOString(),
      children: [],
    };

    try {
      writeReply(postId, {
        id: node.id,
        parentId,
        content,
        postedAt: node.postedAt,
      });
      addReply(node);
      toast({
        variant: "success",
        title: parentId ? "Reply saved on this device" : "Reply saved on this device",
        description: "Nobody else can see it. TrueWheels has no comment store.",
      });
    } catch {
      toast({
        variant: "error",
        title: "Could not save that",
        description:
          "This browser is not allowing storage, so the reply was not kept. Private browsing blocks it.",
      });
    }
  };

  const shown = threadSize(comments);

  const content = (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-ink-100 dark:border-ink-800">
        <h4 id={headingId} className="text-sm font-bold text-ink-900 dark:text-white flex items-center gap-2">
          <Icon icon={MessageSquare} size={14} className="text-ink-400" />
          {shown} {shown === 1 ? "reply" : "replies"}
          <span className="text-[11px] font-normal text-ink-400">in this thread</span>
        </h4>
      </div>

      <p className="flex gap-2 rounded-xl border border-aurora-blue/20 bg-aurora-blue/5 px-3 py-2.5">
        <Icon icon={Info} size={13} className="text-aurora-blue flex-shrink-0 mt-0.5" />
        <span className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed">
          {THREAD_DISCLOSURE} {ROLE_DISCLOSURE}
        </span>
      </p>

      <CommentComposer onSave={(text) => saveReply(null, text)} />

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={(parentId, text) => saveReply(parentId, text)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="pt-3 border-t border-ink-100 dark:border-ink-800">
          <button
            type="button"
            onClick={loadMore}
            className="w-full min-h-[44px] text-xs font-semibold text-aurora-blue hover:text-brand transition-colors"
          >
            Show more comments ({remaining} remaining)
          </button>
        </div>
      )}
    </div>
  );

  return (
    <FeatureGate featureKey="comments.thread">
      <>
      {/* Desktop: inline under the post. */}
      {isOpen && !isSheet && (
        <div
          role="region"
          aria-labelledby={headingId}
          className="hidden lg:block mt-4 p-5 rounded-2xl border border-ink-100 dark:border-ink-800 bg-ink-50/40 dark:bg-ink-950/40"
        >
          {content}
        </div>
      )}

      {/* Mobile: a sheet. */}
      {isSheet && (
        <Sheet isOpen={isOpen} onClose={onClose} title="Comments" side="bottom">
          {content}
        </Sheet>
      )}
      </>
    </FeatureGate>
  );
}

/** Re-exported so PostCard can build a fresh tree without importing the lib. */
export { buildThread };
