import type { Metadata } from "next";
import { EventsDirectory } from "@/components/events/EventsDirectory";

/**
 * The events directory route.
 *
 * A server component so the metadata is real; the directory is a client component
 * because the events live in the browser's local storage.
 *
 * It does not render AppShell: the root layout already provides it.
 */
export const metadata: Metadata = {
  title: "Events | TrueWheels",
  description:
    "Events you keep on this device. TrueWheels has no events diary, so there is no public list of meets or track days to browse.",
};

export default function EventsPage() {
  return <EventsDirectory />;
}
