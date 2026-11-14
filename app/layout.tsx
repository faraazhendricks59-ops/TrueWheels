import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
export const metadata: Metadata = { title: "TrueWheels | The Automotive Operating System", description: "Discover, buy, and sell vehicles on South Africa's trusted automotive ecosystem." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className={inter.variable}><body className="flex min-h-screen flex-col bg-surface-grey font-sans"><Header /><main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 pb-24 md:pb-8">{children}</main><Footer /><MobileNav /></body></html>; }
