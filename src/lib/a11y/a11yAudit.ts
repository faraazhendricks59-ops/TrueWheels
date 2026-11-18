/**
 * Client-side WCAG 2.1 AA audit.
 *
 * This is a dev-time smoke detector, not a conformance certificate. It catches the
 * mechanical failures that are easy to reintroduce (a missing alt, an unlabelled
 * input, a contrast regression in a token) so they are seen while the page is being
 * built rather than by a reader. It cannot judge whether alt text is *meaningful*,
 * whether focus order is *logical*, or whether a live region is *timely* — those
 * need a human and a real screen reader, and this file says so rather than implying
 * a green badge means "accessible".
 */

export type ViolationSeverity = "critical" | "serious" | "moderate" | "minor";

export interface A11yViolation {
  id: string;
  /** WCAG 2.1 success criterion, e.g. "1.4.3". */
  rule: string;
  severity: ViolationSeverity;
  message: string;
  /** A CSS selector or short description locating the element. */
  element: string;
  helpUrl?: string;
}

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** Relative luminance, per the WCAG 2.1 definition. */
function luminance({ r, g, b }: Rgba): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * Composite a possibly-translucent colour over another.
 *
 * This is the Porter-Duff "over" operator, and the background's own alpha matters:
 * an earlier version forced the result to `a: 1`, which is only correct when the
 * layer underneath is already opaque. Because the walk composites two *translucent*
 * layers together (a 5% badge tint over a 5% cell tint), that version collapsed
 * them to the fully saturated colour and reported dark-green-on-green as 3.88:1
 * when the real pairing is near-black on a 90%-white wash. The result keeps its
 * own alpha so it can be composited again on the next opaque ancestor.
 */
function flatten(fg: Rgba, bg: Rgba): Rgba {
  const a = fg.a + bg.a * (1 - fg.a);
  if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
  return {
    r: Math.round((fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a),
    g: Math.round((fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a),
    b: Math.round((fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a),
    a,
  };
}

export function contrastRatio(fg: Rgba, bg: Rgba): number {
  const front = flatten(fg, bg);
  const l1 = luminance(front);
  const l2 = luminance(bg);
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}

const NAMED: Record<string, [number, number, number]> = {
  white: [255, 255, 255],
  black: [0, 0, 0],
};

export function parseColor(color: string): Rgba | null {
  if (!color) return null;
  const value = color.trim().toLowerCase();
  if (value === "transparent") return { r: 0, g: 0, b: 0, a: 0 };

  const rgb = value.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:\s*[,/]\s*([\d.]+))?\s*\)/);
  if (rgb) {
    return {
      r: Number(rgb[1]),
      g: Number(rgb[2]),
      b: Number(rgb[3]),
      a: rgb[4] === undefined ? 1 : Number(rgb[4]),
    };
  }

  const hex = value.match(/^#([0-9a-f]{3,8})$/);
  if (hex) {
    let h = hex[1];
    if (h.length === 3 || h.length === 4) h = h.split("").map((c) => c + c).join("");
    if (h.length === 6 || h.length === 8) {
      return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
        a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
      };
    }
  }

  const named = NAMED[value];
  if (named) return { r: named[0], g: named[1], b: named[2], a: 1 };

  return null;
}

function isVisible(el: Element): boolean {
  return (el as HTMLElement).getClientRects().length > 0;
}

function describe(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const id = el.id ? `#${el.id}` : "";
  const role = el.getAttribute("role");
  const cls =
    el.className && typeof el.className === "string"
      ? `.${el.className.trim().split(/\s+/)[0]}`
      : "";
  return `${tag}${id}${role ? `[role="${role}"]` : ""}${cls}`;
}

/** True if the element is inside an `aria-hidden="true"` subtree. */
function isAriaHidden(el: Element): boolean {
  return !!el.closest('[aria-hidden="true"]');
}

/**
 * True when `node` has a positioned child that is painted and overlaps `el`'s box but
 * is not itself on `el`'s ancestor path — the shape of a hero image layer sitting
 * behind a `z-10` content wrapper. The ancestor walk cannot see through that, so the
 * result is treated as indeterminate.
 */
function hasOverlappingPaintedSibling(node: Element, el: Element, rect: DOMRect): boolean {
  for (const child of Array.from(node.children)) {
    if (child === el || child.contains(el)) continue;
    const style = getComputedStyle(child);
    if (style.position === "static") continue;
    const hasMedia = child.querySelector("img, video, picture, canvas, svg") !== null;
    const painted =
      hasMedia ||
      style.backgroundImage !== "none" ||
      (parseColor(style.backgroundColor)?.a ?? 0) > 0;
    if (!painted) continue;
    const r = child.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const overlaps =
      r.left < rect.right && r.right > rect.left && r.top < rect.bottom && r.bottom > rect.top;
    if (overlaps) return true;
  }
  return false;
}

/**
 * Walk up the tree to the first opaque background, because `background-color` on a
 * text element is almost always `rgba(0, 0, 0, 0)`. Checking only the element's own
 * background (the obvious implementation) finds nothing and gives a false all-clear.
 *
 * Returns `null` when the result cannot be trusted:
 *  - the walk crosses a transparent `position: fixed|absolute` element (typically a
 *    floating header painted over a hero), or
 *  - an ancestor has a positioned, painted child overlapping the text (a hero image
 *    layer behind a `z-10` content wrapper).
 *
 * In both cases the nearest opaque ancestor is the light page body while the text
 * visually sits on a dark image. Reporting that pair would claim ~1:1 contrast on
 * perfectly legible text, and a checker that cries wolf is a checker people learn to
 * ignore. Skipping is a false negative, which is the right side to err on here.
 */
function effectiveBackground(el: Element): Rgba | null {
  const rect = el.getBoundingClientRect();
  let node: Element | null = el;
  let indeterminate = false;
  // Backgrounds are collected nearest-first; each translucent layer sits *over*
  // the ones found later, so compositing has to happen in walk order.
  let acc: Rgba | null = null;

  while (node) {
    const style = getComputedStyle(node);
    const bg = parseColor(style.backgroundColor);

    if (bg && bg.a > 0) {
      if (bg.a >= 1) {
        return indeterminate ? null : acc ? flatten(acc, bg) : bg;
      }
      acc = acc ? flatten(acc, bg) : bg;
    }

    if (node !== el) {
      if (style.position === "fixed" || style.position === "absolute") indeterminate = true;
      if (hasOverlappingPaintedSibling(node, el, rect)) indeterminate = true;
    }
    node = node.parentElement;
  }
  return null;
}

/** A control's accessible name, approximated from the attributes that supply one. */
function accessibleName(el: Element): string {
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel?.trim()) return ariaLabel.trim();

  const labelledBy = el.getAttribute("aria-labelledby");
  if (labelledBy) {
    const text = labelledBy
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent?.trim() ?? "")
      .join(" ")
      .trim();
    if (text) return text;
  }

  const id = el.id;
  if (id) {
    const label = document.querySelector(`label[for="${CSS.escape(id)}"]`);
    if (label?.textContent?.trim()) return label.textContent.trim();
  }

  const wrapping = el.closest("label");
  if (wrapping?.textContent?.trim()) return wrapping.textContent.trim();

  return el.textContent?.trim() ?? "";
}

const HELP = {
  alt: "https://www.w3.org/WAI/WCAG21/Understanding/non-text-content",
  label: "https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships",
  name: "https://www.w3.org/WAI/WCAG21/Understanding/name-role-value",
  contrast: "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum",
  focusOrder: "https://www.w3.org/WAI/WCAG21/Understanding/focus-order",
};

export async function runA11yAudit(): Promise<A11yViolation[]> {
  if (typeof document === "undefined") return [];

  const violations: A11yViolation[] = [];
  let counter = 0;
  const push = (v: Omit<A11yViolation, "id">) => {
    violations.push({ id: `v_${++counter}`, ...v });
  };

  // 1.1.1 Non-text content — images need a text alternative (or to be decorative).
  document.querySelectorAll("img").forEach((img) => {
    if (isAriaHidden(img)) return;
    const decorative =
      img.getAttribute("role") === "presentation" || img.getAttribute("role") === "none";
    if (!decorative && !img.hasAttribute("alt")) {
      push({
        rule: "1.1.1",
        severity: "critical",
        message: 'Image is missing an alt attribute (use alt="" if it is decorative)',
        element: describe(img),
        helpUrl: HELP.alt,
      });
    }
  });

  // 1.3.1 / 4.1.2 — form controls need an accessible name. A placeholder is not one.
  document.querySelectorAll("input, select, textarea").forEach((el) => {
    const control = el as HTMLInputElement;
    if (isAriaHidden(control) || control.type === "hidden" || !isVisible(control)) return;
    if (accessibleName(control)) return;
    push({
      rule: "1.3.1",
      severity: "serious",
      message: control.hasAttribute("placeholder")
        ? "Form control has no label (a placeholder is not a label)"
        : "Form control has no accessible name",
      element: describe(control),
      helpUrl: HELP.label,
    });
  });

  // 4.1.2 — buttons and links need a name. Icon-only controls must carry one.
  document.querySelectorAll('button, [role="button"], a[href]').forEach((el) => {
    if (isAriaHidden(el) || !isVisible(el)) return;
    if (accessibleName(el)) return;
    push({
      rule: "4.1.2",
      severity: "serious",
      message: `${el.tagName.toLowerCase() === "a" ? "Link" : "Button"} has no accessible name`,
      element: describe(el),
      helpUrl: HELP.name,
    });
  });

  // 2.4.3 — a positive tabindex reorders the page and almost never helps.
  document.querySelectorAll("[tabindex]").forEach((el) => {
    const value = Number(el.getAttribute("tabindex"));
    if (Number.isFinite(value) && value > 0 && isVisible(el)) {
      push({
        rule: "2.4.3",
        severity: "moderate",
        message: `Positive tabindex (${value}) overrides the natural focus order`,
        element: describe(el),
        helpUrl: HELP.focusOrder,
      });
    }
  });

  // 4.1.2 — focusable content hidden from assistive tech: the reader can land on
  // something the screen reader refuses to announce.
  document
    .querySelectorAll(
      '[aria-hidden="true"] a[href], [aria-hidden="true"] button, [aria-hidden="true"] [tabindex]:not([tabindex="-1"])'
    )
    .forEach((el) => {
      if (!isVisible(el)) return;
      push({
        rule: "4.1.2",
        severity: "serious",
        message: "Focusable element sits inside an aria-hidden container",
        element: describe(el),
        helpUrl: HELP.name,
      });
    });

  // 1.4.3 Contrast — sampled, since a full pass over a large page is slow.
  const textNodes = Array.from(
    document.querySelectorAll("p, span, h1, h2, h3, h4, h5, h6, a, li, label, button, td, th")
  )
    .filter((el) => {
      if (!isVisible(el) || isAriaHidden(el)) return false;
      // WCAG 1.4.3 exempts logotypes from the contrast minimum.
      if (el.closest("[data-logotype]")) return false;
      // Only leaf text, so a container's colour is not judged on its children's text.
      const ownText = Array.from(el.childNodes).some(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()
      );
      return ownText;
    })
    .slice(0, 80);

  const seen = new Set<string>();
  textNodes.forEach((el) => {
    const style = getComputedStyle(el);
    const fg = parseColor(style.color);
    if (!fg || fg.a === 0) return;
    const bg = effectiveBackground(el);
    if (!bg) return; // Indeterminate (text over an overlay) — see effectiveBackground.
    const ratio = contrastRatio(fg, bg);

    const size = parseFloat(style.fontSize);
    const bold = parseInt(style.fontWeight, 10) >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const required = large ? 3 : 4.5;
    if (ratio >= required) return;

    // De-duplicate by the pair of colours: one failing token shows up on every
    // element that uses it, and 40 copies of the same finding is noise.
    const key = `${style.color}|${bg.r},${bg.g},${bg.b}`;
    if (seen.has(key)) return;
    seen.add(key);

    push({
      rule: "1.4.3",
      severity: ratio < 3 ? "serious" : "moderate",
      message: `Contrast ${ratio.toFixed(2)}:1 is below the ${required}:1 required for this text size`,
      element: describe(el),
      helpUrl: HELP.contrast,
    });
  });

  // 1.3.1 Landmarks.
  if (!document.querySelector('main, [role="main"]')) {
    push({
      rule: "1.3.1",
      severity: "serious",
      message: "Page has no <main> landmark",
      element: "document",
      helpUrl: HELP.label,
    });
  }
  if (!document.querySelector('nav, [role="navigation"]')) {
    push({
      rule: "1.3.1",
      severity: "moderate",
      message: "Page has no <nav> landmark",
      element: "document",
      helpUrl: HELP.label,
    });
  }

  // 4.1.1 — duplicate ids break label and aria-labelledby references.
  const ids = new Map<string, number>();
  document.querySelectorAll("[id]").forEach((el) => {
    ids.set(el.id, (ids.get(el.id) ?? 0) + 1);
  });
  ids.forEach((count, id) => {
    if (count > 1) {
      push({
        rule: "4.1.1",
        severity: "moderate",
        message: `Duplicate id "${id}" (${count} elements)`,
        element: `#${id}`,
        helpUrl: HELP.name,
      });
    }
  });

  return violations;
}

/**
 * Dev-only auto-runner. Re-audits after DOM changes (debounced) and both logs to the
 * console and emits a `tw-a11y-audit` event for the audit panel to consume.
 */
export function initA11yAudit(): () => void {
  if (typeof window === "undefined" || process.env.NODE_ENV === "production") {
    return () => {};
  }

  let timer: number | undefined;
  const run = () => {
    void runA11yAudit().then((violations) => {
      if (violations.length === 0) return;
      // eslint-disable-next-line no-console
      console.groupCollapsed(
        `%cA11y audit: ${violations.length} finding(s)`,
        "color:#E10600;font-weight:bold"
      );
      violations.forEach((v) => {
        // eslint-disable-next-line no-console
        console.warn(`[${v.severity}] WCAG ${v.rule}: ${v.message} — ${v.element}`);
      });
      // eslint-disable-next-line no-console
      console.groupEnd();
      window.dispatchEvent(new CustomEvent("tw-a11y-audit", { detail: { violations } }));
    });
  };

  const observer = new MutationObserver(() => {
    window.clearTimeout(timer);
    timer = window.setTimeout(run, 800);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    window.clearTimeout(timer);
    observer.disconnect();
  };
}
