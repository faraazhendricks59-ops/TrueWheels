"use client";

import { useEffect, useState } from "react";
import { Copy, Check, MessageCircle, Save } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { useToast } from "@/components/ui/Toast";
import { useMessages } from "@/components/providers/MessagesProvider";
import { whatsAppShareLink } from "@/lib/contact";
import { DRAFT_LOCAL_ONLY } from "@/lib/messages";

/**
 * Edits and sends the message.
 *
 * The brief's composer attached photos, vehicle links and a location, none of which
 * could work: there is no storage, no message service to carry an attachment, and no
 * location the app knows. The three things that genuinely help a buyer are here
 * instead — edit the wording, copy it, and open it in WhatsApp with the text ready —
 * because those are the ways a message actually reaches a seller from this app.
 */
export function MessageComposer({ draftId, initialBody }: { draftId: string; initialBody: string }) {
  const { updateDraftBody } = useMessages();
  const { toast } = useToast();
  const [body, setBody] = useState(initialBody);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setBody(initialBody);
  }, [draftId, initialBody]);

  const dirty = body !== initialBody;

  const save = () => {
    updateDraftBody(draftId, body);
    toast({
      variant: "success",
      title: "Message saved",
      description: "Saved in this browser. Nothing was sent, because there is no message service.",
    });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      toast({
        variant: "error",
        title: "Could not copy",
        description: "Your browser blocked clipboard access. You can select the text and copy it by hand.",
      });
    }
  };

  return (
    <div className="flex-shrink-0 border-t border-ink-100 bg-white p-3 dark:border-ink-800 dark:bg-ink-900">
      {/* The input bar. A chat composer is a pill-shaped field with the send
          control inside it, not a textarea above a row of buttons — the field and
          its action read as one object. */}
      <div className="flex items-end gap-2">
        <label htmlFor="message-body" className="sr-only">
          Your message
        </label>
        <div className="flex flex-1 items-end rounded-3xl border border-ink-200 bg-ink-50 px-4 py-2.5 dark:border-ink-700 dark:bg-ink-950">
          <textarea
            id="message-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={1}
            className="max-h-40 w-full resize-none bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none dark:text-white"
            placeholder="Type a message"
          />
        </div>
        <button
          type="button"
          onClick={save}
          disabled={!dirty}
          aria-label="Save this message"
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-semantic-success text-white transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-400 dark:disabled:bg-ink-700"
        >
          <Icon icon={Save} size={18} />
        </button>
      </div>

      {/* The secondary actions stay, because they are the ways a message actually
          leaves this device. They are demoted below the bar rather than competing
          with it. */}
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <SmartButton
          featureKey="messages.copy_draft"
          variant="ghost"
          size="sm"
          onClick={copy}
          leftIcon={copied ? Check : Copy}
        >
          {copied ? "Copied" : "Copy"}
        </SmartButton>
        <SmartButton
          featureKey="messages.send_whatsapp"
          variant="ghost"
          size="sm"
          leftIcon={MessageCircle}
          onClick={() => window.open(whatsAppShareLink(body), "_blank", "noopener,noreferrer")}
        >
          Send on WhatsApp
        </SmartButton>
      </div>

      <p className="mt-2 text-[10px] leading-relaxed text-ink-400 dark:text-ink-300">{DRAFT_LOCAL_ONLY}</p>
    </div>
  );
}
