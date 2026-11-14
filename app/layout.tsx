import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "TrueWheels | The Automotive Operating System",
  description: "Discover, buy, and sell vehicles on South Africa's trusted automotive ecosystem.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <header className="flex h-16 items-center border-b border-brand-silver bg-surface-white px-6">
          <span className="text-xl font-bold text-brand-graphite">True<span className="text-brand-red">Wheels</span></span>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">{children}</main>
        <footer className="flex h-24 items-center justify-center border-t border-brand-silver bg-surface-white text-sm text-gray-500">© 2026 TrueWheels.</footer>
      </body>
    </html>
  );
}
