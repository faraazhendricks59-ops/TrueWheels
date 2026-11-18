"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  EMPTY_GROUPS,
  GROUPS_KEY,
  parseGroups,
  uniqueSlug,
  type GroupAccent,
  type GroupPrivacy,
  type GroupRecord,
} from "@/lib/groups";

interface GroupsContextValue {
  groups: GroupRecord[];
  isHydrated: boolean;
  /** Creates a group owned by this reader and returns its slug. */
  createGroup: (input: {
    name: string;
    description: string;
    privacy: GroupPrivacy;
    accent: GroupAccent;
  }) => string;
  updateGroup: (id: string, patch: Partial<Omit<GroupRecord, "id">>) => void;
  removeGroup: (id: string) => void;
}

const GroupsContext = createContext<GroupsContextValue>({
  groups: [],
  isHydrated: false,
  createGroup: () => "",
  updateGroup: () => {},
  removeGroup: () => {},
});

export const useGroups = () => useContext(GroupsContext);

/**
 * The reader's own groups, kept on their device.
 *
 * Mirrors GarageProvider: the first render is always empty so the server and the
 * client agree, then the store is read in an effect. Ids are derived from the count
 * of existing entries rather than a random value, so a group created during
 * hydration cannot come out with two different ids on the two passes.
 */
export function GroupsProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<GroupRecord[]>(EMPTY_GROUPS);
  const [isHydrated, setIsHydrated] = useState(false);
  const nextId = useRef(0);

  useEffect(() => {
    let stored: GroupRecord[] = EMPTY_GROUPS;
    try {
      const raw = window.localStorage.getItem(GROUPS_KEY);
      stored = raw ? parseGroups(JSON.parse(raw)) : EMPTY_GROUPS;
    } catch {
      // Corrupt or unavailable storage must not break the page.
      stored = EMPTY_GROUPS;
    }
    nextId.current = stored.length + 1;
    setGroups(stored);
    setIsHydrated(true);
  }, []);

  const persist = useCallback((next: GroupRecord[]) => {
    setGroups(next);
    try {
      window.localStorage.setItem(GROUPS_KEY, JSON.stringify(next));
    } catch {
      // Quota or private mode: the session keeps working, it just will not survive a reload.
    }
  }, []);

  const createGroup = useCallback<GroupsContextValue["createGroup"]>(
    (input) => {
      const id = `grp-${nextId.current++}`;
      const slug = uniqueSlug(input.name, groups);
      const record: GroupRecord = {
        id,
        slug,
        name: input.name.trim(),
        description: input.description.trim(),
        privacy: input.privacy,
        accent: input.accent,
        createdAt: new Date().toISOString(),
      };
      persist([...groups, record]);
      return slug;
    },
    [groups, persist],
  );

  const updateGroup = useCallback<GroupsContextValue["updateGroup"]>(
    (id, patch) => {
      persist(
        groups.map((group) =>
          group.id === id
            ? {
                ...group,
                ...patch,
                // A renamed group keeps a stable slug unless the name changed, in
                // which case the slug is rebuilt against the rest of the store.
                slug: patch.name
                  ? uniqueSlug(patch.name, groups, id)
                  : patch.slug ?? group.slug,
              }
            : group,
        ),
      );
    },
    [groups, persist],
  );

  const removeGroup = useCallback<GroupsContextValue["removeGroup"]>(
    (id) => {
      persist(groups.filter((group) => group.id !== id));
    },
    [groups, persist],
  );

  const value = useMemo(
    () => ({ groups, isHydrated, createGroup, updateGroup, removeGroup }),
    [groups, isHydrated, createGroup, updateGroup, removeGroup],
  );

  return <GroupsContext.Provider value={value}>{children}</GroupsContext.Provider>;
}
