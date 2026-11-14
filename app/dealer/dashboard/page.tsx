import { DealerAnalytics } from "@/components/dealer/DealerAnalytics";
import { DealerDashboardLayout } from "@/components/dealer/DealerDashboardLayout";
import { LeadPipeline } from "@/components/dealer/LeadPipeline";

const DEALER_TABS = ["overview", "leads", "inventory", "analytics", "staff", "settings"];

export default function DealerDashboardPage({ searchParams }: { searchParams: { tab?: string } }) {
  const requestedTab = searchParams.tab ?? "leads";
  const activeTab = DEALER_TABS.includes(requestedTab) ? requestedTab : "leads";
  return <div className="min-h-screen bg-surface-grey"><DealerDashboardLayout activeTab={activeTab}>{activeTab === "leads" && <LeadPipeline />}{activeTab === "analytics" && <DealerAnalytics />}{["overview", "inventory", "staff", "settings"].includes(activeTab) && <section className="rounded-xl border border-brand-silver bg-surface-white p-12 text-center shadow-sm"><h2 className="mb-2 text-lg font-bold capitalize text-brand-graphite">{activeTab.replace("-", " ")}</h2><p className="mx-auto max-w-md text-sm text-gray-500">This dealer module is under construction. Inventory sync, staff permissions, and business settings will be available in an upcoming phase.</p></section>}</DealerDashboardLayout></div>;
}
