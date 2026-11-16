"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const STORAGE_KEY = "truewheels-theme";

const getSystemTheme = (): "light" | "dark" =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const resolve = (theme: Theme): "light" | "dark" =>
  theme === "system" ? getSystemTheme() : theme;

const applyTheme = (resolved: "light" | "dark") => {
  document.documentElement.classList.toggle("dark", resolved === "dark");
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Hydrate the persisted choice once on mount. The inline script in the layout
  // has already set the correct class before paint, so this only syncs state.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved) setThemeState(saved);
    setMounted(true);
  }, []);

  // Single source of truth for applying the theme — runs after hydration and
  // whenever the chosen theme changes.
  useEffect(() => {
    if (!mounted) return;
    const resolved = resolve(theme);
    applyTheme(resolved);
    setResolvedTheme(resolved);
  }, [theme, mounted]);

  // Follow OS changes while in 'system' mode.
  useEffect(() => {
    if (!mounted || theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const resolved = media.matches ? "dark" : "light";
      applyTheme(resolved);
      setResolvedTheme(resolved);
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
