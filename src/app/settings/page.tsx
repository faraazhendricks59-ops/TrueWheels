import type { Metadata } from "next";
import { SettingsHub } from "@/components/settings/SettingsHub";

export const metadata: Metadata = {
  title: "Settings | TrueWheels",
  description: "Manage your account, security, privacy and appearance preferences.",
};

export default function SettingsPage() {
  return <SettingsHub />;
}
