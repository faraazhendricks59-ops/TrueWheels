"use client";

import { useState } from "react";
import { MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { FeatureGate } from "@/components/feature/FeatureGate";

type Vote = "up" | "down";

/**
 * The comment action has no backend yet, so it is offered only when a feedback
 * endpoint exists. Until then the vote is stored on the device, and the copy
 * says so rather than implying the rating was sent anywhere.
 */
export function SearchFeedback({ query }: { query?: string }) {
  const [voted, setVoted] = useState<Vote | null>(null);

  const record = (vote: Vote) => {
    setVoted(vote);
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("truewheels_search_feedback");
      const entries: { query: string; vote: Vote; at: string }[] = raw ? JSON.parse(raw) : [];
      entries.unshift({ query: query ?? "", vote, at: new Date().toISOString() });
      window.localStorage.setItem("truewheels_search_feedback", JSON.stringify(entries.slice(0, 50)));
    } catch {
      // A full or unavailable store should not break the results page.
    }
  };

  if (voted) {
    return (
      <div className="flex items-center justify-center gap-2 py-6 text-xs text-semantic-success font-medium animate-rise">
        <Icon icon={ThumbsUp} size={14} />
        Thanks. Your rating is saved on this device.
      </div>
    );
  }

  return (
    <FeatureGate featureKey="search.feedback_loop">
      <div className="flex flex-col items-center py-8 border-t border-ink-100 dark:border-ink-800 mt-12">
        <p className="text-xs text-ink-500 dark:text-ink-300 mb-3">Were these results helpful?</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => record("up")}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
              "border-ink-100 dark:border-ink-800 text-ink-500 hover:border-semantic-success hover:text-semantic-success hover:bg-semantic-success/5"
            )}
          >
            <Icon icon={ThumbsUp} size={12} /> Yes
          </button>
          <button
            type="button"
            onClick={() => record("down")}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
              "border-ink-100 dark:border-ink-800 text-ink-500 hover:border-semantic-error hover:text-semantic-error hover:bg-semantic-error/5"
            )}
          >
            <Icon icon={ThumbsDown} size={12} /> No
          </button>
          <FeatureGate featureKey="search.feedback_comment">
            <span
              aria-disabled="true"
              title="Feedback comments open once an account is connected"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ink-100 dark:border-ink-800 text-ink-300 dark:text-ink-600 text-xs font-medium cursor-not-allowed"
            >
              <Icon icon={MessageSquare} size={12} /> Comment
            </span>
          </FeatureGate>
        </div>
      </div>
    </FeatureGate>
  );
}
