"use client";

import { useState } from "react";
import { Smartphone } from "lucide-react";
import { SettingsLayout, type SettingsSection } from "@/components/settings/SettingsLayout";
import { ProfileSettings, SecuritySettings } from "@/components/settings/ProfileAndSecurity";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { EmptyState } from "@/components/ui/EmptyState";
import { NotificationPreferencesV2 } from "@/components/notifications/NotificationPreferencesV2";
import { DigestSettings } from "@/components/notifications/DigestSettings";
import { DoNotDisturb } from "@/components/notifications/DoNotDisturb";
import { NotificationCategories } from "@/components/notifications/NotificationCategories";
import { DeviceNotificationInfo } from "@/components/pwa/DeviceNotificationInfo";

export function SettingsHub() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSettings />;
      case "security":
        return <SecuritySettings />;
      case "privacy":
        return <PrivacySettings />;
      case "appearance":
        return <AppearanceSettings />;
      case "notifications":
        return (
          <div className="space-y-6">
            <DeviceNotificationInfo />
            <NotificationCategories />
            <NotificationPreferencesV2 />
            <DigestSettings />
            <DoNotDisturb />
          </div>
        );
      case "devices":
        return (
          <EmptyState
            icon={Smartphone}
            title="Device management"
            description="Manage connected apps and third-party integrations. This arrives in a later update."
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-ink-900 dark:text-white">Settings</h1>
        <p className="text-ink-500 dark:text-ink-300 mt-1">
          Manage your account, security and preferences.
        </p>
      </header>

      {/* No AppShell here: the root layout already renders one, and nesting a
          second would double the header clearance, footer and mobile chrome. */}
      <SettingsLayout activeSection={activeSection} onSectionChange={setActiveSection}>
        {renderSection()}
      </SettingsLayout>
    </>
  );
}
