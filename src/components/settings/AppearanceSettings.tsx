"use client";

import { Contrast, Gauge, Globe, Monitor, Moon, Sun, Type } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Switch } from "@/components/ui/Toggles";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useTranslation } from "@/components/providers/I18nProvider";
import { useAccessibility } from "@/components/providers/AccessibilityProvider";
import { SUPPORTED_LOCALES } from "@/lib/i18n/dictionaries";
import { Reveal } from "@/components/motion/Reveal";

const THEMES = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
] as const;

const FONT_SCALES = [
  { id: "normal", label: "A", description: "Normal text size" },
  { id: "large", label: "A+", description: "Large text size" },
  { id: "x-large", label: "A++", description: "Largest text size" },
] as const;

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale } = useTranslation();
  const { fontScale, highContrast, lowData, setFontScale, toggleHighContrast, toggleLowData } =
    useAccessibility();

  return (
    <Reveal variant="up" delay={300}>
      <section className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6 shadow-lift">
        <h2 className="text-lg font-display font-bold text-ink-900 dark:text-white mb-6">
          Appearance &amp; accessibility
        </h2>

        <div className="space-y-8">
          <fieldset>
            <legend className="text-sm font-semibold text-ink-900 dark:text-white mb-3">Theme</legend>
            <div className="grid grid-cols-3 gap-3">
              {THEMES.map((option) => {
                const isActive = theme === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setTheme(option.id)}
                    className={clsx(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                      isActive
                        ? "border-brand bg-brand/5 text-brand"
                        : "border-ink-100 dark:border-ink-800 text-ink-500 hover:border-ink-300 dark:hover:border-ink-600"
                    )}
                  >
                    <Icon icon={option.icon} size={20} />
                    <span className="text-xs font-semibold">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="h-px bg-ink-100 dark:bg-ink-800" />

          <fieldset>
            <legend className="text-sm font-semibold text-ink-900 dark:text-white mb-3 flex items-center gap-2">
              <Icon icon={Globe} size={16} /> Language
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SUPPORTED_LOCALES.map((option) => {
                const isActive = locale === option.code;
                return (
                  <button
                    key={option.code}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setLocale(option.code)}
                    className={clsx(
                      "flex items-center justify-between p-3 rounded-xl border transition-all",
                      isActive
                        ? "border-brand bg-brand/5 text-brand"
                        : "border-ink-100 dark:border-ink-800 text-ink-600 dark:text-ink-300"
                    )}
                  >
                    <span className="text-sm font-semibold">{option.label}</span>
                    <span className="text-xs text-ink-400 uppercase">{option.code}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="h-px bg-ink-100 dark:bg-ink-800" />

          <div>
            <h3 className="text-sm font-semibold text-ink-900 dark:text-white mb-4 flex items-center gap-2">
              <Icon icon={Type} size={16} /> Accessibility
            </h3>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-ink-50 dark:bg-ink-950 rounded-xl border border-ink-100 dark:border-ink-800">
                <div>
                  <p className="text-sm font-semibold text-ink-900 dark:text-white">Font scale</p>
                  <p className="text-xs text-ink-500">Increase text size across the platform.</p>
                </div>
                <div className="flex gap-2">
                  {FONT_SCALES.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={fontScale === option.id}
                      aria-label={option.description}
                      onClick={() => setFontScale(option.id)}
                      className={clsx(
                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                        fontScale === option.id
                          ? "bg-brand text-white"
                          : "bg-white dark:bg-ink-900 text-ink-500 border border-ink-200 dark:border-ink-700"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 p-4 bg-ink-50 dark:bg-ink-950 rounded-xl border border-ink-100 dark:border-ink-800">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-500">
                    <Icon icon={Contrast} size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900 dark:text-white">High contrast</p>
                    <p className="text-xs text-ink-500">Maximise contrast for better visibility.</p>
                  </div>
                </div>
                <Switch
                  label={<span className="sr-only">High contrast</span>}
                  checked={highContrast}
                  onChange={toggleHighContrast}
                />
              </div>

              <div className="flex items-center justify-between gap-3 p-4 bg-ink-50 dark:bg-ink-950 rounded-xl border border-ink-100 dark:border-ink-800">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-500">
                    <Icon icon={Gauge} size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900 dark:text-white">Data saver</p>
                    <p className="text-xs text-ink-500">
                      Turn off animation, blur and video. Useful on a slow or metered connection.
                    </p>
                  </div>
                </div>
                <Switch
                  label={<span className="sr-only">Data saver</span>}
                  checked={lowData}
                  onChange={toggleLowData}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
