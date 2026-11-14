"use client";

import { useState } from "react";
import { Car, Gavel, Sparkles, Tag, Users, Wrench } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface IntentMatrixProps { onComplete: (intents: string[]) => void; }
const INTENTS = [{ id: "buy", label: "Buy Cars", icon: Car, desc: "Browse & purchase vehicles" }, { id: "sell", label: "Sell Cars", icon: Tag, desc: "List your private vehicle" }, { id: "auction", label: "Auction & Bid", icon: Gavel, desc: "Live bidding & collector cars" }, { id: "parts", label: "Buy/Sell Parts", icon: Wrench, desc: "OEM & aftermarket parts" }, { id: "community", label: "Community", icon: Users, desc: "Posts, groups & events" }, { id: "dealer", label: "Dealer Tools", icon: Sparkles, desc: "Inventory & CRM software" }];

export function IntentMatrix({ onComplete }: IntentMatrixProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggleIntent = (id: string) => setSelected((current) => current.includes(id) ? current.filter((intent) => intent !== id) : [...current, id]);
  const selectAll = () => setSelected((current) => current.length === INTENTS.length ? [] : INTENTS.map((intent) => intent.id));
  const isAllSelected = selected.length === INTENTS.length;
  return <div className="mx-auto max-w-4xl animate-in px-4 py-12 fade-in duration-500"><div className="mb-10 text-center"><h2 className="mb-3 text-3xl font-extrabold text-brand-graphite">How will you use TrueWheels?</h2><p className="text-gray-500">Select all that apply. We&apos;ll customize your experience.</p></div><div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{INTENTS.map((intent) => { const isSelected = selected.includes(intent.id); const Icon = intent.icon; return <button key={intent.id} type="button" aria-pressed={isSelected} onClick={() => toggleIntent(intent.id)} className={`relative rounded-2xl border-2 p-6 text-left transition-all duration-200 ${isSelected ? "border-brand-red bg-brand-red/5 shadow-md" : "border-brand-silver bg-surface-white hover:border-gray-300 hover:shadow-sm"}`}><div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${isSelected ? "bg-brand-red text-white" : "bg-surface-grey text-brand-graphite"}`}><Icon size={24} /></div><h3 className="mb-1 text-lg font-bold text-brand-graphite">{intent.label}</h3><p className="text-sm text-gray-500">{intent.desc}</p>{isSelected && <span aria-hidden="true" className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-brand-red text-xs font-bold text-white">✓</span>}</button>; })}</div><div className="flex flex-col items-center gap-6"><button type="button" onClick={selectAll} className={`text-sm font-semibold transition-colors ${isAllSelected ? "text-brand-red hover:text-brand-red-dark" : "text-gray-500 hover:text-brand-graphite"}`}>{isAllSelected ? "Clear Selection" : "✨ Unlock Full Access: All of the Above"}</button><Button type="button" onClick={() => onComplete(selected)} disabled={selected.length === 0} className="h-12 w-full max-w-xs text-base">Continue to Account Setup</Button></div></div>;
}
