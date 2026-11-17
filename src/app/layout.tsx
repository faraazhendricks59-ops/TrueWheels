import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { FeatureProvider } from "@/lib/feature-flags";
import { OnboardingController } from "@/components/onboarding/OnboardingController";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { Navbar } from "@/components/layout/Navbar";
import { I18nProvider } from "@/components/providers/I18nProvider";

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
      <head>
        {/* Runs before first paint so a dark-mode user never sees a white flash. */}
        <ThemeScript />
      </head>
      <body
        className={`${inter.variable} ${grotesk.variable} ${mono.variable} min-h-screen bg-surface-paper text-ink-900 dark:bg-ink-950 dark:text-white`}
      >
        <FeatureProvider>
          <ThemeProvider>
            <I18nProvider>
              <MotionProvider>
                <ToastProvider>
                  <Navbar />
                  <OnboardingController>{children}</OnboardingController>
                </ToastProvider>
              </MotionProvider>
            </I18nProvider>
          </ThemeProvider>
        </FeatureProvider>
      </body>
    </html>
  );
}
