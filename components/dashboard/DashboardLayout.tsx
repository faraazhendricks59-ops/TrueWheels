"use client";

import Link from "next/link";
import { Car, Heart, LayoutDashboard, MessageSquare, Settings, Shield } from "lucide-react";

interface DashboardLayoutProps { children: React.ReactNode; activeTab: string; }
const NAV_ITEMS = [{ id: "overview", label: "Overview", icon: LayoutDashboard }, { id: "listings", label: "My Listings", icon: Car }, { id: "messages", label: "Messages", icon: MessageSquare }, { id: "favorites", label: "Saved Vehicles", icon: Heart }, { id: "security", label: "Security & Privacy", icon: Shield }, { id: "settings", label: "Profile Settings", icon: Settings }];

export function DashboardLayout({ children, activeTab }: DashboardLayoutProps) {
  return <div className="mx-auto max-w-7xl px-4 py-8"><h1 className="mb-6 text-2xl font-bold text-brand-graphite">My Dashboard</h1><div className="flex flex-col gap-8 md:flex-row"><aside className="hidden w-64 flex-shrink-0 md:block"><nav aria-label="Dashboard navigation" className="sticky top-24 rounded-xl border border-brand-silver bg-surface-white p-2 shadow-sm">{NAV_ITEMS.map((item) => { const Icon = item.icon; const isActive = activeTab === item.id; return <Link key={item.id} href={`/dashboard?tab=${item.id}`} aria-current={isActive ? "page" : undefined} className={`mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive ? "bg-brand-red/10 text-brand-red" : "text-gray-600 hover:bg-surface-grey hover:text-brand-graphite"}`}><Icon size={18} />{item.label}</Link>; })}</nav></aside><div className="-mx-4 overflow-x-auto px-4 pb-2 md:hidden"><nav aria-label="Mobile dashboard navigation" className="flex min-w-max gap-2">{NAV_ITEMS.map((item) => { const isActive = activeTab === item.id; return <Link key={item.id} href={`/dashboard?tab=${item.id}`} aria-current={isActive ? "page" : undefined} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${isActive ? "bg-brand-red text-white" : "border border-brand-silver bg-surface-white text-gray-600"}`}>{item.label}</Link>; })}</nav></div><main className="min-w-0 flex-1">{children}</main></div></div>;
}
