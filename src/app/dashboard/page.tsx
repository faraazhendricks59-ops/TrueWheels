import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";

export const metadata: Metadata = {
  title: "Dashboard | TrueWheels",
  description: "Your command centre: listings, bids, messages and saved vehicles.",
};

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardOverview
        greeting="Welcome back, Marcus"
        subtitle="Here is what is happening with your vehicles today."
        kpis={[
          { label: "Total views", value: 8450, icon: "views", trend: "up", trendValue: "+12.5%" },
          { label: "Active listings", value: 3, icon: "listings", trend: "neutral" },
          { label: "Active bids", value: 12, icon: "bids", trend: "up", trendValue: "+2" },
          { label: "Unread messages", value: 5, icon: "messages", trend: "down", trendValue: "-3" },
        ]}
      />
    </DashboardShell>
  );
}
