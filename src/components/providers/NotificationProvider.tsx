"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { SEED_NOTIFICATIONS, type Notification, type NotificationType } from "@/lib/notifications";
import { useAnnounce } from "@/components/a11y/AriaLiveAnnouncer";
import { useFeatureFlags } from "@/lib/feature-flags";

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismiss: (id: string) => void;
  push: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  dismiss: () => {},
  push: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS);
  const { announce } = useAnnounce();
  const { isEnabled } = useFeatureFlags();

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const push = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
      // A notification whose category the admin has switched off is dropped at
      // the source, so it cannot appear in the list or the badge count.
      if (!isEnabled(`notifications.${notification.type}` as never)) return;
      const entry: Notification = {
        ...notification,
        id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        read: false,
      };
      setNotifications((prev) => [entry, ...prev]);
      announce(`New notification: ${notification.title}`);
    },
    [announce, isEnabled]
  );

  // Placeholder for the Firestore onSnapshot subscription. Kept behind its own
  // flag so it can be switched off; a background timer that injects rows into
  // every visitor's list is not something to leave running by default in a demo.
  useEffect(() => {
    if (!isEnabled("ui.notification_simulation")) return;
    const types: NotificationType[] = ["bid", "message", "saved_search", "ai"];
    const interval = setInterval(() => {
      const type = types[Math.floor(Math.random() * types.length)];
      push({
        type,
        title: "Live platform event",
        body: "A realtime event arrived from the marketplace.",
        href: "/dashboard",
        provenance: "Realtime channel (simulated)",
      });
    }, 45_000);
    return () => clearInterval(interval);
  }, [push, isEnabled]);

  const value = useMemo(
    () => ({ notifications, unreadCount, markAsRead, markAllAsRead, dismiss, push }),
    [notifications, unreadCount, markAsRead, markAllAsRead, dismiss, push]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
