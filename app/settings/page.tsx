import type { Metadata } from "next";
import { ProfileSettingsForm } from "@/components/settings/ProfileSettingsForm";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { SettingsLayout } from "@/components/settings/SettingsLayout";

export const metadata: Metadata = { title: "Settings | TrueWheels", description: "Manage your TrueWheels profile, security, sessions, and POPIA data controls." };
export default function SettingsPage({ searchParams }: { searchParams: { section?: string } }) { const section = searchParams.section ?? "profile"; const validSection = ["profile", "security", "privacy", "notifications", "devices", "appearance"].includes(section) ? section : "profile"; return <div className="min-h-screen bg-surface-grey"><SettingsLayout activeSection={validSection}>{validSection === "profile" && <ProfileSettingsForm />}{(validSection === "security" || validSection === "privacy") && <SecuritySettings />}{["notifications", "devices", "appearance"].includes(validSection) && <section className="rounded-xl border border-brand-silver bg-surface-white p-12 text-center shadow-sm"><h2 className="mb-2 text-lg font-bold capitalize text-brand-graphite">{validSection}</h2><p className="text-sm text-gray-500">This settings section is coming in a future phase.</p></section>}</SettingsLayout></div>; }
