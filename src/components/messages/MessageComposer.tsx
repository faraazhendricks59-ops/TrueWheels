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
    <div className="p-4 border-t border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 flex-shrink-0">
      <label htmlFor="message-body" className="sr-only">
        Your message
      </label>
      <textarea
        id="message-body"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={5}
        className="w-full bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800 rounded-2xl px-4 py-3 text-sm text-ink-900 dark:text-white placeholder:text-ink-400 focus:outline-none focus:border-brand transition-colors resize-y"
        placeholder="Write your message…"
      />

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <SmartButton featureKey="messages.save_draft" onClick={save} disabled={!dirty} leftIcon={Save} className="!h-10">
          Save changes
        </SmartButton>
        <SmartButton
          featureKey="messages.copy_draft"
          variant="secondary"
          onClick={copy}
          leftIcon={copied ? Check : Copy}
          className="!h-10"
        >
          {copied ? "Copied" : "Copy"}
        </SmartButton>
        <SmartButton
          featureKey="messages.send_whatsapp"
          variant="secondary"
          leftIcon={MessageCircle}
          className="!h-10"
          onClick={() => window.open(whatsAppShareLink(body), "_blank", "noopener,noreferrer")}
        >
          Send on WhatsApp
        </SmartButton>
      </div>

      <p className="text-[10px] text-ink-400 mt-2 leading-relaxed">{DRAFT_LOCAL_ONLY}</p>
    </div>
  );
}
