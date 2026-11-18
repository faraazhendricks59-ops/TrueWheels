"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { CornerDownLeft, MoveHorizontal } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { useRovingTabindex } from "@/hooks/useRovingTabindex";

const ITEMS = ["Overview", "Specs", "History", "Finance", "Inspection"];

/**
 * A live example of the roving-tabindex hook, kept on the dev audit route so the
 * primitive can be exercised rather than only described.
 *
 * Tab into it once and the whole widget is a single stop; the arrow keys then move
 * within it. The readout shows which item currently holds the tab stop, which is the
 * thing that is otherwise invisible and easy to get wrong.
 */
export function RovingTabindexDemo() {
  const [selected, setSelected] = useState(0);

  const { containerProps, getItemProps, activeIndex } = useRovingTabindex<HTMLDivElement>({
    orientation: "horizontal",
    loop: true,
    onActivate: setSelected,
  });

  return (
    <Reveal variant="up" delay={400}>
      <section
        aria-labelledby="roving-demo-heading"
        className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5 shadow-lift"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="w-9 h-9 rounded-xl bg-semantic-success/10 flex items-center justify-center text-semantic-success">
            <Icon icon={MoveHorizontal} size={16} />
          </span>
          <div>
            <h2
              id="roving-demo-heading"
              className="text-sm font-display font-bold text-ink-900 dark:text-white"
            >
              Roving tabindex
            </h2>
            <p className="text-[10px] text-ink-500 dark:text-ink-400">
              Tab in once; the arrow keys move inside. Home and End jump to the ends.
            </p>
          </div>
        </div>

        <div
          {...containerProps}
          role="tablist"
          aria-label="Roving tabindex example"
          className="flex flex-wrap gap-1.5 mb-4"
        >
          {ITEMS.map((item, i) => {
            const isActive = i === selected;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                id={`roving-tab-${i}`}
                aria-controls={`roving-panel-${i}`}
                {...getItemProps(i, { selected: isActive })}
                onClick={() => {
                  setSelected(i);
                }}
                className={clsx(
                  "h-9 px-3 rounded-lg text-xs font-semibold border transition-colors",
                  isActive
                    ? "bg-brand text-white border-transparent"
                    : "bg-transparent text-ink-600 dark:text-ink-300 border-ink-200 dark:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-800"
                )}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div
          id={`roving-panel-${selected}`}
          role="tabpanel"
          aria-labelledby={`roving-tab-${selected}`}
          className="flex items-center justify-between gap-3 p-3 rounded-lg bg-ink-50 dark:bg-ink-950 text-xs"
        >
          <span className="text-ink-600 dark:text-ink-300">
            Panel: <strong className="text-ink-900 dark:text-white">{ITEMS[selected]}</strong>
          </span>
          <Badge variant="spec">tab stop on item {activeIndex + 1}</Badge>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-[10px] text-ink-500 dark:text-ink-400">
          <Icon icon={CornerDownLeft} size={12} />
          Only one item is ever in the page tab order (WCAG 2.1.1).
        </p>
      </section>
    </Reveal>
  );
}
