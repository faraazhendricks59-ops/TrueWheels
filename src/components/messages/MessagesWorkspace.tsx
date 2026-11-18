"use client";

import { MessageSquarePlus } from "lucide-react";
import { MessageInbox } from "@/components/messages/MessageInbox";

/**
 * The messages workspace.
 *
 * On desktop this is a two-pane layout: the list of messages on the left and the
 * selected thread on the right. The thread itself lives at its own route
 * (/messages/[id]), so the right pane here is a hint rather than a duplicate — which
 * also means a message can be linked to and opened directly.
 */
export function MessagesWorkspace() {
  return (
    <div className="max-w-[1600px] mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 xl:col-span-3">
          <MessageInbox />
        </div>
        <div className="hidden lg:flex lg:col-span-8 xl:col-span-9 bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-sm h-[calc(100vh-140px)] items-center justify-center">
          <div className="text-center px-6">
            <span className="inline-flex w-12 h-12 rounded-full bg-ink-100 dark:bg-ink-800 items-center justify-center text-ink-400 mb-3">
              <MessageSquarePlus size={20} />
            </span>
            <p className="text-sm text-ink-400">Select a message to open it</p>
          </div>
        </div>
      </div>
    </div>
  );
}
