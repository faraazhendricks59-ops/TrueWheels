import type { Metadata } from "next";
import { GroupsDirectory } from "@/components/groups/GroupsDirectory";

/**
 * The groups directory route.
 *
 * A server component so the metadata is real; the directory itself is a client
 * component because the groups live in the browser's local storage.
 *
 * It does not render AppShell: the root layout already provides it.
 */
export const metadata: Metadata = {
  title: "Groups | TrueWheels",
  description:
    "Groups you keep on this device. TrueWheels has no groups service, so there is no directory of communities to browse and nothing to join.",
};

export default function GroupsPage() {
  return <GroupsDirectory />;
}
