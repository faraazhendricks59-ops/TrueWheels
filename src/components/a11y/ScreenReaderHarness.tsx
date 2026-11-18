"use client";

import { useEffect, useRef, useState } from "react";
import { Ear, Trash2, Pause, Play } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";

type EventType = "announcement" | "focus";

interface HarnessEvent {
  id: number;
  at: Date;
  type: EventType;
  content: string;
  priority?: "polite" | "assertive";
}

const TYPE_STYLE: Record<EventType, string> = {
  announcement: "bg-aurora-purple/20 text-aurora-purple",
  focus: "bg-aurora-blue/20 text-aurora-blue",
};

function clockTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function describeFocus(el: HTMLElement): string {
  const role = el.getAttribute("role") || el.tagName.toLowerCase();
  const name =
    el.getAttribute("aria-label")?.trim() ||
    el.getAttribute("placeholder")?.trim() ||
    el.textContent?.trim().slice(0, 60) ||
    "(no name)";
  const state = el.getAttribute("aria-expanded") !== null ? ` expanded=${el.getAttribute("aria-expanded")}` : "";
  return `${role}: ${name}${state}`;
}

/**
 * Dev-only log of the two things this app actually does to drive assistive tech:
 * writes into `[aria-live]` regions, and moves focus.
 *
 * It is NOT a screen reader emulator, and it does not claim to be. A real screen
 * reader computes an accessible name from the whole accessibility tree, applies its
 * own verbosity rules, and decides when to interrupt. This panel can only show what
 * is written into the live regions and where focus lands — which is exactly the part
 * a developer can regress without noticing, so it is the part worth watching.
 */
export function ScreenReaderHarness() {
  const [events, setEvents] = useState<HarnessEvent[]>([]);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || process.env.NODE_ENV === "production") return;

    let nextId = 0;
    const record = (event: Omit<HarnessEvent, "id" | "at">) => {
      if (pausedRef.current) return;
      setEvents((prev) => [...prev, { id: nextId++, at: new Date(), ...event }].slice(-100));
    };

    // Announcements: any element with an aria-live value, watched for text changes.
    const watched = new WeakSet<Node>();
    const attachLiveRegions = () => {
      document.querySelectorAll("[aria-live]").forEach((region) => {
        if (watched.has(region)) return;
        watched.add(region);
        new MutationObserver(() => {
          const text = region.textContent?.trim();
          if (!text) return;
          const priority = region.getAttribute("aria-live") === "assertive" ? "assertive" : "polite";
          record({ type: "announcement", content: text, priority });
        }).observe(region, { childList: true, characterData: true, subtree: true });
      });
    };
    attachLiveRegions();

    // Live regions can be mounted after this panel is, so re-scan on DOM changes.
    const discovery = new MutationObserver(attachLiveRegions);
    discovery.observe(document.body, { childList: true, subtree: true });

    const onFocusIn = (event: FocusEvent) => {
      const el = event.target as HTMLElement | null;
      if (!el || el === document.body) return;
      record({ type: "focus", content: describeFocus(el) });
    };
    document.addEventListener("focusin", onFocusIn);

    return () => {
      discovery.disconnect();
      document.removeEventListener("focusin", onFocusIn);
    };
  }, []);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [events]);

  return (
    <Reveal variant="up" delay={100}>
      <section
        aria-labelledby="sr-harness-heading"
        className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-lift overflow-hidden"
      >
        <div className="p-4 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-aurora-purple/10 flex items-center justify-center text-aurora-purple">
              <Icon icon={Ear} size={16} />
            </span>
            <div>
              <h2 id="sr-harness-heading" className="text-sm font-display font-bold text-ink-900 dark:text-white">
                Live region &amp; focus log
              </h2>
              <p className="text-[10px] text-ink-500 dark:text-ink-400">
                Observes aria-live writes and focus moves. Not a screen reader emulator.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="status" tone="ink">
              {events.length} events
            </Badge>
            <button
              type="button"
              onClick={() => setPaused((v) => !v)}
              aria-pressed={paused}
              aria-label={paused ? "Resume logging" : "Pause logging"}
              className="p-2 text-ink-500 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg transition-colors"
            >
              <Icon icon={paused ? Play : Pause} size={14} />
            </button>
            <button
              type="button"
              onClick={() => setEvents([])}
              aria-label="Clear log"
              className="p-2 text-ink-500 hover:text-semantic-error hover:bg-semantic-error/10 rounded-lg transition-colors"
            >
              <Icon icon={Trash2} size={14} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="max-h-[400px] overflow-y-auto p-4 space-y-1.5 bg-ink-950 font-mono text-xs custom-scrollbar"
          role="log"
          aria-label="Screen reader event log"
        >
          {events.length === 0 ? (
            <p className="text-ink-500 text-center py-8">
              Interact with the page — focus something, trigger an announcement.
            </p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="flex items-start gap-2 py-1 border-b border-ink-800/60">
                <span className="text-ink-500 flex-shrink-0">{clockTime(event.at)}</span>
                <span
                  className={clsx(
                    "px-1.5 py-0.5 rounded text-[9px] font-bold flex-shrink-0 uppercase",
                    TYPE_STYLE[event.type]
                  )}
                >
                  {event.type === "announcement" ? "live" : "focus"}
                </span>
                {event.priority && (
                  <span
                    className={clsx(
                      "px-1.5 py-0.5 rounded text-[9px] font-bold flex-shrink-0",
                      event.priority === "assertive"
                        ? "bg-semantic-error/20 text-semantic-error"
                        : "bg-ink-800 text-ink-300"
                    )}
                  >
                    {event.priority}
                  </span>
                )}
                <span className="text-ink-200 flex-1 break-words">{event.content}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </Reveal>
  );
}
