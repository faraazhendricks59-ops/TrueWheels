"use client";

import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { ConversationHeader } from "./ConversationHeader";
import { MessageBubble } from "./MessageBubble";
import { MessageComposer } from "./MessageComposer";
import { useMessages } from "@/components/providers/MessagesProvider";
import { NO_COUNTERPARTY, NO_REPLIES, type MessageDraft } from "@/lib/messages";

/**
 * A message thread.
 *
 * The brief built this as a live chat: an auto-scrolling message list, a typing
 * indicator ("Prestige Motors SA is typing…"), and a fake reply two seconds after
 * every send. The reply is the problem — it is written to look like a person
 * answering. A buyer would believe the seller had acknowledged their enquiry or
 * offer and wait for a follow-up that could never arrive.
 *
 * There is no chat here because there is no one to chat with. What this shows is the
 * reader's own message, anchored to the real listing, with the tools to send it: edit
 * the wording, copy it, or open it in WhatsApp. The notice above the thread says
 * plainly that no reply will come.
 */
export function ChatView({ draft }: { draft: MessageDraft }) {
  const { removeDraft } = useMessages();
  const router = useRouter();

  const handleDelete = () => {
    removeDraft(draft.id);
    router.push("/messages");
  };

  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-sm overflow-hidden flex flex-col lg:h-[calc(100vh-140px)]">
      <ConversationHeader draft={draft} onDelete={handleDelete} />

      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-ink-50/30 dark:bg-ink-950/30">
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-aurora-blue/5 border border-aurora-blue/20">
          <Icon icon={Info} size={14} className="text-aurora-blue flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <p className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed">{NO_REPLIES}</p>
            <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">{NO_COUNTERPARTY}</p>
          </div>
        </div>

        <MessageBubble body={draft.body} timestamp={draft.updatedAt} />
      </div>

      <MessageComposer draftId={draft.id} initialBody={draft.body} />
    </div>
  );
}
