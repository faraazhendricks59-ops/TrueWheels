"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

/**
 * A live offline badge.
 *
 * The brief's version also had a "Syncing" state, driven by a custom event the service
 * worker never sent. Nothing in the app syncs in the background, so that state could
 * never be reached honestly — it is removed, and the badge shows the one thing the
 * browser actually tells us: whether there is a connection.
 *
 * It renders nothing when online, so it never takes space from the navigation for the
 * normal case.
 */
export function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <span
      role="status"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-semantic-error/10 text-semantic-error border border-semantic-error/20"
    >
      <Icon icon={WifiOff} size={10} />
      Offline
    </span>
  );
}
