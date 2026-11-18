"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, FileText, Info, Users } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { GroupHeader } from "@/components/groups/GroupHeader";
import { GroupFeed } from "@/components/groups/GroupFeed";
import { GroupMembers } from "@/components/groups/GroupMembers";
import { useGroups } from "@/components/providers/GroupsProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { NO_GROUP_EVENTS, type GroupRecord } from "@/lib/groups";

type GroupTab = "feed" | "members" | "about" | "events";

const TABS: { id: GroupTab; label: string; icon: typeof FileText }[] = [
  { id: "feed", label: "Feed", icon: FileText },
  { id: "members", label: "Members", icon: Users },
  { id: "about", label: "About", icon: Info },
  { id: "events", label: "Events", icon: Calendar },
];

/**
 * A group's page.
 *
 * The tabs are real. Feed, Members and Events each render an honest empty state,
 * because the project has no post store, no accounts and no events diary. About
 * shows the description the reader wrote.
 *
 * The brief's version was driven entirely by constants — a fixed group, fixed
 * members and one fixed post — and would have rendered the same content for any
 * slug, including one that does not exist. Here the slug is looked up in the store
 * the reader owns, and an unknown slug is handled by the route rather than being
 * papered over.
 */
export function GroupDetailView({ group }: { group: GroupRecord }) {
  const [activeTab, setActiveTab] = useState<GroupTab>("feed");
  const { removeGroup } = useGroups();
  const { user } = useAuth();
  const router = useRouter();

  const ownerName = user?.name ?? "You";

  const handleDelete = () => {
    removeGroup(group.id);
    router.push("/groups");
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <Link
        href="/groups"
        className="inline-flex items-center gap-1.5 text-sm text-ink-500 dark:text-ink-400 hover:text-brand mb-4 py-2"
      >
        <Icon icon={ArrowLeft} size={14} />
        All groups
      </Link>

      <GroupHeader group={group} onDelete={handleDelete} />

      <div
        role="tablist"
        aria-label="Group sections"
        className="sticky top-[var(--header-height)] z-30 bg-surface-paper/90 dark:bg-ink-950/90 backdrop-blur-lg border-b border-ink-100 dark:border-ink-800 mt-6"
      >
        <div className="flex gap-1 overflow-x-auto hide-scrollbar py-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold whitespace-nowrap transition-all border-b-2",
                  isActive
                    ? "text-brand border-brand bg-white/50 dark:bg-ink-900/50"
                    : "text-ink-500 border-transparent hover:text-ink-900 dark:hover:text-white",
                )}
              >
                <Icon icon={TabIcon} size={14} strokeWidth={isActive ? 2.5 : 1.75} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="mt-6 min-h-[300px]"
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTab === "feed" && <GroupFeed />}
        {activeTab === "members" && <GroupMembers ownerName={ownerName} />}
        {activeTab === "about" && (
          <Reveal variant="up">
            <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-display font-bold text-ink-900 dark:text-white mb-4">
                About this group
              </h2>
              <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed whitespace-pre-wrap">
                {group.description || "No description was added."}
              </p>
            </div>
          </Reveal>
        )}
        {activeTab === "events" && (
          <Reveal variant="up">
            <div className="bg-white dark:bg-ink-900 border border-dashed border-ink-200 dark:border-ink-800 rounded-2xl p-12 text-center">
              <p className="text-sm text-ink-500 dark:text-ink-300 max-w-md mx-auto leading-relaxed">
                {NO_GROUP_EVENTS}
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
