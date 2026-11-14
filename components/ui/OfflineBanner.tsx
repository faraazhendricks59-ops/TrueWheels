"use client";

import { WifiOff } from "lucide-react";
import { useOffline } from "@/components/providers/OfflineProvider";

export function OfflineBanner() { const { isOnline, lastOnline } = useOffline(); if (isOnline) return null; return <div className="fixed left-0 right-0 top-0 z-50 bg-amber-500 px-4 py-2 text-center text-sm font-medium text-white shadow-lg"><div className="mx-auto flex max-w-7xl items-center justify-center gap-2"><WifiOff size={16} /><span>You're offline. Some features may be limited.</span>{lastOnline && <span className="ml-2 hidden text-xs opacity-80 sm:inline">Last online: {lastOnline.toLocaleTimeString()}</span>}</div></div>; }
