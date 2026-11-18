"use client";

import { Info } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { PostComposer } from "@/components/social/PostComposer";
import { PostCard } from "@/components/social/PostCard";
import { CommunitySidebar } from "@/components/social/CommunitySidebar";
import { Reveal } from "@/components/motion/Reveal";
import { DEMO_POSTS, FEED_DISCLOSURE } from "@/lib/social";

/**
 * The community feed.
 *
 * The brief described this as a social network for members. There is no
 * community service, so nobody can publish and the three posts below are
 * examples, labelled as such on every card and again here. The page is built so
 * that a real feed can replace DEMO_POSTS without touching the layout.
 */
export function CommunityFeed() {
  return (
    <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 py-6">
      <main className="lg:col-span-8 xl:col-span-8 space-y-4">
        <FeatureGate featureKey="community.feed">
        <Reveal variant="up">
          <div className="flex gap-2.5 rounded-2xl border border-aurora-blue/20 bg-aurora-blue/5 px-4 py-3">
            <Icon icon={Info} size={14} className="text-aurora-blue flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed">
              {FEED_DISCLOSURE}
            </p>
          </div>
        </Reveal>

        <Reveal variant="up" delay={60}>
          <PostComposer />
        </Reveal>

        <div className="divide-y divide-ink-100 dark:divide-ink-800 bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl overflow-hidden">
          {DEMO_POSTS.map((post, index) => (
            <Reveal key={post.id} variant="up" delay={(index + 1) * 80}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
        </FeatureGate>
      </main>

      <aside className="lg:col-span-4 xl:col-span-4">
        <Reveal variant="up" delay={120}>
          <CommunitySidebar />
        </Reveal>
      </aside>
    </div>
  );
}
