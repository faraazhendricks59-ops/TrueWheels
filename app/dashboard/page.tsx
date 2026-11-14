import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { MyListingsManager } from "@/components/dashboard/MyListingsManager";

const TABS = ["overview", "listings", "messages", "favorites", "security", "settings"];

export default function DashboardPage({ searchParams }: { searchParams: { tab?: string } }) {
  const requestedTab = searchParams.tab ?? "overview";
  const activeTab = TABS.includes(requestedTab) ? requestedTab : "overview";
  return <DashboardLayout activeTab={activeTab}>{activeTab === "overview" && <DashboardOverview />}{activeTab === "listings" && <MyListingsManager />}{["messages", "favorites", "security", "settings"].includes(activeTab) && <div className="rounded-xl border border-brand-silver bg-surface-white p-12 text-center shadow-sm"><h2 className="mb-2 text-lg font-bold capitalize text-brand-graphite">{activeTab.replace("-", " ")}</h2><p className="text-sm text-gray-500">This section is under construction and will be available in a future phase.</p></div>}</DashboardLayout>;
}
