"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { usePersonalization } from "@/components/providers/PersonalizationProvider";
import { ProfileHeader, type ProfileIdentity } from "./ProfileHeader";
import { ProfileTabs } from "./ProfileTabs";
import { TabContent } from "./TabContent";
import { useToast } from "@/components/ui/Toast";
import {
  DEMO_POSTS,
  EXAMPLE_PROFILE,
  IDENTITY_ON_DEVICE,
  resolveSavedVehicles,
  type ProfileTab,
} from "@/lib/profile";
import { PROFILE_HANDLE } from "@/lib/profile-handle";

const PANEL_ID = "profile-tabpanel";

/**
 * Composes the profile from real data only.
 *
 * The brief drove this page from a MOCK_USER object: an invented "Marcus Drifts"
 * with an avatar fetched from i.pravatar.cc, a banner from Unsplash, a link to
 * marcusdrifts.co.za (which does not resolve), and four counters. It also had
 * Follow and Message buttons wired to nothing, so clicking them did nothing at
 * all.
 *
 * This page instead reads the two things that genuinely exist:
 *
 *  - the session, from the signed cookie via AuthProvider, which is the only
 *    identity the app has; and
 *  - the saved vehicles, from the personalization store, which is real per-device
 *    state that the marketplace actually writes.
 *
 * Because there is no user directory, the handle in the URL is not looked up. The
 * page says so rather than pretending the profile belongs to whoever the URL
 * names.
 */
export function ProfileView() {
  const { user, role, isLoading } = useAuth();
  const { savedVehicles, isHydrated } = usePersonalization();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");

  const garage = useMemo(
    () => (isHydrated ? resolveSavedVehicles(savedVehicles) : []),
    [savedVehicles, isHydrated]
  );

  const identity: ProfileIdentity = useMemo(() => {
    const name = user?.name?.trim() || "Guest";
    const isGuest = !user;
    return {
      handle: isGuest ? PROFILE_HANDLE : handleFor(user!.uid),
      name,
      roleLabel: isGuest
        ? "Not signed in. Sign in from the header to get a session on this device."
        : `Signed in as a ${roleLabel(role)}.`,
      // Only a guest or the seeded examples are ever labelled as examples; a real
      // session is the visitor's own identity.
      isExample: isGuest,
      postCount: DEMO_POSTS.length,
      garageSize: garage.length,
    };
  }, [user, role, garage.length]);

  const share = async () => {
    const url = `${window.location.origin}/profile/${identity.handle}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ variant: "success", title: "Profile link copied", description: url });
    } catch {
      toast({ variant: "error", title: "Could not copy the link" });
    }
  };

  return (
    <div className="mx-auto max-w-2xl pb-16">
      {identity.isExample && (
        <p className="mb-4 rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-[12px] leading-relaxed text-ink-600 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-300">
          {EXAMPLE_PROFILE}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-900">
        <ProfileHeader
          identity={identity}
          onShare={share}
          onMore={() =>
            toast({
              variant: "info",
              title: "Nothing to manage here yet",
              description: "There is no profile record to edit, so there are no other actions.",
            })
          }
          onMessage={() =>
            toast({
              variant: "info",
              title: "Messaging is not built yet",
              description: "There is no message store, so a message would have nowhere to go.",
            })
          }
          onFollow={() =>
            toast({
              variant: "info",
              title: "Following is not built yet",
              description: "There is no follow graph, so a follow could not be recorded.",
            })
          }
        />
      </div>

      {!isLoading && (
        <div className="mt-4">
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} panelId={PANEL_ID} />
          <TabContent
            activeTab={activeTab}
            panelId={PANEL_ID}
            tabId={`tab-${activeTab}`}
            savedVehicles={garage}
            roleLabel={roleLabel(role)}
            identitySource={IDENTITY_ON_DEVICE}
          />
        </div>
      )}
    </div>
  );
}

/** The uid is stable per session and safe to show; it is not an email. */
function handleFor(uid: string): string {
  return uid.replace(/^demo-/, "");
}

function roleLabel(role: string): string {
  switch (role) {
    case "dealer":
      return "dealer account";
    case "seller":
      return "private seller account";
    case "admin":
      return "platform admin account";
    case "buyer":
      return "buyer account";
    default:
      return "guest";
  }
}
