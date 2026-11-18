"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Users } from "lucide-react";
import { GroupCard } from "@/components/groups/GroupCard";
import { CreateGroupModal } from "@/components/groups/CreateGroupModal";
import { SmartButton } from "@/components/ui/SmartButton";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/motion/Reveal";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { useGroups } from "@/components/providers/GroupsProvider";
import { GROUPS_DISCLOSURE, NO_JOINABLE_GROUPS } from "@/lib/groups";

/**
 * The groups directory.
 *
 * The brief seeded three invented communities with member counts in the thousands.
 * There is no groups service, so the directory lists only groups the reader has
 * created on this device, and says so before the list rather than after it. The
 * empty state explains why it is empty instead of implying the platform is new.
 */
export function GroupsDirectory() {
  const { groups, isHydrated } = useGroups();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return groups;
    return groups.filter(
      (group) =>
        group.name.toLowerCase().includes(term) ||
        group.description.toLowerCase().includes(term),
    );
  }, [groups, query]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Reveal variant="up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-ink-900 dark:text-white">Groups</h1>
            <p className="text-ink-500 dark:text-ink-300 mt-1">
              Keep your own communities together. Groups live on your device.
            </p>
          </div>
          <FeatureGate featureKey="groups.create">
            <SmartButton featureKey="groups.create_trigger" leftIcon={Plus} onClick={() => setIsCreateOpen(true)}>
              Create group
            </SmartButton>
          </FeatureGate>
        </div>
      </Reveal>

      <Reveal variant="up">
        <div className="mb-8 rounded-2xl border border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-900/50 p-5">
          <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed max-w-3xl">
            {GROUPS_DISCLOSURE}
          </p>
        </div>
      </Reveal>

      {groups.length > 0 && (
        <Reveal variant="up" delay={100}>
          <div className="mb-6">
            <Input
              placeholder="Search your groups…"
              leftIcon={Search}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search your groups"
            />
          </div>
        </Reveal>
      )}

      {!isHydrated ? null : groups.length === 0 ? (
        <Reveal variant="up" delay={150}>
          <EmptyState
            icon={Users}
            title="No groups yet"
            description={NO_JOINABLE_GROUPS}
            actionLabel="Create a group"
            actionFeatureKey="groups.create_trigger"
            onAction={() => setIsCreateOpen(true)}
          />
        </Reveal>
      ) : filtered.length === 0 ? (
        <Reveal variant="up" delay={150}>
          <EmptyState
            icon={Search}
            title="No groups match that"
            description={`Nothing in your groups matches "${query.trim()}".`}
          />
        </Reveal>
      ) : (
        <Reveal variant="up" delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </Reveal>
      )}

      <CreateGroupModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
