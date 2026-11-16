import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CommandPaletteProvider } from "@/components/providers/CommandPaletteProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "TrueWheels | The Automotive Operating System",
  description: "Discover, buy, sell, and manage your vehicles on South Africa's most trusted automotive ecosystem.",
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
        <LanguageProvider>
          <ThemeProvider>
            <CommandPaletteProvider>
              <Header />
              {children}
              <MobileNav />
            </CommandPaletteProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
