import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardSection } from "@/components/dashboard/DashboardSection";

export const metadata: Metadata = { title: "Settings | TrueWheels" };

export default function Page() {
  return (
    <DashboardShell>
      <DashboardSection variant="settings" />
    </DashboardShell>
  );
}
