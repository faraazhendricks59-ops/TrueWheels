import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { CookieConsentBanner } from "@/components/ui/CookieConsentBanner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CommandPaletteProvider } from "@/components/providers/CommandPaletteProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo/site";
import { OrganisationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} | The Automotive Operating System`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_ZA",
    url: "/",
    title: `${SITE_NAME} | The Automotive Operating System`,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

// Runs before paint to avoid a flash of the wrong theme.
const themeInitScript = `
  (function() {
    try {
      var saved = localStorage.getItem('truewheels-theme');
      var theme = saved || 'system';
      var isDark = theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) document.documentElement.classList.add('dark');
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-surface-grey text-brand-graphite antialiased font-sans">
        <OrganisationJsonLd />
        <WebSiteJsonLd />
        <LanguageProvider>
          <ThemeProvider>
            <CommandPaletteProvider>
              <Header />
              {children}
              <Footer />
              <MobileNav />
              <CookieConsentBanner />
            </CommandPaletteProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
