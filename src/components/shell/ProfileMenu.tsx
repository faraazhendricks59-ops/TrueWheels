"use client";

import { clsx } from "clsx";

import { BellRing, ChevronDown, LayoutDashboard, LogOut, Scale, Settings } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { useRouter } from "next/navigation";
import { Dropdown, DropdownItem } from "@/components/ui/Floating";
import { TrustBadge } from "@/components/ui/Badge";
import { useTranslation } from "@/components/providers/I18nProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { ROLE_LABELS } from "@/lib/auth/roles";

export function ProfileMenu({ onDark }: { onDark?: boolean } = {}) {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, role } = useAuth();
  const initials = user?.name
    ? user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()
    : "G";

  const trigger = (
    <span
      data-tour="profile-menu"
      className={clsx(
        "flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-colors cursor-pointer border border-transparent",
        onDark
          ? "hover:bg-white/10 hover:border-white/20"
          : "hover:bg-ink-50 dark:hover:bg-ink-900 hover:border-ink-100 dark:hover:border-ink-800",
      )}
    >
      <span className="w-7 h-7 rounded-full bg-ink-200 dark:bg-ink-700 flex items-center justify-center text-xs font-bold text-ink-600 dark:text-ink-300">
        JD
      </span>
      <Icon
        icon={ChevronDown}
        size={14}
        className={clsx("hidden sm:block", onDark ? "text-white" : "text-ink-400")}
      />
    </span>
  );

  return (
    <Dropdown trigger={trigger} align="right" label="Account menu">
      {/* This block used to read "John Doe" with a "Verified Buyer" badge sourced
          to "FICA documents and 3 successful transactions". The name belonged to
          nobody and the check has never been performed. It now shows the name the
          session actually carries, and the role, which is a permission level
          rather than a verification. */}
      <div className="px-3 py-3 border-b border-ink-100 dark:border-ink-800 mb-1">
        <p className="text-sm font-semibold text-ink-900 dark:text-white">{user?.name ?? "Not signed in"}</p>
        <p className="text-[11px] text-ink-500 dark:text-ink-400 mt-0.5">{ROLE_LABELS[role]}</p>
      </div>

      <DropdownItem onClick={() => router.push("/dashboard")}>
        <Icon icon={LayoutDashboard} size={14} /> Dashboard
      </DropdownItem>
      <DropdownItem onClick={() => router.push("/saved-searches")}>
        <Icon icon={BellRing} size={14} /> Saved searches
      </DropdownItem>
      <DropdownItem onClick={() => router.push("/compare")}>
        <Icon icon={Scale} size={14} /> Compare vehicles
      </DropdownItem>
      <DropdownItem onClick={() => console.log("Settings")}>
        <Icon icon={Settings} size={14} /> Settings
      </DropdownItem>

      <div className="my-1 h-px bg-ink-100 dark:bg-ink-800" />

      <DropdownItem onClick={() => console.log("Logout")} destructive>
        <Icon icon={LogOut} size={14} /> {t("auth.sign_out")}
      </DropdownItem>
    </Dropdown>
  );
}
