"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Focus, RefreshCw } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";

interface FocusableItem {
  element: HTMLElement;
  index: number;
  label: string;
  tag: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function labelFor(el: HTMLElement): string {
  return (
    el.getAttribute("aria-label")?.trim() ||
    el.getAttribute("placeholder")?.trim() ||
    el.textContent?.trim().slice(0, 40) ||
    el.getAttribute("title")?.trim() ||
    "(no name)"
  );
}

/**
 * Numbers every focusable element in tab order and draws a marker over it.
 *
 * The markers are `position: fixed` in a portal to `document.body`, positioned from
 * each element's live viewport rect and re-measured on scroll and resize. Drawing
 * them inside the panel's own scroll container (the obvious approach) puts them in
 * the wrong place, because a rect is viewport-relative while the container is not.
 */
export function FocusOrderDebugger() {
  const [items, setItems] = useState<FocusableItem[]>([]);
  const [scanning, setScanning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const scan = useCallback(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (el) => el.getClientRects().length > 0
    );

    // Sort by the real tab order: tabindex first, then document position. A plain
    // DOM sweep is wrong once any element carries a positive tabindex.
    const sorted = elements
      .map((el) => ({ el, tab: Number(el.getAttribute("tabindex") ?? 0) }))
      .sort((a, b) => {
        if (a.tab !== b.tab) return a.tab - b.tab;
        const rel = a.el.compareDocumentPosition(b.el);
        if (rel & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        if (rel & Node.DOCUMENT_POSITION_PRECEDING) return 1;
        return 0;
      })
      .map(({ el }) => el);

    setItems(
      sorted.map((el, i) => {
        const rect = el.getBoundingClientRect();
        return {
          element: el,
          index: i + 1,
          label: labelFor(el),
          tag: el.tagName.toLowerCase(),
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        };
      })
    );
  }, []);

  const rescan = useCallback(() => {
    setScanning(true);
    scan();
    setScanning(false);
  }, [scan]);

  // Keep the markers pinned while the page moves under them.
  useEffect(() => {
    if (items.length === 0) return;
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items.length, scan]);

  const focusItem = (item: FocusableItem) => {
    item.element.scrollIntoView({ block: "center", behavior: "auto" });
    item.element.focus({ preventScroll: true });
    scan();
  };

  return (
    <Reveal variant="up" delay={300}>
      <section
        aria-labelledby="focus-debugger-heading"
        className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5 shadow-lift"
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-aurora-blue/10 flex items-center justify-center text-aurora-blue">
              <Icon icon={Focus} size={16} />
            </span>
            <div>
              <h2
                id="focus-debugger-heading"
                className="text-sm font-display font-bold text-ink-900 dark:text-white"
              >
                Focus Order Debugger
              </h2>
              <p className="text-[10px] text-ink-500 dark:text-ink-400">
                Numbers the tab order and draws it over the page.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={rescan}
            disabled={scanning}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-ink-200 dark:border-ink-700 text-xs font-semibold text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors disabled:opacity-50"
          >
            <Icon icon={RefreshCw} size={14} />
            {items.length > 0 ? "Rescan" : "Scan page"}
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-xs text-ink-500 dark:text-ink-400 py-4">
            Scan the page to list every focusable element in the order Tab reaches it.
          </p>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="status" tone="blue">
                {items.length} focusable
              </Badge>
              <span className="text-[10px] text-ink-500 dark:text-ink-400">
                Markers follow the page as you scroll.
              </span>
            </div>

            <ol className="max-h-[240px] overflow-y-auto space-y-1 custom-scrollbar">
              {items.map((item) => (
                <li key={item.index}>
                  <button
                    type="button"
                    onClick={() => focusItem(item)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg text-left hover:bg-ink-50 dark:hover:bg-ink-950 transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-aurora-blue/10 text-aurora-blue text-[10px] font-bold flex items-center justify-center flex-shrink-0 tabular-nums">
                      {item.index}
                    </span>
                    <span className="font-mono text-ink-500 dark:text-ink-400 text-[10px] flex-shrink-0">
                      {item.tag}
                    </span>
                    <span className="text-ink-700 dark:text-ink-200 text-xs truncate">
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </>
        )}
      </section>

      {mounted &&
        items.length > 0 &&
        createPortal(
          <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60]">
            {items.map((item) => (
              <div
                key={item.index}
                className="absolute rounded border-2 border-aurora-blue bg-aurora-blue/10"
                style={{
                  top: item.top,
                  left: item.left,
                  width: item.width,
                  height: item.height,
                }}
              >
                <span className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-aurora-blue text-white text-[10px] font-bold flex items-center justify-center shadow-lg tabular-nums">
                  {item.index}
                </span>
              </div>
            ))}
          </div>,
          document.body
        )}
    </Reveal>
  );
}
