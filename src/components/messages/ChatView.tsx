"use client";

import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { ConversationHeader } from "./ConversationHeader";
import { MessageBubble } from "./MessageBubble";
import { MessageComposer } from "./MessageComposer";
import { useMessages } from "@/components/providers/MessagesProvider";
import { NO_COUNTERPARTY, NO_REPLIES, type MessageDraft } from "@/lib/messages";
import { localeTag } from "@/lib/i18n/locale";

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

      <div className="flex-1 overflow-y-auto bg-chat-wallpaper px-3 py-4 dark:bg-chat-wallpaper-dark">
        <div className="space-y-4">
          {/* A date chip, the way a chat client separates days. It is a real date
              from the draft, not a fabricated "today". */}
          <div className="flex justify-center">
            <span className="rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-ink-500 shadow-sm dark:bg-ink-800/90 dark:text-ink-300">
              {new Intl.DateTimeFormat(localeTag("en"), {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date(draft.updatedAt))}
            </span>
          </div>

          <div className="mx-auto flex max-w-md items-start gap-2.5 rounded-xl bg-white/95 p-3.5 shadow-sm dark:bg-ink-900/95">
            <Icon icon={Info} size={14} className="mt-0.5 flex-shrink-0 text-aurora-blue dark:text-aurora-blue-light" />
            <div className="space-y-1.5">
              <p className="text-[11px] leading-relaxed text-ink-600 dark:text-ink-300">
                {NO_REPLIES}
              </p>
              <p className="text-[11px] leading-relaxed text-ink-500 dark:text-ink-300">
                {NO_COUNTERPARTY}
              </p>
            </div>
          </div>

          <MessageBubble body={draft.body} timestamp={draft.updatedAt} />
        </div>
      </div>

      <MessageComposer draftId={draft.id} initialBody={draft.body} />
    </div>
  );
}
