"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { BulkActionsBar } from "@/components/dealer/BulkActionsBar";
import { DealerAnalytics } from "@/components/dealer/DealerAnalytics";
import { DealerDashboardLayout } from "@/components/dealer/DealerDashboardLayout";
import { InventoryTable } from "@/components/dealer/InventoryTable";
import { LeadPipeline } from "@/components/dealer/LeadPipeline";
import { QuickAddModal } from "@/components/dealer/QuickAddModal";
import { Button } from "@/components/ui/Button";

const DEALER_TABS = ["overview", "leads", "inventory", "analytics", "staff", "settings"];
const INVENTORY_IDS = ["v1", "v2", "v3", "v4", "v5"];

export default function DealerDashboardPage({ searchParams }: { searchParams: { tab?: string } }) { const requestedTab = searchParams.tab ?? "leads"; const activeTab = DEALER_TABS.includes(requestedTab) ? requestedTab : "leads"; const [selectedIds, setSelectedIds] = useState<string[]>([]); const [isQuickAddOpen, setIsQuickAddOpen] = useState(false); const toggleSelection = (id: string) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); const toggleAll = () => setSelectedIds((current) => current.length === INVENTORY_IDS.length ? [] : INVENTORY_IDS); return <div className="min-h-screen bg-surface-grey"><DealerDashboardLayout activeTab={activeTab}>{activeTab === "leads" && <LeadPipeline />}{activeTab === "analytics" && <DealerAnalytics />}{activeTab === "inventory" && <section className="space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-bold text-brand-graphite">Inventory Management</h2><p className="mt-1 text-sm text-gray-500">Manage showroom stock and listing performance.</p></div><Button type="button" onClick={() => setIsQuickAddOpen(true)}><Plus size={16} className="mr-2" />Quick Add Vehicle</Button></div><InventoryTable selectedIds={selectedIds} toggleSelection={toggleSelection} toggleAll={toggleAll} /></section>}{["overview", "staff", "settings"].includes(activeTab) && <section className="rounded-xl border border-brand-silver bg-surface-white p-12 text-center shadow-sm"><h2 className="mb-2 text-lg font-bold capitalize text-brand-graphite">{activeTab.replace("-", " ")}</h2><p className="text-sm text-gray-500">Module under construction.</p></section>}</DealerDashboardLayout><BulkActionsBar count={selectedIds.length} onClear={() => setSelectedIds([])} /><QuickAddModal isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} /></div>; }
