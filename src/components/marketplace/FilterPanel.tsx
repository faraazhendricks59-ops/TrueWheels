import { SlidersHorizontal } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

const GROUPS = [
  { title: "Price", options: ["Under R 200 000", "R 200 000 – R 500 000", "Above R 500 000"] },
  { title: "Body type", options: ["Hatchback", "Sedan", "Bakkie", "SUV"] },
  { title: "Province", options: ["Gauteng", "KwaZulu-Natal", "Western Cape"] },
];

export function FilterPanel() {
  return (
    <aside className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5 shadow-lift">
      <h3 className="flex items-center gap-2 font-display font-bold text-ink-900 dark:text-white mb-4">
        <Icon icon={SlidersHorizontal} size={16} />
        Filters
      </h3>
      <div className="space-y-5">
        {GROUPS.map((group) => (
          <fieldset key={group.title}>
            <legend className="text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400 mb-2">
              {group.title}
            </legend>
            <div className="space-y-2">
              {group.options.map((option) => (
                <label key={option} className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-ink-300 text-brand focus:ring-brand"
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </aside>
  );
}
