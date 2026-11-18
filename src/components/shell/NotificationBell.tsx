"use client";

import { clsx } from "clsx";

import { useRef, useState } from "react";
import { Bell } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/motion/Magnetic";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { useNotifications } from "@/components/providers/NotificationProvider";
import { NotificationCenter } from "./NotificationCenter";

export function NotificationBell({ onDark }: { onDark?: boolean } = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { unreadCount } = useNotifications();

  return (
    <FeatureGate featureKey="ui.notification_center">
      <div className="relative">
        <Magnetic strength={0.2}>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
            className={clsx(
              "relative p-2.5 rounded-xl transition-colors",
              onDark
                ? "text-white hover:bg-white/10"
                : "text-ink-500 hover:text-ink-900 dark:hover:text-white hover:bg-ink-50 dark:hover:bg-ink-900",
            )}
          >
            <Icon icon={Bell} size={18} />

            {unreadCount > 0 && (
              <>
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-brand animate-pulse-ring"
                />
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-ink-950 tabular-nums">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              </>
            )}
          </button>
        </Magnetic>

        <NotificationCenter
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          anchorRef={triggerRef}
        />
      </div>
    </FeatureGate>
  );
}
