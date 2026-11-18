"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from "react";
import { SEED_NOTIFICATIONS, type Notification, type NotificationType } from "@/lib/notifications";
import { useAnnounce } from "@/components/a11y/AriaLiveAnnouncer";
import { useFeatureFlags } from "@/lib/feature-flags";
import {
  evaluateDelivery,
  getNotificationPreferences,
  isQuietNow,
} from "@/lib/notification-preferences";

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismiss: (id: string) => void;
  push: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  /** How many notifications are being held back by quiet hours. */
  heldCount: number;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  dismiss: () => {},
  push: () => {},
  heldCount: 0,
});

export const useNotifications = () => useContext(NotificationContext);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS);
  // Notifications held by Do Not Disturb, released when the quiet window ends.
  const [held, setHeld] = useState<Omit<Notification, "id" | "timestamp" | "read">[]>([]);
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

  const materialise = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
      const entry: Notification = {
        ...notification,
        id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        read: false,
      };
      setNotifications((prev) => [entry, ...prev]);
      announce(`New notification: ${notification.title}`);
    },
    [announce]
  );

  const push = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
      // Two gates, in order of authority.
      //
      // 1. Admin. A category the platform operator has switched off is dropped at
      //    the source, so it cannot appear in the list or the badge count.
      if (!isEnabled(`notifications.${notification.type}` as never)) return;

      // 2. The account's own preferences. This is what the Notification
      //    preferences screen writes to: a muted category is dropped, and a
      //    category inside quiet hours is held rather than shown.
      const decision = evaluateDelivery(notification.type, getNotificationPreferences());
      if (!decision.deliver) return;
      if (decision.queue) {
        setHeld((prev) => [notification, ...prev].slice(0, 50));
        return;
      }

      materialise(notification);
    },
    [isEnabled, materialise]
  );

  // Release anything held by quiet hours once the window has passed. Checked on a
  // timer rather than only on the next push, so a held notification still arrives
  // even if nothing else happens.
  const heldRef = useRef(held);
  heldRef.current = held;

  useEffect(() => {
    const interval = setInterval(() => {
      if (heldRef.current.length === 0) return;
      if (isQuietNow(getNotificationPreferences())) return;
      const released = heldRef.current;
      setHeld([]);
      // Oldest first, so the list reads in the order things happened.
      released
        .slice()
        .reverse()
        .forEach((notification) => materialise(notification));
    }, 30_000);
    return () => clearInterval(interval);
  }, [materialise]);

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
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      dismiss,
      push,
      heldCount: held.length,
    }),
    [notifications, unreadCount, markAsRead, markAllAsRead, dismiss, push, held]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
