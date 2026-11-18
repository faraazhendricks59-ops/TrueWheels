import type { Metadata } from "next";
import { EventDetailRoute } from "@/components/events/EventDetailRoute";

/**
 * A single event's route.
 *
 * The event is resolved on the client, from the reader's own store. The server cannot
 * know which events exist, so the metadata is generic rather than naming an event it
 * would have to invent.
 */
export const metadata: Metadata = {
  title: "Event | TrueWheels",
  description:
    "An event stored on this device. Events here are local to the browser and are not published or shared.",
};

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  return <EventDetailRoute slug={params.slug} />;
}
