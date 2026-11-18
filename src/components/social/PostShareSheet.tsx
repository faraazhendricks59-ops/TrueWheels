"use client";

import { useEffect, useState } from "react";
import { Link2, Share2, Check } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { SmartButton } from "@/components/ui/SmartButton";
import { useToast } from "@/components/ui/Toast";
import type { CommunityPost } from "@/lib/social";

/**
 * Share a post.
 *
 * There is no post permalink, because posts are not stored anywhere, so this
 * shares the community page and says which post it refers to. Offering a
 * per-post link would send the reader to a page that cannot show that post.
 *
 * The vehicle ShareSheet is not reused: it takes a vehicle and builds a
 * /vehicles/<id> address, which would be the wrong link for a post.
 */
export function PostShareSheet({
  isOpen,
  onClose,
  post,
}: {
  isOpen: boolean;
  onClose: () => void;
  post: CommunityPost;
}) {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setUrl(`${window.location.origin}/community`);
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
    setCopied(false);
  }, [isOpen]);

  const excerpt = post.content.length > 120 ? `${post.content.slice(0, 117)}...` : post.content;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ variant: "success", title: "Link copied" });
    } catch {
      toast({
        variant: "error",
        title: "Could not copy",
        description: "Your browser blocked clipboard access. Select the address above instead.",
      });
    }
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="Share this post">
      <div className="space-y-4">
        <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
          Posts are not stored yet, so there is no link that opens this post on its own. The link
          below opens the community page, and the text says which post it refers to.
        </p>

        <div className="rounded-xl border border-ink-100 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 px-3 py-2">
          <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-1">Address</p>
          <p className="text-xs text-ink-600 dark:text-ink-300 break-all">{url}</p>
        </div>

        <div className="rounded-xl border border-ink-100 dark:border-ink-800 px-3 py-2.5">
          <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-1">
            Post text
          </p>
          <p className="text-xs text-ink-600 dark:text-ink-300 leading-relaxed">{excerpt}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <SmartButton
            featureKey="social.action_share"
            onClick={copy}
            leftIcon={copied ? Check : Link2}
          >
            {copied ? "Copied" : "Copy link"}
          </SmartButton>

          {canNativeShare && (
            <SmartButton
              featureKey="social.action_share"
              variant="secondary"
              leftIcon={Share2}
              onClick={() =>
                navigator
                  .share({ title: "TrueWheels community post", text: excerpt, url })
                  .catch(() => {
                    // A dismissed share sheet is not an error.
                  })
              }
            >
              Share
            </SmartButton>
          )}
        </div>
      </div>
    </Sheet>
  );
}
