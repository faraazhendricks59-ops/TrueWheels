"use client";

import Link from "next/link";
import { Car, Info, ShieldQuestion, Star } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/motion/Reveal";
import { PostCard } from "@/components/social/PostCard";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { DEMO_POSTS, GARAGE_EMPTY, NO_FOLLOW_GRAPH, NO_POST_STORE, NO_REVIEWS, NO_VERIFICATION, type ProfileTab } from "@/lib/profile";
import type { DemoVehicle } from "@/lib/demo/vehicles";

/**
 * The content for each tab.
 *
 * Every tab here is either real data or an explanation of why there is none.
 * The brief filled all four with inventions: posts that "will render here" with a
 * note to wire them up, three identical BMW M3 cards with an Unsplash photo, a
 * 4.9 rating over "14 verified transactions", and an About panel listing FICA,
 * Home Affairs, an OTP to a phone number and a magic-link email confirmation.
 * None of those checks exist, so none of them are shown.
 */
export function TabContent({
  activeTab,
  panelId,
  tabId,
  savedVehicles,
  roleLabel,
  identitySource,
}: {
  activeTab: ProfileTab;
  panelId: string;
  tabId: string;
  savedVehicles: DemoVehicle[];
  roleLabel: string;
  identitySource: string;
}) {
  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      tabIndex={0}
      className="mt-6 min-h-[400px] focus:outline-none"
    >
      {activeTab === "posts" && <PostsTab />}
      {activeTab === "garage" && <GarageTab vehicles={savedVehicles} />}
      {activeTab === "reviews" && <ReviewsTab />}
      {activeTab === "about" && <AboutTab roleLabel={roleLabel} identitySource={identitySource} />}
    </div>
  );
}

function Disclosure({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex gap-2 rounded-xl border border-aurora-blue/20 bg-aurora-blue/5 px-3 py-2.5 mb-4">
      <Icon icon={Info} size={13} className="text-aurora-blue flex-shrink-0 mt-0.5" />
      <span className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed">{children}</span>
    </p>
  );
}

/**
 * The seeded examples from the community feed, labelled as examples on each card
 * by PostCard itself. The brief wanted "the user's posts"; there is no post store,
 * so these are the only posts that exist and they are not this profile's.
 */
function PostsTab() {
  return (
    <div className="space-y-4">
      <Disclosure>{NO_POST_STORE}</Disclosure>
      {DEMO_POSTS.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function GarageTab({ vehicles }: { vehicles: DemoVehicle[] }) {
  if (vehicles.length === 0) {
    return (
      <Reveal variant="up">
        <EmptyState
          icon={Car}
          title="Nothing saved yet"
          description={GARAGE_EMPTY}
          actionLabel="Browse the marketplace"
          actionFeatureKey="profile.garage_browse"
          onAction={() => {
            window.location.href = "/marketplace";
          }}
        />
      </Reveal>
    );
  }

  return (
    <Reveal variant="up">
      <p className="text-[11px] text-ink-400 mb-4">
        {vehicles.length} saved {vehicles.length === 1 ? "vehicle" : "vehicles"}, stored in this
        browser only.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </Reveal>
  );
}

/**
 * No rating, because there are none.
 *
 * The brief put "4.9/5.0 based on 14 verified transactions" at the top of this
 * tab. The review section was emptied in Phase 37 for the same reason: no sale
 * has gone through this platform, so a rating would be invented, and a number
 * published on a page can be read as structured data.
 */
function ReviewsTab() {
  return (
    <Reveal variant="up">
      <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6 shadow-lift">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-500">
              <Icon icon={Star} size={20} />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-ink-900 dark:text-white">
                No reviews yet
              </h3>
              <p className="text-sm text-ink-500">There is no rating to show.</p>
            </div>
          </div>
          <Badge variant="status" tone="ink">
            None
          </Badge>
        </div>

        <div className="rounded-xl bg-ink-50 dark:bg-ink-950 border border-dashed border-ink-200 dark:border-ink-800 p-5">
          <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed mb-3">{NO_REVIEWS}</p>
          <p className="text-[11px] text-ink-400 leading-relaxed">
            A rating would also be a claim about how many people chose to transact here, and a
            follower count is the same kind of claim: {NO_FOLLOW_GRAPH}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

/**
 * What is known about this account, which is only what the session cookie holds.
 *
 * The brief's About panel listed FICA document checks, a Home Affairs API lookup,
 * an OTP to a partially masked phone number and a magic-link email confirmation,
 * each behind a green "verified" badge. Every one of those is a check we have
 * never performed, and two of them name real institutions.
 */
function AboutTab({
  roleLabel,
  identitySource,
}: {
  roleLabel: string;
  identitySource: string;
}) {
  return (
    <Reveal variant="up">
      <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6 shadow-lift space-y-6">
        <div>
          <h3 className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-3">
            Verification status
          </h3>
          <div className="flex gap-2.5 rounded-xl border border-semantic-warning/25 bg-semantic-warning/5 px-3.5 py-3">
            <Icon icon={ShieldQuestion} size={15} className="text-semantic-warning flex-shrink-0 mt-0.5" />
            <div className="text-[12px] leading-relaxed text-ink-600 dark:text-ink-300">
              <p className="font-semibold text-ink-900 dark:text-white mb-1">
                Nothing is verified
              </p>
              <p>{NO_VERIFICATION}</p>
            </div>
          </div>
        </div>

        <div className="h-px bg-ink-100 dark:bg-ink-800" />

        <div>
          <h3 className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-3">
            Session
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-ink-500">Role</dt>
              <dd className="font-semibold text-ink-900 dark:text-white text-right">{roleLabel}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-ink-500 shrink-0">Source</dt>
              <dd className="text-ink-600 dark:text-ink-300 text-right">{identitySource}</dd>
            </div>
          </dl>
        </div>

        <div className="h-px bg-ink-100 dark:bg-ink-800" />

        <div>
          <h3 className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-3">
            Profile details
          </h3>
          <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
            There is no way to edit a bio, an avatar or a location, because there is no profile
            record to write them to. A field that cannot be saved is not shown.
          </p>
        </div>
      </div>
    </Reveal>
  );
}
