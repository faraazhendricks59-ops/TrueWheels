import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { FeatureProvider } from "@/lib/feature-flags";
import { OnboardingController } from "@/components/onboarding/OnboardingController";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { TopNav } from "@/components/shell/TopNav";
import { AppShell } from "@/components/shell/AppShell";
import { CommandPaletteProvider } from "@/components/providers/CommandPaletteProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { TourProvider } from "@/components/providers/TourProvider";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo/JsonLd";
import { I18nProvider } from "@/components/providers/I18nProvider";
import {
  AccessibilityProvider,
  A11yScript,
} from "@/components/providers/AccessibilityProvider";
import { AriaLiveAnnouncerProvider } from "@/components/a11y/AriaLiveAnnouncer";
import { SkipLink } from "@/components/a11y/SkipLink";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

// viewport-fit=cover is required for env(safe-area-inset-*) to return anything
// other than 0; without it the safe-area utilities are inert on iOS.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

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
        {/* Applies stored text-size and contrast before first paint. */}
        <A11yScript />
        {/* Structured data for crawlers that do not execute JavaScript. */}
        <OrganizationSchema />
        <WebSiteSchema />
      </head>
      <body
        className={`${inter.variable} ${grotesk.variable} ${mono.variable} min-h-screen bg-surface-paper text-ink-900 dark:bg-ink-950 dark:text-white`}
      >
        <FeatureProvider>
          <ThemeProvider>
            <I18nProvider>
              <AccessibilityProvider>
                <AriaLiveAnnouncerProvider>
                  <MotionProvider>
                    <AuthProvider>
                    <ToastProvider>
                      <TourProvider>
                      {/* Owns the palette state and renders it; must wrap the
                          omnibox, which calls useCommandPalette. */}
                      <CommandPaletteProvider>
                        <SkipLink />
                        <TopNav />
                        {/* AppShell is the single source of header clearance and
                            safe-area insets; pages must not nest another one. */}
                        <AppShell>
                          {/* The single main landmark; the skip link targets it. */}
                          <main id="main-content" tabIndex={-1} className="outline-none flex-1 w-full">
                            <OnboardingController>{children}</OnboardingController>
                          </main>
                        </AppShell>
                      </CommandPaletteProvider>
                      </TourProvider>
                    </ToastProvider>
                    </AuthProvider>
                  </MotionProvider>
                </AriaLiveAnnouncerProvider>
              </AccessibilityProvider>
            </I18nProvider>
          </ThemeProvider>
        </FeatureProvider>
      </body>
    </html>
  );
}
