"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send, Sparkles, X } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { useFocusTrap, useScrollLock, useEscapeKey } from "@/components/ui/overlay-hooks";
import { useFeatureFlags } from "@/lib/feature-flags";
import { ChatMessage, type ChatMessageData } from "./ChatMessage";
import { answer, SUGGESTED_PROMPTS } from "@/lib/ai-concierge";

const GREETING: ChatMessageData = {
  id: "greeting",
  role: "ai",
  content:
    "Hello. I answer from the listings in this catalogue: I can search them, work out a monthly instalment, or compare prices for a car you are considering.",
  citations: [],
};

const STREAM_INTERVAL_MS = 16;
const CHARS_PER_TICK = 3;

interface AIConciergeSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIConciergeSheet({ isOpen, onClose }: AIConciergeSheetProps) {
  const { isEnabled } = useFeatureFlags();
  const [messages, setMessages] = useState<ChatMessageData[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timersRef = useRef<number[]>([]);

  useScrollLock(isOpen);
  useEscapeKey(isOpen, onClose);
  useFocusTrap(isOpen, panelRef);

  // Clear any in-flight streaming when the sheet closes, so a half-typed reply
  // does not continue mutating state in the background.
  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    if (!isOpen) {
      clearTimers();
      setIsThinking(false);
    } else {
      // Focus the field so the sheet is usable from the keyboard immediately.
      const id = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(id);
    }
  }, [isOpen, clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || isThinking) return;

    const userMessage: ChatMessageData = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      citations: [],
    };
    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsThinking(true);

    const reply = answer(text);
    const replyId = `a-${Date.now()}`;

    // The reply is revealed a few characters at a time, which is what makes the
    // text appear to arrive rather than jump in at once.
    window.setTimeout(() => {
      setIsThinking(false);
      const streaming = isEnabled("ai.streaming");
      if (!streaming) {
        setMessages((previous) => [...previous, { id: replyId, role: "ai", ...reply }]);
        return;
      }

      setMessages((previous) => [
        ...previous,
        { id: replyId, role: "ai", content: "", citations: [], isStreaming: true },
      ]);

      let cursor = 0;
      const step = () => {
        cursor = Math.min(reply.content.length, cursor + CHARS_PER_TICK);
        const partial = reply.content.slice(0, cursor);
        const done = cursor >= reply.content.length;
        setMessages((previous) =>
          previous.map((message) =>
            message.id === replyId
              ? {
                  ...message,
                  content: partial,
                  isStreaming: !done,
                  // Tool call and citations appear only once the text is done, so
                  // they never reference a claim that has not been made yet.
                  toolCall: done ? reply.toolCall : undefined,
                  citations: done ? reply.citations : [],
                }
              : message
          )
        );
        if (!done) {
          timersRef.current.push(window.setTimeout(step, STREAM_INTERVAL_MS));
        }
      };
      step();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:justify-end md:pr-8 md:pb-8 pointer-events-none">
      <div
        className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm md:hidden pointer-events-auto"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="TrueWheels AI concierge"
        className={clsx(
          "relative w-full md:w-[420px] h-[85vh] md:h-[600px] flex flex-col overflow-hidden pointer-events-auto",
          "bg-white dark:bg-ink-900 rounded-t-3xl md:rounded-3xl border border-ink-100 dark:border-ink-800",
          "shadow-lift animate-slide-up md:animate-scale-in"
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl aurora-bg flex items-center justify-center text-white">
              <Icon icon={Sparkles} size={16} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-ink-900 dark:text-white">TrueWheels concierge</h2>
              <p className="text-[10px] font-medium text-ink-500">
                Answers from this catalogue only
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close the concierge"
            className="p-2 text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg transition-colors"
          >
            <Icon icon={X} size={16} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isThinking && (
            <p className="flex items-center gap-2 text-xs text-ink-400 pl-11" role="status">
              <span className="flex gap-1">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-1.5 h-1.5 bg-ink-300 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </span>
              Checking the listings…
            </p>
          )}

          {messages.length === 1 && (
            <FeatureGate featureKey="ai.suggested_prompts">
              <div className="flex flex-wrap gap-2 pl-11">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => send(prompt)}
                    className="px-3 py-1.5 rounded-full border border-ink-100 dark:border-ink-800 text-[11px] text-ink-600 dark:text-ink-300 hover:border-brand/40 hover:text-brand transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </FeatureGate>
          )}
        </div>

        <div className="p-4 border-t border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 flex-shrink-0">
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800 focus-within:border-brand/50 focus-within:ring-2 focus-within:ring-brand/10 transition-all">
            <label htmlFor="concierge-input" className="sr-only">
              Ask the concierge a question
            </label>
            <input
              id="concierge-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") send(input);
              }}
              placeholder="Ask about cars, finance, or valuations…"
              className="flex-1 bg-transparent px-3 text-sm text-ink-900 dark:text-white placeholder:text-ink-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => send(input)}
              disabled={!input.trim() || isThinking}
              aria-label="Send question"
              className="p-2 rounded-xl bg-brand text-white hover:bg-brand-red-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Icon icon={Send} size={16} />
            </button>
          </div>
          <p className="text-[9px] text-center text-ink-400 mt-2">
            Answers are generated from the listings in this catalogue, not from a language model.
            Always check the details yourself.
          </p>
        </div>
      </div>
    </div>
  );
}
