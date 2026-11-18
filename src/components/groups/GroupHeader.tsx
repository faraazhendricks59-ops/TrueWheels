"use client";

import { Globe, Lock, Shield, Users, Trash2 } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { SmartButton } from "@/components/ui/SmartButton";
import { Reveal } from "@/components/motion/Reveal";
import { ACCENT_CLASSES, PRIVACY_LABELS, GROUP_LOCAL_ONLY, type GroupRecord } from "@/lib/groups";

const PRIVACY_ICON = { public: Globe, private: Lock, secret: Shield } as const;
const PRIVACY_TONE = { public: "green", private: "amber", secret: "ink" } as const;

interface GroupHeaderProps {
  group: GroupRecord;
  onDelete: () => void;
}

/**
 * The identity anchor for a group.
 *
 * The brief's version carried a member count, a post count and an admin count, and
 * a "Manage Group" button. None of those numbers exist: the group has one member,
 * no posts and one admin, because the reader created it on their own device. The
 * brief also imported `TrustBadge` here, which renders a shield beside the word
 * "Verified"; nothing about a self-created group is verified, so it is not used.
 *
 * The only real action is deleting the group from this browser, which is what the
 * header offers.
 */
export function GroupHeader({ group, onDelete }: GroupHeaderProps) {
  const accent = ACCENT_CLASSES[group.accent];
  const PrivacyIcon = PRIVACY_ICON[group.privacy];

  return (
    <Reveal variant="up">
      <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-sm overflow-hidden">
        <div className={clsx("relative h-32 md:h-44", accent.soft)}>
          <div className={clsx("absolute inset-x-0 bottom-0 h-1.5", accent.solid)} />
        </div>

        <div className="relative px-6 pb-6 pt-0 md:px-10 md:pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12 md:-mt-14 mb-6">
            <div
              className={clsx(
                "w-24 h-24 md:w-28 md:h-28 rounded-3xl flex items-center justify-center text-white font-display font-bold text-4xl border-4 shadow-lift",
                "border-white dark:border-ink-900",
                accent.solid,
              )}
            >
              {group.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex gap-2 md:mb-2">
              <SmartButton
                featureKey="groups.delete"
                variant="outline"
                className="!h-10 !px-5"
                leftIcon={Trash2}
                onClick={onDelete}
              >
                Delete group
              </SmartButton>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-ink-900 dark:text-white">
                  {group.name}
                </h1>
                <Badge variant="status" tone={PRIVACY_TONE[group.privacy]}>
                  <Icon icon={PrivacyIcon} size={10} />
                  {PRIVACY_LABELS[group.privacy]}
                </Badge>
              </div>
              <p className="text-[15px] text-ink-700 dark:text-ink-200 leading-relaxed max-w-3xl whitespace-pre-wrap">
                {group.description || "No description."}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 text-sm text-ink-500 dark:text-ink-400">
              <Icon icon={Users} size={14} />
              <span className="font-bold text-ink-900 dark:text-white tabular-nums">1</span>
              <span>member — you created this group</span>
            </div>

            <p className="text-[11px] text-ink-400 leading-relaxed">{GROUP_LOCAL_ONLY}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
