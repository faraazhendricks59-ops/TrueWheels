"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { SmartButton } from "@/components/ui/SmartButton";
import { KIND_LABELS, type MessageDraft } from "@/lib/messages";

const KIND_TONE: Record<MessageDraft["kind"], "blue" | "red" | "green"> = {
  enquiry: "blue",
  offer: "red",
  test_drive: "green",
};

/**
 * The header for a message thread.
 *
 * The brief had a participant avatar with an "Active now" dot, a trust badge claiming
 * CIPC/FICA or MIWA verification, a "Within 1 hour" response time, and call and video
 * buttons. None of that is real: there is no account to be online, no verification
 * register was ever checked, no response time was measured, and there is no calling
 * service. What is real is the listing the message is about, so the header shows that
 * — its title, its price, its location, and a link to its page — plus the kind of
 * message and a delete control.
 */
export function ConversationHeader({
  draft,
  onBack,
  onDelete,
}: {
  draft: MessageDraft;
  onBack?: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="p-4 border-b border-ink-100 dark:border-ink-800 flex items-center gap-3 flex-shrink-0 bg-white dark:bg-ink-900">
      {onBack && (
        <SmartButton
          featureKey="messages.back"
          variant="ghost"
          size="icon"
          className="lg:hidden !h-9 !w-9"
          onClick={onBack}
          aria-label="Back to messages"
        >
          <Icon icon={ArrowLeft} size={16} />
        </SmartButton>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="status" tone={KIND_TONE[draft.kind]}>
            {KIND_LABELS[draft.kind]}
          </Badge>
          <Link
            href={`/vehicles/${draft.vehicleId}`}
            className="text-sm font-bold text-ink-900 dark:text-white hover:text-brand truncate inline-flex items-center gap-1"
          >
            {draft.vehicleTitle}
            <Icon icon={ExternalLink} size={12} className="flex-shrink-0" />
          </Link>
        </div>
        <p className="text-[10px] text-ink-500">
          R {draft.vehiclePrice.toLocaleString("en-ZA")} · {draft.vehicleLocation}
        </p>
      </div>

      <SmartButton
        featureKey="messages.delete_draft"
        variant="ghost"
        size="icon"
        className="!h-9 !w-9 !text-semantic-error"
        onClick={onDelete}
        aria-label="Delete this message"
      >
        <Icon icon={Trash2} size={16} />
      </SmartButton>
    </div>
  );
}
