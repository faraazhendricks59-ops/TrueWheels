"use client";

import Link from "next/link";
import { Globe, Lock, Shield, Users } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Magnetic } from "@/components/motion/Magnetic";
import { ACCENT_CLASSES, PRIVACY_LABELS, type GroupRecord } from "@/lib/groups";

const PRIVACY_ICON = { public: Globe, private: Lock, secret: Shield } as const;
const PRIVACY_TONE = { public: "green", private: "amber", secret: "ink" } as const;

/**
 * The discovery primitive.
 *
 * The brief's version showed a member count, a post count and an "Active now"
 * avatar stack on every card. There is no groups service, no member accounts and no
 * post store, so all three would be invented, and the avatar stack would be
 * fabricated people. This card shows what a group actually has: its name, its
 * description, its privacy setting and the single member who made it.
 *
 * The cover is a gradient rather than a photograph, matching VehicleCard: the demo
 * set ships no imagery, and the brief's Unsplash URLs cannot be verified here.
 */
export function GroupCard({ group }: { group: GroupRecord }) {
  const accent = ACCENT_CLASSES[group.accent];
  const PrivacyIcon = PRIVACY_ICON[group.privacy];

  return (
    <Magnetic strength={0.03}>
      <Link
        href={`/groups/${group.slug}`}
        className="block group bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl overflow-hidden hover:border-brand/30 hover:shadow-lift transition-all ease-swift"
      >
        <div className={clsx("relative h-28 overflow-hidden", accent.soft)}>
          <div className={clsx("absolute inset-x-0 bottom-0 h-1", accent.solid)} />
          <div className="absolute top-3 right-3">
            <Badge variant="status" tone={PRIVACY_TONE[group.privacy]}>
              <Icon icon={PrivacyIcon} size={10} />
              {PRIVACY_LABELS[group.privacy]}
            </Badge>
          </div>
        </div>

        <div className="p-5 -mt-8 relative">
          <div
            className={clsx(
              "w-14 h-14 rounded-2xl flex items-center justify-center text-white font-display font-bold text-xl border-4 border-white dark:border-ink-900 shadow-lift mb-3",
              accent.solid,
            )}
          >
            {group.name.charAt(0).toUpperCase()}
          </div>

          <h3 className="text-base font-display font-bold text-ink-900 dark:text-white mb-1 line-clamp-1 group-hover:text-brand transition-colors">
            {group.name}
          </h3>
          <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed line-clamp-2 mb-4 min-h-[2.5rem]">
            {group.description || "No description."}
          </p>

          <div className="flex items-center gap-2 text-xs text-ink-500 dark:text-ink-400">
            <Icon icon={Users} size={12} />
            <span className="font-bold text-ink-700 dark:text-ink-200 tabular-nums">1</span>
            <span>member — you</span>
          </div>
        </div>
      </Link>
    </Magnetic>
  );
}
