/**
 * Copy text to the clipboard, reporting whether it actually worked.
 *
 * navigator.clipboard is undefined outside a secure context (plain HTTP, some
 * in-app browsers) and its promise rejects when the document is not focused or
 * permission is denied. Callers must not assume success, otherwise the UI shows
 * a "Copied" confirmation for a copy that never happened.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the legacy path below.
    }
  }
  return legacyCopy(text);
}

/** execCommand fallback for insecure contexts; deprecated but widely supported. */
function legacyCopy(text: string): boolean {
  if (typeof document === "undefined") return false;

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  document.body.appendChild(textarea);

  try {
    textarea.select();
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}
