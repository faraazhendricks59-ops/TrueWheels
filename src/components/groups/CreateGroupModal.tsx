"use client";

import { useEffect, useId, useState } from "react";
import { Globe, Lock, Palette, Shield } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { SmartButton } from "@/components/ui/SmartButton";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { useGroups } from "@/components/providers/GroupsProvider";
import {
  ACCENT_CLASSES,
  GROUP_ACCENTS,
  PRIVACY_DESCRIPTIONS,
  PRIVACY_LABELS,
  GROUP_LOCAL_ONLY,
  type GroupAccent,
  type GroupPrivacy,
} from "@/lib/groups";

const PRIVACY_TIERS: { id: GroupPrivacy; icon: typeof Globe; color: string; bg: string; border: string }[] = [
  { id: "public", icon: Globe, color: "text-semantic-success", bg: "bg-semantic-success/10", border: "border-semantic-success/40" },
  { id: "private", icon: Lock, color: "text-semantic-warning", bg: "bg-semantic-warning/10", border: "border-semantic-warning/40" },
  { id: "secret", icon: Shield, color: "text-ink-400", bg: "bg-ink-100 dark:bg-ink-800", border: "border-ink-300 dark:border-ink-600" },
];

/**
 * The creation flow.
 *
 * The group is really created: it is written to this browser and appears in the
 * directory and at its own route. The brief's version faked the work with a 1.5s
 * timer and answered with a fabricated receipt — "Group ID: #GRP-88291" — through a
 * `variant: "trust"` toast, which renders a shield beside the words "Verified
 * Action". Nothing about this is verified and no registry issues an id, so the
 * confirmation states only what happened: it was saved to this device.
 */
export function CreateGroupModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { createGroup } = useGroups();
  const { toast } = useToast();
  const descriptionId = useId();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState<GroupPrivacy>("public");
  const [accent, setAccent] = useState<GroupAccent>("brand");

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setPrivacy("public");
      setAccent("brand");
    }
  }, [isOpen]);

  const canSubmit = name.trim().length > 0;

  const handleCreate = () => {
    if (!canSubmit) return;
    createGroup({ name, description, privacy, accent });
    toast({
      variant: "success",
      title: "Group saved to this device",
      description: `"${name.trim()}" was added. It is stored in this browser only, and no one else can see or join it.`,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create a group"
      description="A group you make here is kept on this device. It is not published, and nobody else can see it."
      maxWidth="lg"
      footer={
        <>
          <SmartButton featureKey="groups.cancel_create" variant="ghost" onClick={onClose}>
            Cancel
          </SmartButton>
          <SmartButton
            featureKey="groups.submit_create"
            onClick={handleCreate}
            disabled={!canSubmit}
          >
            Save group
          </SmartButton>
        </>
      }
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <Input
            label="Group name"
            placeholder="e.g. Weekend track days"
            value={name}
            onChange={(event) => setName(event.target.value)}
            hint="A name you will recognise later."
            maxLength={60}
          />
          <div>
            <label
              htmlFor={descriptionId}
              className="text-xs font-semibold text-ink-600 dark:text-ink-300 uppercase tracking-wide block mb-1.5"
            >
              Description
            </label>
            <textarea
              id={descriptionId}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              maxLength={280}
              placeholder="What is this group for?"
              className="w-full p-3 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-sm text-ink-900 dark:text-white placeholder:text-ink-400 focus:outline-none focus:border-brand transition-colors resize-none"
            />
          </div>
        </div>

        <fieldset>
          <legend className="text-xs font-semibold text-ink-600 dark:text-ink-300 uppercase tracking-wide mb-3">
            Privacy level
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRIVACY_TIERS.map((tier) => {
              const TierIcon = tier.icon;
              const isSelected = privacy === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setPrivacy(tier.id)}
                  className={clsx(
                    "p-4 rounded-xl border-2 text-left transition-all",
                    isSelected
                      ? `${tier.border} ${tier.bg}`
                      : "border-ink-100 dark:border-ink-800 hover:border-ink-200 dark:hover:border-ink-700",
                  )}
                >
                  <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center mb-2", tier.bg, tier.color)}>
                    <Icon icon={TierIcon} size={16} />
                  </div>
                  <p className="text-sm font-bold text-ink-900 dark:text-white mb-1">
                    {PRIVACY_LABELS[tier.id]}
                  </p>
                  <p className="text-[10px] text-ink-500 dark:text-ink-400 leading-relaxed">
                    {PRIVACY_DESCRIPTIONS[tier.id]}
                  </p>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-ink-400 mt-2 leading-relaxed">
            The setting is recorded on the group and shown as a label. It does not change who can see
            the group, because there is no server and no other member.
          </p>
        </fieldset>

        <fieldset>
          <legend className="text-xs font-semibold text-ink-600 dark:text-ink-300 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Icon icon={Palette} size={12} /> Accent colour
          </legend>
          <div className="flex gap-3">
            {GROUP_ACCENTS.map((value) => (
              <button
                key={value}
                type="button"
                aria-label={value}
                aria-pressed={accent === value}
                onClick={() => setAccent(value)}
                className={clsx(
                  "w-10 h-10 rounded-xl transition-all",
                  ACCENT_CLASSES[value].solid,
                  accent === value
                    ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-ink-900 ring-ink-900 dark:ring-white scale-110"
                    : "hover:scale-105",
                )}
              />
            ))}
          </div>
        </fieldset>

        <p className="text-[11px] text-ink-400 leading-relaxed">{GROUP_LOCAL_ONLY}</p>
      </div>
    </Modal>
  );
}
