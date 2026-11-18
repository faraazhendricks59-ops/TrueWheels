import type { Metadata } from "next";
import { GroupDetailRoute } from "@/components/groups/GroupDetailRoute";

/**
 * A single group's route.
 *
 * The group is looked up on the client, from the reader's own store. The server
 * cannot know which groups exist, so the metadata is generic rather than naming a
 * group it would have to invent.
 */
export const metadata: Metadata = {
  title: "Group | TrueWheels",
  description:
    "A group stored on this device. Groups here are local to the browser and are not published or shared.",
};

export default function GroupDetailPage({ params }: { params: { slug: string } }) {
  return <GroupDetailRoute slug={params.slug} />;
}
