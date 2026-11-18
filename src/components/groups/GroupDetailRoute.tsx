"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { useGroups } from "@/components/providers/GroupsProvider";
import { GroupDetailView } from "@/components/groups/GroupDetailView";

/**
 * Resolves a group slug against the reader's own store.
 *
 * Groups live only in this browser, so the lookup has to happen on the client. An
 * unknown slug is a real possibility — a stale link, or a group cleared with site
 * data — and it gets an explicit not-found state rather than a fallback to a
 * different group, which is what the brief's constant-driven page would have done.
 */
export function GroupDetailRoute({ slug }: { slug: string }) {
  const { groups, isHydrated } = useGroups();

  if (!isHydrated) return null;

  const group = groups.find((entry) => entry.slug === slug);

  if (!group) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
        <EmptyState
          icon={Users}
          title="Group not found"
          description={`No group with the address "${slug}" exists on this device. Groups are stored in this browser, so one you made elsewhere or after clearing site data will not be here.`}
        />
        <p className="text-center mt-6">
          <Link href="/groups" className="text-sm font-semibold text-brand hover:underline">
            Back to groups
          </Link>
        </p>
      </div>
    );
  }

  return <GroupDetailView group={group} />;
}
