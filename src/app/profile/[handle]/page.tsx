import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/ProfileView";
import { PROFILE_HANDLE } from "@/lib/profile-handle";

/**
 * A profile at `/profile/<handle>`.
 *
 * The handle is accepted so the route shape matches the brief, but nothing is
 * fetched for it: there is no profile store and no user directory, so any handle
 * resolves to the same page, which describes the current session. That is stated
 * on the page rather than dressed up as a lookup that failed.
 *
 * It does not render AppShell. The root layout already provides it, and nesting
 * it here would render a second copy of the fixed mobile navigation.
 */
export function generateStaticParams() {
  return [{ handle: PROFILE_HANDLE }];
}

export function generateMetadata({ params }: { params: { handle: string } }): Metadata {
  return {
    title: `@${params.handle} | TrueWheels`,
    description:
      "A TrueWheels profile. Profiles are not live: there is no profile store, no follower graph and no verification, so this page describes the current session instead.",
  };
}

export default function ProfilePage() {
  return <ProfileView />;
}
