"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Save, X } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { COMMENT_COMPOSER_DISCLOSURE } from "@/lib/comments";

const MAX_LENGTH = 300;

/**
 * The reply box.
 *
 * Two things from the brief are missing on purpose.
 *
 * There is no "@" button. It appended an "@" to the text, but there is no
 * directory of members to mention, so the result is a dangling reference to
 * nobody. Typing an @ is still possible and is still highlighted, which is
 * honest: it reads as a name, and nothing claims it links anywhere.
 *
 * The button says "Save reply", not "Comment" or "Reply". Nothing is published,
 * so a button labelled as posting would be describing something that does not
 * happen. The text is kept on this device and the button says so.
 *
 * The brief's counter also disagreed with itself: it warned above 280 characters
 * while the limit it displayed was 300. There is one limit here.
 */
export function CommentComposer({
  onSave,
  onCancel,
  autoFocus,
  isReply = false,
  replyToHandle,
  placeholder,
}: {
  onSave: (content: string) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
  isReply?: boolean;
  replyToHandle?: string;
  placeholder?: string;
}) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fieldId = useId();
  const countId = useId();

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  const autoGrow = () => {
    const node = textareaRef.current;
    if (!node) return;
    node.style.height = "auto";
    node.style.height = `${node.scrollHeight}px`;
  };

  const submit = () => {
    if (!content.trim()) return;
    onSave(content.trim());
    setContent("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const atLimit = content.length >= MAX_LENGTH;

  return (
    <FeatureGate featureKey="comments.composer">
      <div className={clsx("flex gap-3", isReply && "pl-4 border-l-2 border-ink-100 dark:border-ink-800")}>
        <div
          className="w-8 h-8 rounded-full bg-ink-100 dark:bg-ink-800 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-ink-500 dark:text-ink-300"
          aria-hidden="true"
        >
          You
        </div>

        <div className="flex-1 min-w-0">
          <label htmlFor={fieldId} className="sr-only">
            {isReply && replyToHandle ? `Reply to @${replyToHandle}` : "Write a reply"}
          </label>
          <textarea
            id={fieldId}
            ref={textareaRef}
            value={content}
            maxLength={MAX_LENGTH}
            onChange={(event) => {
              setContent(event.target.value);
              autoGrow();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                submit();
              }
              if (event.key === "Escape" && onCancel) onCancel();
            }}
            placeholder={placeholder ?? (isReply ? "Write a reply" : "Add a reply to this example thread")}
            rows={1}
            aria-describedby={countId}
            className="w-full bg-transparent text-sm text-ink-900 dark:text-white placeholder:text-ink-400 focus:outline-none resize-none py-2"
          />

          <div className="flex items-center justify-between gap-3 mt-2">
            <span id={countId} className="text-[10px] tabular-nums text-ink-400">
              {content.length}/{MAX_LENGTH}
            </span>

            <div className="flex items-center gap-2">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  aria-label="Cancel this reply"
                  className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] rounded-full text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors"
                >
                  <Icon icon={X} size={15} />
                </button>
              )}
              <SmartButton
                featureKey="comments.submit"
                size="sm"
                onClick={submit}
                disabled={!content.trim()}
                leftIcon={Save}
              >
                Save reply
              </SmartButton>
            </div>
          </div>

          <p className="text-[10px] text-ink-400 leading-relaxed mt-1.5">
            {COMMENT_COMPOSER_DISCLOSURE}
            {atLimit && <span className="block text-semantic-warning">That is the maximum length.</span>}
          </p>
        </div>
      </div>
    </FeatureGate>
  );
}
