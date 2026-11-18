import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
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
import { ConciergeProvider } from "@/components/providers/ConciergeProvider";
import { PersonalizationProvider } from "@/components/providers/PersonalizationProvider";
import { GarageProvider } from "@/components/providers/GarageProvider";
import { GroupsProvider } from "@/components/providers/GroupsProvider";
import { EventsProvider } from "@/components/providers/EventsProvider";
import { MessagesProvider } from "@/components/providers/MessagesProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { TourProvider } from "@/components/providers/TourProvider";
import { NotificationProvider } from "@/components/providers/NotificationProvider";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo/JsonLd";
import { I18nProvider } from "@/components/providers/I18nProvider";
import {
  AccessibilityProvider,
  A11yScript,
} from "@/components/providers/AccessibilityProvider";
import { AriaLiveAnnouncerProvider } from "@/components/a11y/AriaLiveAnnouncer";
import { SkipLink } from "@/components/a11y/SkipLink";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
// The display face was Space Grotesk, whose quirky single-storey letterforms are a
// common "AI startup" default and read as playful next to listing data. Inter Tight
// is the condensed sibling of the body face: same skeleton, tighter tracking, so
// headings sit in the same family as the text they introduce, which is how a real
// catalogue (AutoTrader, Mobile.de) is set. Body and mono are unchanged.
const display = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

// viewport-fit=cover is required for env(safe-area-inset-*) to return anything
// other than 0; without it the safe-area utilities are inert on iOS.
//
// Pinch zoom is disabled as requested: maximumScale 1 with userScalable false
// stops the page being scaled on a touch device. Two things worth knowing.
// Desktop browser zoom (Ctrl +/-) is unaffected, because that scales the
// viewport rather than the page, so text can still be enlarged on a computer.
// On mobile there is now no way to magnify anything, which WCAG 1.4.4 asks for,
// so a low-vision user on a phone cannot enlarge the text; the type scale and
// the touch targets are sized to be legible without magnification to offset
// that. iOS Safari also ignores userScalable in some versions, so this is not
// a guarantee on every handset.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "TrueWheels | South Africa’s vehicle marketplace",
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
        className={`${inter.variable} ${display.variable} ${mono.variable} min-h-screen bg-surface-paper text-ink-900 dark:bg-ink-950 dark:text-white`}
      >
        <FeatureProvider>
          <ThemeProvider>
            <I18nProvider>
              <AccessibilityProvider>
                <AriaLiveAnnouncerProvider>
                  <MotionProvider>
                    <AuthProvider>
                    <ToastProvider>
                      <NotificationProvider>
                      <TourProvider>
                      {/* Owns the palette state and renders it; must wrap the
                          omnibox, which calls useCommandPalette. */}
                      <CommandPaletteProvider>
                        <ConciergeProvider>
                          <PersonalizationProvider>
                          <GarageProvider>
                          <GroupsProvider>
                          <EventsProvider>
                          <MessagesProvider>
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
                          </MessagesProvider>
                          </EventsProvider>
                          </GroupsProvider>
                          </GarageProvider>
                          </PersonalizationProvider>
                        </ConciergeProvider>
                      </CommandPaletteProvider>
                      </TourProvider>
                      </NotificationProvider>
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
