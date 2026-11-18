import type { Metadata } from "next";
import { MessagesWorkspace } from "@/components/messages/MessagesWorkspace";

/**
 * The messages route.
 *
 * A server component for real metadata; the workspace is a client component because
 * the messages live in the browser's local storage. It does not render AppShell — the
 * root layout already provides it.
 */
export const metadata: Metadata = {
  title: "Messages | TrueWheels",
  description:
    "The messages you have written to sellers, kept on this device. TrueWheels has no messaging service and cannot send or receive a message.",
};

export default function MessagesPage() {
  return <MessagesWorkspace />;
}
