"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { CheckCheck, Settings2, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { useNotifications } from "@/components/providers/NotificationProvider";
import { NOTIFICATION_CONFIG, NOTIFICATION_TYPES, type NotificationType } from "@/lib/notifications";
import { formatDistanceToNow } from "@/lib/utils";
import { useEscapeKey, useScrollLock } from "@/components/ui/overlay-hooks";
import { NotificationPreferences } from "./NotificationPreferences";

type Tab = "all" | "unread" | "alerts" | "preferences";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "alerts", label: "Alerts" },
  { id: "preferences", label: "Preferences" },
];

const ALERT_TYPES: NotificationType[] = ["bid", "saved_search", "verification"];

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement>;
}

export function NotificationCenter({ isOpen, onClose, anchorRef }: NotificationCenterProps) {
  const { notifications, markAsRead, markAllAsRead, dismiss } = useNotifications();
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all");
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useScrollLock(isOpen);
  useEscapeKey(isOpen, onClose);

  // Clicking away closes the panel, but clicking the bell itself must not, or
  // the toggle would close and immediately reopen.
  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isOpen, onClose, anchorRef]);

  // Restore focus to the bell when the panel closes.
  useEffect(() => {
    if (!isOpen) return;
    const anchor = anchorRef.current;
    return () => anchor?.focus();
  }, [isOpen, anchorRef]);

  const filtered = useMemo(() => {
    let list = notifications;
    if (activeTab === "unread") list = list.filter((n) => !n.read);
    if (activeTab === "alerts") list = list.filter((n) => ALERT_TYPES.includes(n.type));
    if (typeFilter !== "all") list = list.filter((n) => n.type === typeFilter);
    return list;
  }, [notifications, activeTab, typeFilter]);

  if (!isOpen || !mounted) return null;

  // Rendered through a portal: the bell sits inside the fixed header, which
  // uses a backdrop blur once scrolled. A backdrop-filter creates a containing
  // block, so a fixed-position panel would be clipped to the header's box
  // instead of covering the viewport.
  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[80] bg-ink-950/40 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        className={clsx(
          "fixed z-[85] bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 shadow-lift overflow-hidden animate-scale-in flex flex-col",
          "inset-0",
          "lg:absolute lg:inset-auto lg:top-[calc(var(--header-height)+var(--sat)+0.5rem)] lg:right-4 lg:w-[420px] lg:h-[600px] lg:max-h-[calc(100vh-var(--header-height)-2rem)] lg:rounded-2xl"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-ink-100 dark:border-ink-800 flex-shrink-0">
          <h2 className="font-display font-bold text-ink-900 dark:text-white">Notifications</h2>
          <div className="flex items-center gap-1">
            {activeTab !== "preferences" && (
              <button
                type="button"
                onClick={markAllAsRead}
                title="Mark all as read"
                aria-label="Mark all as read"
                className="p-2 text-ink-400 hover:text-brand transition-colors rounded-lg hover:bg-ink-50 dark:hover:bg-ink-800"
              >
                <Icon icon={CheckCheck} size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close notifications"
              className="p-2 text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors rounded-lg hover:bg-ink-50 dark:hover:bg-ink-800"
            >
              <Icon icon={X} size={16} />
            </button>
          </div>
        </div>

        <div role="tablist" aria-label="Notification views" className="flex gap-1 p-2 border-b border-ink-100 dark:border-ink-800 overflow-x-auto hide-scrollbar flex-shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors",
                activeTab === tab.id ? "bg-brand text-white" : "text-ink-500 hover:bg-ink-50 dark:hover:bg-ink-800"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "preferences" ? (
          <NotificationPreferences />
        ) : (
          <>
            <div className="flex gap-1.5 p-3 overflow-x-auto hide-scrollbar border-b border-ink-100 dark:border-ink-800 flex-shrink-0">
              <FilterChip active={typeFilter === "all"} onClick={() => setTypeFilter("all")} label="All" />
              {NOTIFICATION_TYPES.map((type) => (
                <FeatureGate key={type} featureKey={`notifications.${type}` as never}>
                  <FilterChip
                    active={typeFilter === type}
                    onClick={() => setTypeFilter(type)}
                    label={NOTIFICATION_CONFIG[type].label}
                    icon={NOTIFICATION_CONFIG[type].icon}
                    color={NOTIFICATION_CONFIG[type].color}
                  />
                </FeatureGate>
              ))}
            </div>

            <ul className="flex-1 overflow-y-auto divide-y divide-ink-100 dark:divide-ink-800">
              {filtered.length === 0 ? (
                <li className="p-12 text-center">
                  <p className="text-sm text-ink-500 dark:text-ink-400">No notifications yet.</p>
                  <p className="text-xs text-ink-400 mt-1 max-w-xs mx-auto">
                    This centre is not connected to a notification service, so nothing is
                    generated for you yet.
                  </p>
                </li>
              ) : (
                filtered.map((n) => {
                  const config = NOTIFICATION_CONFIG[n.type];
                  return (
                    <li
                      key={n.id}
                      className={clsx(
                        "group relative p-4 flex items-start gap-3 transition-colors hover:bg-ink-50/50 dark:hover:bg-ink-950/50",
                        !n.read && "bg-brand/[0.03]"
                      )}
                    >
                      {!n.read && (
                        <span
                          aria-label="Unread"
                          className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand"
                        />
                      )}

                      <span className={clsx("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", config.bg, config.color)}>
                        <Icon icon={config.icon} size={16} />
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <p className={clsx("text-sm truncate", n.read ? "text-ink-600 dark:text-ink-300" : "font-semibold text-ink-900 dark:text-white")}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-ink-400 whitespace-nowrap flex-shrink-0">
                            {formatDistanceToNow(n.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-ink-500 dark:text-ink-300 line-clamp-2 mb-2">{n.body}</p>

                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] text-ink-400 italic truncate">{n.provenance}</span>
                          <span className="flex items-center gap-2 flex-shrink-0">
                            {n.actionLabel && (
                              <a
                                href={n.href}
                                onClick={() => {
                                  markAsRead(n.id);
                                  onClose();
                                }}
                                className="text-xs font-semibold text-brand hover:underline"
                              >
                                {n.actionLabel}
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => dismiss(n.id)}
                              aria-label={`Dismiss ${n.title}`}
                              className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 text-ink-400 hover:text-semantic-error transition-all"
                            >
                              <Icon icon={X} size={12} />
                            </button>
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </>
        )}
      </div>
    </>,
    document.body
  );
}

function FilterChip({
  active,
  onClick,
  label,
  icon,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: LucideIcon;
  color?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap border transition-colors",
        active
          ? "bg-ink-900 dark:bg-white text-white dark:text-ink-900 border-transparent"
          : "bg-transparent border-ink-200 dark:border-ink-700 text-ink-500 hover:border-ink-300"
      )}
    >
      {icon && <Icon icon={icon} size={10} className={active ? "" : color} />}
      {label}
    </button>
  );
}
