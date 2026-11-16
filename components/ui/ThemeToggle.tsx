"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle() {
  const { resolvedTheme, theme, setTheme } = useTheme();

  const handleToggle = () => {
    // If following system, explicitly switch to the opposite of what's showing.
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      className="rounded-lg p-2 text-neutral-muted transition-colors hover:bg-neutral-hover hover:text-brand-graphite"
      title={theme === "system" ? "Following system theme" : undefined}
    >
      {resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
