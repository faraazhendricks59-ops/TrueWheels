"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { ModerationQueue } from "@/components/admin/ModerationQueue";
import { UserManagementTable } from "@/components/admin/UserManagementTable";

const ADMIN_TABS = ["overview", "moderation", "users", "dealers", "ads", "reports", "settings"];
export default function AdminPage({ searchParams }: { searchParams: { tab?: string } }) { const requestedTab = searchParams.tab ?? "moderation"; const activeTab = ADMIN_TABS.includes(requestedTab) ? requestedTab : "moderation"; return <AdminLayout activeTab={activeTab}>{activeTab === "moderation" && <ModerationQueue />}{activeTab === "users" && <UserManagementTable />}{["overview", "dealers", "ads", "reports", "settings"].includes(activeTab) && <section className="rounded-xl border border-brand-silver bg-surface-white p-12 text-center shadow-sm"><h2 className="mb-2 text-lg font-bold capitalize text-brand-graphite">{activeTab.replace("-", " ")}</h2><p className="mx-auto max-w-md text-sm text-gray-500">This governance module is under construction. Ad engine controls, dealer verification, safety reports, and system settings will be available in an upcoming phase.</p></section>}</AdminLayout>; }
