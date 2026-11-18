"use client";

import { Sparkles, User } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { CitationLink } from "./CitationLink";
import { ToolCallWidget } from "./ToolCallWidget";
import type { Citation, ToolCall } from "@/lib/ai-concierge";

export interface ChatMessageData {
  id: string;
  role: "user" | "ai";
  content: string;
  toolCall?: ToolCall;
  citations: Citation[];
  /** True while the reply is still being revealed. */
  isStreaming?: boolean;
}

export function ChatMessage({ message }: { message: ChatMessageData }) {
  const isAI = message.role === "ai";

  return (
    <div className={clsx("flex gap-3", isAI ? "justify-start" : "justify-end")}>
      {isAI && (
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand text-white">
          <Icon icon={Sparkles} size={14} />
        </span>
      )}

      <div className={clsx("max-w-[85%] flex flex-col gap-2", isAI ? "items-start" : "items-end")}>
        {message.toolCall && <ToolCallWidget tool={message.toolCall} />}

        <div
          className={clsx(
            "px-4 py-3 rounded-2xl text-sm leading-relaxed",
            isAI
              ? "bg-ink-50 dark:bg-ink-950 text-ink-800 dark:text-ink-200 rounded-tl-none border border-ink-100 dark:border-ink-800"
              : "bg-brand text-white rounded-tr-none"
          )}
        >
          {message.content}
          {message.isStreaming && (
            <span className="inline-block w-1.5 h-4 ml-0.5 align-middle bg-ink-400 animate-pulse" aria-hidden="true" />
          )}
        </div>

        {isAI && message.citations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pl-1">
            {message.citations.map((citation, index) => (
              <CitationLink
                key={`${citation.id}-${index}`}
                index={index + 1}
                label={citation.label}
                href={citation.href}
              />
            ))}
          </div>
        )}
      </div>

      {!isAI && (
        <span className="w-8 h-8 rounded-xl bg-ink-200 dark:bg-ink-800 flex items-center justify-center text-ink-600 dark:text-ink-300 flex-shrink-0">
          <Icon icon={User} size={14} />
        </span>
      )}
    </div>
  );
}
