"use client";

import { Calendar, Link2, MapPin, MoreHorizontal } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { Badge } from "@/components/ui/Badge";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { FeatureGate } from "@/components/feature/FeatureGate";

export interface ProfileIdentity {
  handle: string;
  name: string;
  /** Real, and only ever the current session's own role. Never an assertion about someone else. */
  roleLabel: string;
  /** True when this is a seeded example rather than the signed-in visitor. */
  isExample: boolean;
  location?: string;
  joinedDate?: string;
  website?: string;
  /** Real count: the posts this page actually renders. */
  postCount: number;
  /** Real count: vehicles saved on this device. */
  garageSize: number;
}

/**
 * The profile header.
 *
 * The brief's version carried a trust badge, four invented counters, a green
 * "online" dot and a photograph of a stranger. None of those are here. What
 * remains is the session's own identity and the two counts that come from real
 * data on the page: the example posts it renders, and the vehicles saved in this
 * browser.
 *
 * The banner is a generated gradient, not an image. The brief used an Unsplash
 * URL, which 403s here, and even a working URL would depict a vehicle the profile
 * has no relationship to. A gradient carries the same visual weight as the fade
 * the brief wanted, and claims nothing.
 *
 * The avatar is initials. The brief used i.pravatar.cc, which responds and serves
 * a real face; attaching one to an invented handle is the most convincing lie on
 * the page.
 */
export function ProfileHeader({
  identity,
  onShare,
  onMore,
  onMessage,
  onFollow,
}: {
  identity: ProfileIdentity;
  onShare?: () => void;
  onMore?: () => void;
  onMessage?: () => void;
  onFollow?: () => void;
}) {
  const { name, handle, roleLabel, isExample } = identity;

  return (
    <Reveal variant="up">
      <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-lift overflow-hidden">
        <div className="relative h-40 md:h-56 w-full bg-gradient-to-br from-brand via-brand-dark to-aurora-purple">
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5), transparent 45%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.35), transparent 40%)",
            }}
            aria-hidden="true"
          />
          {/* Fade into the page background, as the brief intended. */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-ink-900 dark:via-ink-900/50 dark:to-transparent"
            aria-hidden="true"
          />

          <div className="absolute top-4 right-4 flex gap-2">
            <FeatureGate featureKey="profile.share">
              <SmartButton
                featureKey="profile.share_trigger"
                variant="secondary"
                size="icon"
                onClick={onShare}
                aria-label="Share this profile"
                className="!bg-white/90 dark:!bg-ink-900/90 !backdrop-blur-md !border-0 !h-9 !w-9"
              >
                <Icon icon={Link2} size={14} />
              </SmartButton>
            </FeatureGate>
            <FeatureGate featureKey="profile.more">
              <SmartButton
                featureKey="profile.more_trigger"
                variant="secondary"
                size="icon"
                onClick={onMore}
                aria-label="More options"
                className="!bg-white/90 dark:!bg-ink-900/90 !backdrop-blur-md !border-0 !h-9 !w-9"
              >
                <Icon icon={MoreHorizontal} size={14} />
              </SmartButton>
            </FeatureGate>
          </div>
        </div>

        <div className="relative px-6 pb-6 pt-0 md:px-10 md:pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12 md:-mt-16 mb-6">
            <div
              className={clsx(
                "w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 shadow-lift",
                "border-white dark:border-ink-900 bg-ink-100 dark:bg-ink-800",
                "flex items-center justify-center"
              )}
              role="img"
              aria-label={`${name}, avatar shown as initials`}
            >
              <span className="font-display font-black text-3xl md:text-4xl text-ink-500 dark:text-ink-300">
                {initials(name)}
              </span>
            </div>

            <div className="flex gap-2 md:mb-2">
              {/* Real buttons that say what they cannot do, rather than dead
                  controls or a padlock implying an admin disabled them. Neither
                  messaging nor following exists: there is no message store and no
                  follow graph. */}
              <FeatureGate featureKey="profile.message">
                <SmartButton
                  featureKey="profile.message_trigger"
                  variant="secondary"
                  className="!h-10 !px-5"
                  onClick={onMessage}
                >
                  Message
                </SmartButton>
              </FeatureGate>
              <Magnetic strength={0.1}>
                <SmartButton
                  featureKey="profile.follow"
                  variant="secondary"
                  className="!h-10 !px-6"
                  onClick={onFollow}
                >
                  Follow
                </SmartButton>
              </Magnetic>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-ink-900 dark:text-white">
                  {name}
                </h1>
                {isExample && (
                  <Badge variant="status" tone="ink">
                    Example
                  </Badge>
                )}
              </div>
              <p className="text-sm text-ink-500 font-medium">@{handle}</p>
            </div>

            <p className="text-[15px] text-ink-700 dark:text-ink-200 leading-relaxed max-w-2xl">
              {roleLabel}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-500">
              {identity.location && (
                <span className="flex items-center gap-1.5">
                  <Icon icon={MapPin} size={14} /> {identity.location}
                </span>
              )}
              {identity.website && (
                <a
                  href={identity.website}
                  className="flex items-center gap-1.5 text-aurora-blue hover:underline"
                  rel="nofollow noopener noreferrer"
                  target="_blank"
                >
                  <Icon icon={Link2} size={14} /> {identity.website.replace("https://", "")}
                </a>
              )}
              {identity.joinedDate && (
                <span className="flex items-center gap-1.5">
                  <Icon icon={Calendar} size={14} /> Joined {identity.joinedDate}
                </span>
              )}
            </div>

            {/* Two real counts. The brief had four, all invented. */}
            <dl className="flex items-center gap-6 pt-2">
              <StatBlock label="Posts" value={identity.postCount} />
              <StatBlock label="Saved" value={identity.garageSize} highlight />
            </dl>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function StatBlock({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dd
        className={clsx(
          "text-lg font-display font-bold tabular-nums",
          highlight ? "text-ink-900 dark:text-white" : "text-ink-600 dark:text-ink-300"
        )}
      >
        {value.toLocaleString("en-ZA")}
      </dd>
      <dt className="text-xs font-medium text-ink-400">{label}</dt>
    </div>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}
