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
 *
 * The layout is the timeline shape: a single narrow column of rows with a
 * sticky header, and the rail beside it. A narrow column is what makes a feed
 * read as a feed — a wide grid of cards reads as a catalogue.
 */
export function CommunityFeed() {
  return (
    <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_330px]">
      {/* A div, not <main>: the root layout already provides the single main
          landmark, and a second one makes the landmark structure ambiguous. */}
      <div className="min-w-0">
        <FeatureGate featureKey="community.feed">
          {/* Sticky, so the heading and the disclosure stay with the column as the
              rows scroll under them. */}
          <div className="sticky top-[calc(var(--header-height)+var(--sat))] z-20 border-b border-ink-100 bg-surface-paper/85 backdrop-blur-lg dark:border-ink-800 dark:bg-ink-950/85">
            <div className="flex items-center justify-between px-4 py-3">
              <h1 className="font-display text-lg font-bold text-ink-900 dark:text-white">
                Community
              </h1>
              <Icon icon={Info} size={15} className="text-ink-400 dark:text-ink-300" />
            </div>
          </div>

          <div className="flex gap-2.5 border-b border-ink-100 bg-aurora-blue/5 px-4 py-3 dark:border-ink-800">
            <Icon icon={Info} size={14} className="mt-0.5 flex-shrink-0 text-aurora-blue" />
            <p className="text-[11px] leading-relaxed text-ink-600 dark:text-ink-300">
              {FEED_DISCLOSURE}
            </p>
          </div>

          <Reveal variant="up">
            <PostComposer />
          </Reveal>

          <div className="divide-y divide-ink-100 bg-white dark:divide-ink-800 dark:bg-ink-900">
            {DEMO_POSTS.map((post, index) => (
              <Reveal key={post.id} variant="up" delay={(index + 1) * 80}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        </FeatureGate>
      </div>

      <aside className="hidden lg:block">
        <Reveal variant="up" delay={120}>
          <div className="sticky top-[calc(var(--header-height)+var(--sat)+1.5rem)]">
            <CommunitySidebar />
          </div>
        </Reveal>
      </aside>
    </div>
  );
}
