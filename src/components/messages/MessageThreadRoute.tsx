"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { MessageInbox } from "@/components/messages/MessageInbox";
import { ChatView } from "@/components/messages/ChatView";
import { useMessages } from "@/components/providers/MessagesProvider";

/**
 * Resolves a message id against the reader's own drafts.
 *
 * The id encodes the listing and the kind (e.g. "vw-golf-8-gti--offer"), so a stale
 * link or one cleared with site data gets an explicit not-found state rather than
 * falling back to a different message.
 */
export function MessageThreadRoute({ id }: { id: string }) {
  const { drafts, isHydrated } = useMessages();

  const draft = drafts.find((entry) => entry.id === id);

  return (
    <div className="max-w-[1600px] mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 xl:col-span-3">
          <MessageInbox activeId={draft?.id} />
        </div>

        <div className="lg:col-span-8 xl:col-span-9">
          {!isHydrated ? null : draft ? (
            <ChatView draft={draft} />
          ) : (
            <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-sm p-10">
              <EmptyState
                icon={MessageSquare}
                title="Message not found"
                description="No message with that address exists in this browser. Messages are stored on this device, so one you wrote elsewhere, or before clearing site data, will not be here."
              />
              <p className="text-center mt-6">
                <Link href="/messages" className="text-sm font-semibold text-brand hover:underline">
                  Back to your messages
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
