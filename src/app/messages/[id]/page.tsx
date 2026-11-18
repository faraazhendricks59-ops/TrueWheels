import type { Metadata } from "next";
import { MessageThreadRoute } from "@/components/messages/MessageThreadRoute";

/**
 * A single message thread.
 *
 * The message is resolved on the client, from the reader's own store, so the metadata
 * is generic rather than naming a listing it cannot know about.
 */
export const metadata: Metadata = {
  title: "Message | TrueWheels",
  description:
    "A message stored on this device. TrueWheels does not deliver messages, so this is a draft you send yourself.",
};

export default function MessageThreadPage({ params }: { params: { id: string } }) {
  return <MessageThreadRoute id={params.id} />;
}
