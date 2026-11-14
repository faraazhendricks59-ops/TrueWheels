"use client";

import { ArrowRight } from "lucide-react";

interface CinematicIntroProps { onEnter: () => void; }

export function CinematicIntro({ onEnter }: CinematicIntroProps) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-brand-graphite text-white"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-red/20 via-brand-graphite to-black opacity-80" /><div className="relative z-10 max-w-3xl animate-in px-6 text-center fade-in slide-in-from-bottom-8 duration-700"><div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-gray-300 backdrop-blur-sm"><span className="h-2 w-2 animate-pulse rounded-full bg-semantic-success" />Established 2026 • South Africa</div><h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">The Automotive <br /><span className="bg-gradient-to-r from-brand-red to-amber-500 bg-clip-text text-transparent">Operating System</span></h1><p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl">TrueWheels isn&apos;t just a marketplace. It&apos;s a complete ecosystem to discover, buy, sell, bid, and manage your entire automotive lifecycle.</p><button type="button" onClick={onEnter} className="group inline-flex items-center gap-3 rounded-xl bg-brand-red px-8 py-4 text-lg font-bold text-white shadow-lg shadow-brand-red/20 transition-all duration-300 hover:scale-105 hover:bg-brand-red-dark hover:shadow-brand-red/40">Enter TrueWheels<ArrowRight size={20} className="transition-transform group-hover:translate-x-1" /></button></div></div>;
}
