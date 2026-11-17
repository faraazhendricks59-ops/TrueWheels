import { Activity, Gavel, Eye } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

const EVENTS = [
  { icon: Gavel, text: "New bid on 2021 BMW M3 Competition", meta: "R 1 245 000 · 2 min ago" },
  { icon: Eye, text: "48 people viewing Hilux Legend", meta: "Sandton, GP · 5 min ago" },
  { icon: Activity, text: "Price drop on 2019 Golf GTI", meta: "R 389 900 · 12 min ago" },
];

export function LiveActivityRail() {
  return (
    <aside className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5 shadow-lift">
      <h3 className="flex items-center gap-2 font-display font-bold text-ink-900 dark:text-white mb-4">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-semantic-success opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-semantic-success" />
        </span>
        Live activity
      </h3>
      <ul className="space-y-4">
        {EVENTS.map((event) => (
          <li key={event.text} className="flex gap-3">
            <span className="mt-0.5 text-ink-400">
              <Icon icon={event.icon} size={14} />
            </span>
            <span>
              <span className="block text-xs font-medium text-ink-700 dark:text-ink-200">{event.text}</span>
              <span className="block text-[10px] text-ink-400 mt-0.5">{event.meta}</span>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
