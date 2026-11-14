import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { OfflineProvider } from "@/components/providers/OfflineProvider";
import { OfflineBanner } from "@/components/ui/OfflineBanner";
import { InstallPrompt } from "@/components/ui/InstallPrompt";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
export const metadata: Metadata = { title: "TrueWheels | The Automotive Operating System", description: "Discover, buy, and sell vehicles on South Africa's trusted automotive ecosystem.", manifest: "/manifest.json", themeColor: "#D92332", appleWebApp: { capable: true, statusBarStyle: "default", title: "TrueWheels" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className={inter.variable}><head><link rel="apple-touch-icon" href="/icons/icon-192x192.png" /></head><body className="flex min-h-screen flex-col bg-surface-grey font-sans"><OfflineProvider><OfflineBanner /><Header /><main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 pb-24 md:pb-8">{children}</main><Footer /><MobileNav /><InstallPrompt /></OfflineProvider></body></html>; }
