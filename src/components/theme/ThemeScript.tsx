export const THEME_STORAGE_KEY = "truewheels-theme";

/**
 * Injects a synchronous script into <head>. It runs before the browser paints,
 * so a dark-mode user never sees a white flash (FOUC) while React hydrates.
 *
 * The body is inlined as a string rather than imported, because anything
 * referenced here would be a separate request and therefore too late.
 */
export function ThemeScript() {
  const script = `
(function () {
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var theme = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = theme === 'dark' || (theme === 'system' && prefersDark);
    var root = document.documentElement;
    root.classList.toggle('dark', isDark);
    root.style.colorScheme = isDark ? 'dark' : 'light';
  } catch (e) {
    /* Private mode or blocked storage: fall back to the light default. */
  }
})();
`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
