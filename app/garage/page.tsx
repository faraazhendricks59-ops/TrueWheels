"use client";

import { useState } from "react";
import { CarFront, Heart, Plus, Wrench } from "lucide-react";

const initialGarage = [
  { name: "2018 Volkswagen Polo GTI", status: "current", detail: "Current car" },
  { name: "BMW E30 325i", status: "past", detail: "Past car" },
  { name: "Porsche 911 Carrera", status: "dream", detail: "Dream car" },
];

export default function GaragePage() {
  const [garage, setGarage] = useState(initialGarage);
  return <main className="min-h-screen bg-surface-grey"><div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-wider text-brand-red">Your ownership story</p><h1 className="mt-2 text-4xl font-extrabold tracking-tight">Digital Garage</h1><p className="mt-2 text-gray-600">Keep your current cars, past cars, and dream cars in one place.</p></div><button type="button" onClick={() => setGarage((items) => [...items, { name: "New vehicle", status: "dream", detail: "Dream car" }])} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-red px-4 py-2.5 font-semibold text-white hover:bg-brand-red-dark"><Plus size={17} /> Add vehicle</button></div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{garage.map((vehicle, index) => <article key={`${vehicle.name}-${index}`} className="rounded-xl border border-brand-silver bg-white p-5 shadow-card"><div className="flex h-32 items-center justify-center rounded-lg bg-surface-grey text-brand-graphite"><CarFront size={48} strokeWidth={1.5} /></div><p className="mt-4 text-xs font-semibold uppercase tracking-wider text-brand-red">{vehicle.detail}</p><h2 className="mt-1 font-bold">{vehicle.name}</h2>{vehicle.status === "current" && <button type="button" className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-brand-red"><Wrench size={15} />Service reminders</button>}{vehicle.status === "dream" && <button type="button" className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-brand-red"><Heart size={15} />Find similar vehicles</button>}</article>)}</div></div></main>;
}
