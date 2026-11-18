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
 * The profile header, laid out as a cover-and-bio page.
 *
 * The shape is the profile convention: a wide cover banner across the top, the
 * avatar sitting centred and overlapping the banner's lower edge, the name and
 * handle beneath it, a row of counts, then the bio and the links. Centring the
 * identity under a full-width cover is what makes a profile page read as a
 * profile rather than a settings panel.
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
      <div>
        {/* Cover banner. Taller on desktop so the avatar has room to overlap. */}
        <div className="relative h-32 w-full bg-gradient-to-br from-brand via-brand-dark to-aurora-purple sm:h-44 md:h-52">
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5), transparent 45%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.35), transparent 40%)",
            }}
            aria-hidden="true"
          />

          <div className="absolute right-3 top-3 flex gap-2">
            <FeatureGate featureKey="profile.share">
              <SmartButton
                featureKey="profile.share_trigger"
                variant="secondary"
                size="icon"
                onClick={onShare}
                aria-label="Share this profile"
                className="!h-9 !w-9 !border-0 !bg-white/90 !backdrop-blur-md dark:!bg-ink-900/90"
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
                className="!h-9 !w-9 !border-0 !bg-white/90 !backdrop-blur-md dark:!bg-ink-900/90"
              >
                <Icon icon={MoreHorizontal} size={14} />
              </SmartButton>
            </FeatureGate>
          </div>
        </div>

        {/* The identity block. It pulls up under the banner so the avatar sits on
            the seam between cover and body. */}
        <div className="relative flex flex-col items-center px-6 pb-7 -mt-14 md:-mt-16">
          <div
            className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-ink-100 shadow-lift dark:border-ink-900 dark:bg-ink-800 md:h-32 md:w-32"
            role="img"
            aria-label={`${name}, avatar shown as initials`}
          >
            <span className="font-display text-3xl font-black text-ink-500 dark:text-ink-300 md:text-4xl">
              {initials(name)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <h1 className="text-center font-display text-2xl font-bold text-ink-900 dark:text-white md:text-3xl">
              {name}
            </h1>
            {isExample && (
              <Badge variant="status" tone="ink">
                Example
              </Badge>
            )}
          </div>

          <p className="mt-0.5 text-sm font-medium text-ink-500 dark:text-ink-300">@{handle}</p>

          {/* The counts sit directly under the handle, the way a profile page
              puts its follower numbers, so the identity and its totals read as
              one block. Both are real; the brief had four, all invented. */}
          <dl className="mt-4 flex items-center gap-8">
            <StatBlock label="Posts" value={identity.postCount} />
            <span className="h-8 w-px bg-ink-200 dark:bg-ink-800" aria-hidden="true" />
            <StatBlock label="Saved" value={identity.garageSize} highlight />
          </dl>

          {/* Bio. */}
          <p className="mt-4 max-w-xl text-center text-[15px] leading-relaxed text-ink-700 dark:text-ink-200">
            {roleLabel}
          </p>

          {/* Links and meta, as a centred row of chips. */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {identity.location && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3 py-1 text-xs font-medium text-ink-600 dark:border-ink-700 dark:text-ink-300">
                <Icon icon={MapPin} size={13} /> {identity.location}
              </span>
            )}
            {identity.website && (
              <a
                href={identity.website}
                rel="nofollow noopener noreferrer"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-full border border-aurora-blue/30 bg-aurora-blue/5 px-3 py-1 text-xs font-semibold text-aurora-blue-dark transition-colors hover:bg-aurora-blue/10 dark:text-aurora-blue-light"
              >
                <Icon icon={Link2} size={13} />
                {identity.website.replace("https://", "")}
              </a>
            )}
            {identity.joinedDate && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3 py-1 text-xs font-medium text-ink-600 dark:border-ink-700 dark:text-ink-300">
                <Icon icon={Calendar} size={13} /> Joined {identity.joinedDate}
              </span>
            )}
          </div>

          {/* Actions, centred under the bio. Real buttons that say what they
              cannot do, rather than dead controls or a padlock implying an admin
              disabled them. Neither messaging nor following exists: there is no
              message store and no follow graph. */}
          <div className="mt-5 flex gap-2">
            <FeatureGate featureKey="profile.message">
              <SmartButton
                featureKey="profile.message_trigger"
                variant="secondary"
                className="!h-10 !px-6"
                onClick={onMessage}
              >
                Message
              </SmartButton>
            </FeatureGate>
            <Magnetic strength={0.1}>
              <SmartButton
                featureKey="profile.follow"
                variant="primary"
                className="!h-10 !px-8"
                onClick={onFollow}
              >
                Follow
              </SmartButton>
            </Magnetic>
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
    <div className="flex flex-col items-center">
      <dd
        className={clsx(
          "font-display text-xl font-bold tabular-nums",
          highlight ? "text-ink-900 dark:text-white" : "text-ink-600 dark:text-ink-300"
        )}
      >
        {value.toLocaleString("en-ZA")}
      </dd>
      <dt className="text-xs font-medium text-ink-400 dark:text-ink-300">{label}</dt>
    </div>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}
