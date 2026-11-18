"use client";

import { Reveal } from "@/components/motion/Reveal";
import { ActivityRail } from "@/components/social/ActivityRail";
import { SuggestedUsers } from "@/components/social/SuggestedUsers";
import { FollowList } from "@/components/social/FollowList";
import { NETWORK_DISCLOSURE, FOLLOW_LIST_EMPTY, NO_MEMBERS } from "@/lib/network";

/**
 * The network hub body.
 *
 * The brief called this "the social graph" and filled it with invented members,
 * mutual-follower counts, trust badges and a live feed of other people's
 * purchases. There is no account store and no follow graph in this project — a
 * fact already recorded in src/lib/profile.ts — so the page is built from the one
 * dataset that is real: the reader's own on-device activity, plus vehicle
 * suggestions derived from it.
 *
 * The member list is rendered with an empty array on purpose. The component works;
 * there is simply nobody to put in it, and an empty list that says so is more
 * useful than a list of fictional people. That is also why there is no Follow
 * button for a member anywhere on this page.
 */
export function NetworkView() {
  return (
    <div className="max-w-[1400px] mx-auto py-8 px-4">
      <Reveal variant="up">
        <header className="mb-6">
          <h1 className="text-3xl font-display font-bold text-ink-900 dark:text-white">
            Your network
          </h1>
          <p className="text-ink-500 dark:text-ink-300 mt-1">
            What you have been looking at, saving and building — and what that suggests.
          </p>
        </header>
      </Reveal>

      <Reveal variant="up">
        <div className="mb-8 rounded-2xl border border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-900/50 p-5">
          <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed max-w-3xl">
            {NETWORK_DISCLOSURE}
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <ActivityRail />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Reveal variant="up" delay={100}>
            <FollowList
              users={[]}
              title="Following"
              emptyMessage={FOLLOW_LIST_EMPTY}
              emptyHint={NO_MEMBERS}
            />
          </Reveal>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <SuggestedUsers />
        </div>
      </div>
    </div>
  );
}
