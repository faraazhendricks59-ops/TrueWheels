"use client";

import { MessageCircle, Repeat2, Share2 } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { ReactionButton } from "./ReactionButton";
import { useOptimistic } from "@/hooks/useOptimistic";

/**
 * The interaction row on a post.
 *
 * Every control here records only the reader's own action, on their own device.
 * There is no server, so nothing is sent and nobody else's rev or boost is
 * counted. That is why the brief's reply, boost and rev numbers are absent
 * rather than shown as zero: a count is a claim about other people, and there is
 * no record of other people.
 *
 * The brief also wanted a Comment button opening a thread and a Boost button
 * that "reposts". Neither can work: there are no replies stored and no feed to
 * repost into. Comment opens an explanation, and Boost is a plain bookmark of
 * your own interest, labelled so.
 */
export function ActionBar({
  postId,
  onOpenComments,
  onOpenShare,
  isCommentsOpen,
}: {
  postId: string;
  onOpenComments: () => void;
  onOpenShare: () => void;
  isCommentsOpen: boolean;
}) {
  const rev = useOptimistic(`rev:${postId}`, false);
  const boost = useOptimistic(`boost:${postId}`, false);

  return (
    <div className="flex items-center gap-1 mt-3 pt-3 border-t border-ink-100 dark:border-ink-800">
      <FeatureGate featureKey="social.action_comment">
        <button
          type="button"
          onClick={onOpenComments}
          aria-expanded={isCommentsOpen}
          aria-label="Show replies"
          className="flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] px-2 sm:px-2.5 rounded-full text-ink-400 hover:text-aurora-blue hover:bg-aurora-blue/5 transition-colors"
        >
          <Icon icon={MessageCircle} size={16} />
          <span className="hidden sm:inline text-xs font-medium">Replies</span>
        </button>
      </FeatureGate>

      <FeatureGate featureKey="social.action_boost">
        <button
          type="button"
          onClick={boost.toggle}
          disabled={boost.isPending}
          aria-pressed={boost.isActive}
          aria-label={boost.isActive ? "Remove this from your boosts" : "Boost this post"}
          className={clsx(
            "flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] px-2 sm:px-2.5 rounded-full transition-colors",
            boost.isActive
              ? "text-semantic-success"
              : "text-ink-400 hover:text-semantic-success hover:bg-semantic-success/5",
          )}
        >
          <Icon icon={Repeat2} size={16} strokeWidth={boost.isActive ? 2.5 : 1.75} />
          <span className={clsx("hidden sm:inline text-xs font-medium", boost.isActive && "font-bold")}>
            {boost.isActive ? "Boosted" : "Boost"}
          </span>
        </button>
      </FeatureGate>

      <ReactionButton
        storageKey={`rev:${postId}`}
        initiallyActive={false}
        isActive={rev.isActive}
        isPending={rev.isPending}
        onToggle={rev.toggle}
      />

      <FeatureGate featureKey="social.action_share">
        <button
          type="button"
          onClick={onOpenShare}
          aria-label="Share this post"
          className="flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] px-2 sm:px-2.5 rounded-full text-ink-400 hover:text-aurora-purple hover:bg-aurora-purple/5 transition-colors"
        >
          <Icon icon={Share2} size={16} />
          <span className="hidden sm:inline text-xs font-medium">Share</span>
        </button>
      </FeatureGate>
    </div>
  );
}
