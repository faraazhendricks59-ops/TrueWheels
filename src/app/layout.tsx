import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { FeatureProvider } from "@/lib/feature-flags";
import { OnboardingController } from "@/components/onboarding/OnboardingController";
import { MotionProvider } from "@/components/motion/MotionProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "TrueWheels | The Automotive Operating System",
  description: "Search, buy, sell, bid and connect — South Africa's automotive ecosystem.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${grotesk.variable} ${mono.variable} min-h-screen bg-surface-paper text-ink-900 dark:bg-ink-950 dark:text-white`}
      >
        <FeatureProvider>
          <MotionProvider>
            <OnboardingController>{children}</OnboardingController>
          </MotionProvider>
        </FeatureProvider>
      </body>
    </html>
  );
}
