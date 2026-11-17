import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardSection } from "@/components/dashboard/DashboardSection";

export const metadata: Metadata = { title: "My Listings | TrueWheels" };

export default function Page() {
  return (
    <DashboardShell>
      <DashboardSection variant="listings" />
    </DashboardShell>
  );
}
