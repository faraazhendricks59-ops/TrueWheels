"use client";

import { useState } from "react";
import { Car, Home, MessageSquare, Star } from "lucide-react";
import { DigitalGarage } from "@/components/garage/DigitalGarage";

interface ProfileTabsProps { username: string; }
type TabId = "listings" | "garage" | "posts" | "reviews";

export function ProfileTabs({ username }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("listings");
  const tabs = [{ id: "listings" as const, label: "Active Listings", icon: <Car size={14} /> }, { id: "garage" as const, label: "Digital Garage", icon: <Home size={14} /> }, { id: "posts" as const, label: "Community Posts", icon: <MessageSquare size={14} /> }, { id: "reviews" as const, label: "Reviews", icon: <Star size={14} /> }];
  return <div className="w-full"><div className="mb-8 flex gap-6 overflow-x-auto border-b border-brand-silver" role="tablist">{tabs.map((tab) => <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} aria-selected={activeTab === tab.id} role="tab" className={`flex items-center gap-2 whitespace-nowrap border-b-2 pb-3 text-sm font-medium transition-colors ${activeTab === tab.id ? "border-brand-red text-brand-red" : "border-transparent text-gray-500 hover:text-brand-graphite"}`}>{tab.icon}{tab.label}</button>)}</div><div className="min-h-[300px]">{activeTab === "listings" && <EmptyState icon={<Car className="mx-auto mb-3 h-10 w-10 text-gray-300" />} title="No active listings" description={`${username} hasn't listed any vehicles for sale yet.`} action="Browse Marketplace" />}{activeTab === "garage" && <div className="py-4"><p className="mb-6 text-sm text-gray-500">Explore {username}'s personal collection of current, past, and dream vehicles.</p><DigitalGarage /></div>}{activeTab === "posts" && <EmptyState icon={<MessageSquare className="mx-auto mb-3 h-10 w-10 text-gray-300" />} title="No community posts" description={`${username} hasn't shared any build journals or updates yet.`} />}{activeTab === "reviews" && <EmptyState icon={<Star className="mx-auto mb-3 h-10 w-10 text-gray-300" />} title="No reviews yet" description="This user has not received any reviews from buyers or sellers." />}</div></div>;
}
function EmptyState({ icon, title, description, action }: { icon: React.ReactNode; title: string; description: string; action?: string }) { return <div className="rounded-xl border border-dashed border-brand-silver bg-surface-white py-12 text-center">{icon}<h3 className="mb-1 text-lg font-bold text-brand-graphite">{title}</h3><p className="mb-4 text-sm text-gray-500">{description}</p>{action && <button type="button" className="text-sm font-semibold text-brand-red hover:underline">{action}</button>}</div>; }
