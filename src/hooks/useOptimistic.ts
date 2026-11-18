"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";

const STORAGE_PREFIX = "truewheels_social_action:";

function readFlag(storageKey: string): boolean | null {
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${storageKey}`);
    if (raw === null) return null;
    return raw === "1";
  } catch {
    return null;
  }
}

/**
 * An interaction that updates immediately and rolls back if it cannot be saved.
 *
 * The brief's version wrapped a "simulated API call" that was
 * `() => Promise.resolve(true)`, so it could never fail: the rollback branch, the
 * error toast and the `isPending` flag were unreachable code. A rollback that
 * cannot fire is not a rollback, it is a decoration, and `Promise.resolve(true)`
 * as a stand-in for a network call is exactly the kind of thing that hides a real
 * failure later.
 *
 * There is no server to call, so this does not pretend to call one. It writes the
 * reader's own action to localStorage, which is the only store this project has,
 * and the rollback fires on a real error: `setItem` throws in private mode and
 * when the quota is full. That is a genuine failure path, and the state genuinely
 * reverts when it happens.
 *
 * The action is per-reader and per-device. Nothing is sent anywhere, so nobody
 * else's rev or boost is counted, which is why the button shows a word rather
 * than a number.
 */
export function useOptimistic(storageKey: string, initiallyActive: boolean) {
  const [isActive, setIsActive] = useState(initiallyActive);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const stored = readFlag(storageKey);
    if (stored !== null) setIsActive(stored);
  }, [storageKey]);

  const toggle = useCallback(() => {
    const previous = isActive;
    const next = !isActive;

    setIsActive(next);
    setIsPending(true);

    try {
      window.localStorage.setItem(`${STORAGE_PREFIX}${storageKey}`, next ? "1" : "0");
      setIsPending(false);
    } catch {
      setIsActive(previous);
      setIsPending(false);
      toast({
        variant: "error",
        title: "Could not save that",
        description:
          "This browser is not allowing storage, so the change was undone. Private browsing blocks it.",
      });
    }
  }, [isActive, storageKey, toast]);

  return { isActive, isPending, toggle };
}
