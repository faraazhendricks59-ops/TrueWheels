"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export type FontScale = "normal" | "large" | "x-large";

export const FONT_SCALE_VALUES: Record<FontScale, string> = {
  normal: "1",
  large: "1.15",
  "x-large": "1.3",
};

interface AccessibilityContextValue {
  fontScale: FontScale;
  highContrast: boolean;
  setFontScale: (scale: FontScale) => void;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used inside an AccessibilityProvider");
  }
  return context;
}

export const A11Y_STORAGE_KEY = "truewheels-a11y";

export interface StoredA11ySettings {
  fontScale: FontScale;
  highContrast: boolean;
}

/** Shared by the provider and the boot script so both parse the value identically. */
export function parseStoredSettings(raw: string | null): StoredA11ySettings {
  const fallback: StoredA11ySettings = { fontScale: "normal", highContrast: false };
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredA11ySettings>;
    const fontScale =
      parsed.fontScale === "large" || parsed.fontScale === "x-large" ? parsed.fontScale : "normal";
    return { fontScale, highContrast: parsed.highContrast === true };
  } catch {
    return fallback;
  }
}

function applySettings({ fontScale, highContrast }: StoredA11ySettings) {
  const root = document.documentElement;
  root.style.setProperty("--font-scale", FONT_SCALE_VALUES[fontScale]);
  root.classList.toggle("high-contrast", highContrast);
}

/**
 * Applies stored accessibility settings before first paint. Without this the
 * page renders at the default scale and then jumps once the provider mounts.
 */
export function A11yScript() {
  const script = `
(function () {
  try {
    var raw = localStorage.getItem('${A11Y_STORAGE_KEY}');
    if (!raw) return;
    var parsed = JSON.parse(raw);
    var scale = parsed.fontScale === 'large' ? '1.15' : parsed.fontScale === 'x-large' ? '1.3' : '1';
    var root = document.documentElement;
    root.style.setProperty('--font-scale', scale);
    if (parsed.highContrast === true) root.classList.add('high-contrast');
  } catch (e) {}
})();
`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  // Children render unconditionally: gating them behind `mounted` emits an empty
  // document on the server and throws for any consumer reading the context.
  const [settings, setSettings] = useState<StoredA11ySettings>({
    fontScale: "normal",
    highContrast: false,
  });

  // Reconcile with whatever the boot script already applied.
  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(A11Y_STORAGE_KEY);
    } catch {
      /* Storage may be unavailable. */
    }
    const stored = parseStoredSettings(raw);
    setSettings(stored);
    applySettings(stored);
  }, []);

  const persist = useCallback((next: StoredA11ySettings) => {
    setSettings(next);
    applySettings(next);
    try {
      localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* Settings still apply for this session. */
    }
  }, []);

  const setFontScale = useCallback(
    (fontScale: FontScale) => persist({ ...settings, fontScale }),
    [persist, settings]
  );

  const toggleHighContrast = useCallback(
    () => persist({ ...settings, highContrast: !settings.highContrast }),
    [persist, settings]
  );

  const value = useMemo(
    () => ({
      fontScale: settings.fontScale,
      highContrast: settings.highContrast,
      setFontScale,
      toggleHighContrast,
    }),
    [settings, setFontScale, toggleHighContrast]
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}
