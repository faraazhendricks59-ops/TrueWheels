"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { clsx } from "clsx";
import { Magnetic } from "@/components/motion/Magnetic";
import { SmartButton } from "@/components/ui/SmartButton";
import { Icon } from "@/components/ui/Icon";
import { useTheme, type Theme } from "./ThemeProvider";

const NEXT_THEME: Record<Theme, Theme> = {
  light: "dark",
  dark: "system",
  system: "light",
};

const LABEL: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <Magnetic strength={0.2}>
      <SmartButton
        featureKey="ui.theme_toggle"
        variant="ghost"
        size="icon"
        onClick={() => setTheme(NEXT_THEME[theme])}
        className={clsx("relative overflow-hidden", className)}
        aria-label={`Theme: ${LABEL[theme]}. Activate to switch to ${LABEL[NEXT_THEME[theme]]}.`}
      >
        {/* A single glyph driven by the current theme, rather than three
            absolutely stacked icons: an icon-only button must expose exactly
            one accessible name, and three overlapping SVGs give three. */}
        <span className="relative w-4 h-4 block" aria-hidden="true">
          <Icon
            icon={theme === "light" ? Sun : theme === "dark" ? Moon : Monitor}
            size={16}
            className={clsx(
              "absolute inset-0 transition-all duration-500 ease-swift",
              resolvedTheme === "dark" ? "text-ink-200" : "text-ink-600"
            )}
          />
        </span>
      </SmartButton>
    </Magnetic>
  );
}
