"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { syncQueue } from "@/lib/sync-queue";

interface OfflineContextValue { isOnline: boolean; lastOnline: Date | null; }
const OfflineContext = createContext<OfflineContextValue>({ isOnline: true, lastOnline: null });
export const useOffline = () => useContext(OfflineContext);
export function OfflineProvider({ children }: { children: ReactNode }) { const [isOnline, setIsOnline] = useState(true); const [lastOnline, setLastOnline] = useState<Date | null>(null); useEffect(() => { setIsOnline(window.navigator.onLine); const saved = window.localStorage.getItem("truewheels_last_online"); if (saved) setLastOnline(new Date(saved)); const handleOnline = () => { const now = new Date(); setIsOnline(true); setLastOnline(now); window.localStorage.setItem("truewheels_last_online", now.toISOString()); void syncQueue.sync(); }; const handleOffline = () => setIsOnline(false); window.addEventListener("online", handleOnline); window.addEventListener("offline", handleOffline); if (window.navigator.onLine) void syncQueue.sync(); return () => { window.removeEventListener("online", handleOnline); window.removeEventListener("offline", handleOffline); }; }, []); const value = useMemo(() => ({ isOnline, lastOnline }), [isOnline, lastOnline]); return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>; }
