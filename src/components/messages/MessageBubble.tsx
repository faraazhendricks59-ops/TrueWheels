"use client";

import { PencilLine } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { localeTag } from "@/lib/i18n/locale";

/**
 * The message the reader wrote, shown as their own.
 *
 * The bubble is the chat shape: the outgoing message sits on the right in the
 * green that a reader recognises as "mine", with the time tucked into the bottom
 * corner of the bubble rather than floating under it. That pairing — right side,
 * green, time inside — is the whole visual grammar of a chat thread, and it is
 * what makes this read as a conversation rather than a document.
 *
 * The brief put a read receipt here — a single tick for "sent", a double tick for
 * "delivered", a blue double tick for "read" — and rendered whatever the "other
 * person" had supposedly sent. There is no delivery system and no other person, so
 * every tick would be decoration and every incoming bubble a fabrication. In its
 * place is the one honest status a draft can have: it has not been sent, because
 * TrueWheels cannot send it. The reader sends it themselves, from the composer.
 */
export function MessageBubble({ body, timestamp }: { body: string; timestamp: string }) {
  const date = new Date(timestamp);
  const time = Number.isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat(localeTag("en"), { hour: "2-digit", minute: "2-digit" }).format(date);

  return (
    <div className="flex justify-end">
      <div className="flex max-w-[85%] flex-col items-end gap-1">
        <div className="relative rounded-2xl rounded-br-sm bg-chat-outgoing px-3 py-2 text-[14px] leading-relaxed text-ink-900 shadow-sm dark:bg-chat-outgoing-dark dark:text-ink-50">
          <p className="whitespace-pre-wrap break-words pb-3.5 pr-1">{body}</p>
          {/* Time sits inside the bubble, bottom-right, the way a chat client
              places it, so the bubble reads as one object rather than a block
              with a caption. */}
          <span className="absolute bottom-1 right-2.5 flex items-center gap-1 text-[10px] text-ink-500 dark:text-ink-300">
            <Icon icon={PencilLine} size={10} />
            {time ? `${time} · draft` : "draft"}
          </span>
        </div>
        <span className="pr-1 text-[10px] text-ink-400 dark:text-ink-300">Not sent — you send it yourself.</span>
      </div>
    </div>
  );
}
