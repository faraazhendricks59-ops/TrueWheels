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
    <div className="mt-3 flex items-center justify-between max-w-md -ml-2">
      <FeatureGate featureKey="social.action_comment">
        <button
          type="button"
          onClick={onOpenComments}
          aria-expanded={isCommentsOpen}
          aria-label="Show replies"
          className="group/act flex items-center gap-1 rounded-full p-1.5 text-ink-400 transition-colors hover:text-aurora-blue"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full transition-colors group-hover/act:bg-aurora-blue/10">
            <Icon icon={MessageCircle} size={16} />
          </span>
          <span className="hidden text-xs font-medium sm:inline">Replies</span>
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
            "group/act flex items-center gap-1 rounded-full p-1.5 transition-colors",
            boost.isActive ? "text-semantic-success" : "text-ink-400 hover:text-semantic-success",
          )}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full transition-colors group-hover/act:bg-semantic-success/10">
            <Icon icon={Repeat2} size={16} strokeWidth={boost.isActive ? 2.5 : 1.75} />
          </span>
          <span className={clsx("hidden text-xs font-medium sm:inline", boost.isActive && "font-bold")}>
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
          className="group/act flex items-center gap-1 rounded-full p-1.5 text-ink-400 transition-colors hover:text-aurora-purple"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full transition-colors group-hover/act:bg-aurora-purple/10">
            <Icon icon={Share2} size={16} />
          </span>
          <span className="hidden text-xs font-medium sm:inline">Share</span>
        </button>
      </FeatureGate>
    </div>
  );
}
