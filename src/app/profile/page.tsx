import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PROFILE_HANDLE } from "@/lib/profile-handle";

/**
 * `/profile` has no content of its own: a profile is addressed by handle, so this
 * forwards to the canonical route. It replaced a PlaceholderPage, which was the
 * only thing behind the Profile link in the mobile navigation and the search
 * index.
 */
export const metadata: Metadata = {
  title: "Profile | TrueWheels",
  description:
    "Profiles are not live. There is no profile store, no follower graph and no verification, so this page describes the current session instead.",
};

export default function ProfileIndexPage() {
  redirect(`/profile/${PROFILE_HANDLE}`);
}
