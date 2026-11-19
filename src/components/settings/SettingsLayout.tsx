"use client";

import type { ReactNode } from "react";
import { clsx } from "clsx";
import { User, Lock, Shield, Smartphone, Palette, Bell, type LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { FeatureGate } from "@/components/feature/FeatureGate";

export type SettingsSection =
  | "profile"
  | "security"
  | "privacy"
  | "notifications"
  | "devices"
  | "appearance";

const SECTIONS: { id: SettingsSection; label: string; icon: LucideIcon; featureKey?: string }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "privacy", label: "Privacy & POPIA", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "devices", label: "Devices", icon: Smartphone, featureKey: "settings.devices" },
  { id: "appearance", label: "Appearance", icon: Palette },
];

interface SettingsLayoutProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
  children: ReactNode;
}

export function SettingsLayout({ activeSection, onSectionChange, children }: SettingsLayoutProps) {
  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      <aside className="hidden lg:block lg:col-span-3">
        <div className="sticky top-[calc(var(--header-height)+var(--sat)+1.5rem)] space-y-1">
          <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-4 px-3">Account settings</h2>
          {SECTIONS.map((section) => {
            const isActive = activeSection === section.id;
            const button = (
              <button
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => onSectionChange(section.id)}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ease-swift text-left",
                  isActive
                    ? "bg-brand/10 text-brand-700 dark:text-brand-400 shadow-sm"
                    : "text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900"
                )}
              >
                <Icon icon={section.icon} size={16} strokeWidth={isActive ? 2.5 : 1.75} />
                {section.label}
              </button>
            );
            return section.featureKey ? (
              <FeatureGate key={section.id} featureKey={section.featureKey as never}>
                {button}
              </FeatureGate>
            ) : (
              <div key={section.id}>{button}</div>
            );
          })}
        </div>
      </aside>

      <div className="lg:hidden overflow-x-auto hide-scrollbar border-b border-ink-100 dark:border-ink-800 pb-2">
        <div className="flex gap-2 min-w-max">
          {SECTIONS.map((section) => {
            const isActive = activeSection === section.id;
            const tab = (
              <button
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => onSectionChange(section.id)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-brand text-white"
                    : "bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 text-ink-600 dark:text-ink-300"
                )}
              >
                <Icon icon={section.icon} size={14} />
                {section.label}
              </button>
            );
            return section.featureKey ? (
              <FeatureGate key={section.id} featureKey={section.featureKey as never}>
                {tab}
              </FeatureGate>
            ) : (
              <span key={section.id}>{tab}</span>
            );
          })}
        </div>
      </div>

      {/* A div, not <main>: the root layout already provides the single main
          landmark that the skip link targets. */}
      <div className="min-w-0 lg:col-span-9 space-y-8">{children}</div>
    </div>
  );
}
