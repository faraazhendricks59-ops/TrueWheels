"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DRAFTS_KEY,
  EMPTY_DRAFTS,
  draftId,
  parseDrafts,
  type MessageDraft,
  type MessageKind,
} from "@/lib/messages";
import type { DemoVehicle } from "@/lib/demo/vehicles";

interface DraftInput {
  vehicle: DemoVehicle;
  kind: MessageKind;
  body: string;
}

interface MessagesContextValue {
  drafts: MessageDraft[];
  isHydrated: boolean;
  /** Saves a message, replacing any earlier one for the same listing and kind. */
  saveDraft: (input: DraftInput) => string;
  updateDraftBody: (id: string, body: string) => void;
  removeDraft: (id: string) => void;
}

const MessagesContext = createContext<MessagesContextValue>({
  drafts: [],
  isHydrated: false,
  saveDraft: () => "",
  updateDraftBody: () => {},
  removeDraft: () => {},
});

export const useMessages = () => useContext(MessagesContext);

/**
 * The messages the reader has written, kept on their device.
 *
 * Mirrors the other providers: first render is empty so server and client agree,
 * then storage is read in an effect. Saving the same listing and kind twice updates
 * the existing message rather than piling up duplicates, because a buyer revising an
 * offer wants one offer, not three.
 */
export function MessagesProvider({ children }: { children: ReactNode }) {
  const [drafts, setDrafts] = useState<MessageDraft[]>(EMPTY_DRAFTS);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFTS_KEY);
      setDrafts(raw ? parseDrafts(JSON.parse(raw)) : EMPTY_DRAFTS);
    } catch {
      setDrafts(EMPTY_DRAFTS);
    }
    setIsHydrated(true);
  }, []);

  const persist = useCallback((next: MessageDraft[]) => {
    setDrafts(next);
    try {
      window.localStorage.setItem(DRAFTS_KEY, JSON.stringify(next));
    } catch {
      // Quota or private mode: the session keeps working, it just will not survive a reload.
    }
  }, []);

  const saveDraft = useCallback<MessagesContextValue["saveDraft"]>(
    ({ vehicle, kind, body }) => {
      const id = draftId(vehicle.id, kind);
      const now = new Date().toISOString();
      const existing = drafts.find((draft) => draft.id === id);
      const record: MessageDraft = {
        id,
        vehicleId: vehicle.id,
        vehicleTitle: vehicle.title,
        vehiclePrice: vehicle.price,
        vehicleLocation: vehicle.location,
        kind,
        body,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };
      persist([record, ...drafts.filter((draft) => draft.id !== id)]);
      return id;
    },
    [drafts, persist],
  );

  const updateDraftBody = useCallback<MessagesContextValue["updateDraftBody"]>(
    (id, body) => {
      persist(
        drafts.map((draft) =>
          draft.id === id ? { ...draft, body, updatedAt: new Date().toISOString() } : draft,
        ),
      );
    },
    [drafts, persist],
  );

  const removeDraft = useCallback<MessagesContextValue["removeDraft"]>(
    (id) => {
      persist(drafts.filter((draft) => draft.id !== id));
    },
    [drafts, persist],
  );

  const value = useMemo(
    () => ({ drafts, isHydrated, saveDraft, updateDraftBody, removeDraft }),
    [drafts, isHydrated, saveDraft, updateDraftBody, removeDraft],
  );

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}
