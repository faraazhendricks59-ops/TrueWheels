"use client";

import { PencilLine } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { localeTag } from "@/lib/i18n/locale";

/**
 * The message the reader wrote, shown as their own.
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
      <div className="max-w-[85%] flex flex-col items-end gap-1">
        <div className="px-4 py-2.5 rounded-2xl rounded-br-sm bg-brand text-white text-sm leading-relaxed whitespace-pre-wrap break-words">
          {body}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-ink-400">
          <Icon icon={PencilLine} size={10} />
          <span>Draft, not sent{time ? ` · edited ${time}` : ""}</span>
        </div>
      </div>
    </div>
  );
}
