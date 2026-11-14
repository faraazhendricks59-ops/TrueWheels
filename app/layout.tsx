import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export const metadata: Metadata = { title: "TrueWheels | The Automotive Operating System", description: "Discover, buy, sell, and bid on South Africa's most trusted vehicle ecosystem." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={inter.variable}><body className="flex min-h-screen flex-col bg-surface-grey font-sans text-brand-graphite antialiased"><Header /><main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">{children}</main><MobileNav /><footer className="mt-auto border-t border-brand-silver bg-surface-white py-8 pb-24 md:pb-8"><div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500">© 2026 TrueWheels. All rights reserved. POPIA Compliant.</div></footer></body></html>;
}
