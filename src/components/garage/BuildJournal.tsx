"use client";

import { useState } from "react";
import { Calendar, Camera, Plus, Trash2, Wrench } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Reveal } from "@/components/motion/Reveal";
import { SmartButton } from "@/components/ui/SmartButton";
import { JOURNAL_EXPLAINED, PROGRESS_EXPLAINED, formatEntryDate, isIsoDate, type JournalEntry } from "@/lib/garage";
import { localeTag } from "@/lib/i18n/dictionaries";

const zar = (value: number) => `R ${value.toLocaleString("en-ZA")}`;

/**
 * The build journal for one vehicle.
 *
 * The brief shipped `MOCK_JOURNAL`, two hardcoded entries about an IS38 turbo
 * swap and a coilover refresh, costing R28 500 and R45 000, and totalled them
 * under "Total Invested". Those are someone else's modifications on a car the
 * user does not own, presented as their spend. The Add button was wired to
 * nothing, so the only way to change the number was to edit the source.
 *
 * Here the journal starts empty, the user records entries, and the total is the
 * sum of what they entered. Photos are not offered, because there is no upload
 * anywhere in this project and an empty frame invites a fabricated one.
 */
export function BuildJournal({
  vehicleTitle,
  entries,
  onAdd,
  onRemove,
}: {
  vehicleTitle: string;
  entries: JournalEntry[];
  onAdd: (entry: Omit<JournalEntry, "id">) => void;
  onRemove: (entryId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [parts, setParts] = useState("");
  const [errors, setErrors] = useState<{ title?: string; date?: string; cost?: string }>({});

  const total = entries.reduce((sum, entry) => sum + (entry.cost ?? 0), 0);
  const sorted = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1));

  const submit = () => {
    const next: typeof errors = {};
    if (!title.trim()) next.title = "Give the entry a title";
    if (!isIsoDate(date)) next.date = "Use a date in YYYY-MM-DD form";
    if (cost.trim() && (!/^\d+$/.test(cost.trim()) || Number(cost) < 0)) {
      next.cost = "Cost must be a whole number of rand";
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    onAdd({
      date,
      title: title.trim().slice(0, 80),
      description: description.trim().slice(0, 600),
      cost: cost.trim() ? Number(cost) : undefined,
      parts: parts
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .slice(0, 8),
    });
    setTitle("");
    setDate("");
    setCost("");
    setDescription("");
    setParts("");
    setIsOpen(false);
  };

  return (
    <Reveal variant="up" delay={100}>
      <section
        aria-labelledby="journal-heading"
        className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6 shadow-lift"
      >
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h3
              id="journal-heading"
              className="text-lg font-display font-bold text-ink-900 dark:text-white flex items-center gap-2"
            >
              <Icon icon={Wrench} size={18} className="text-brand" />
              Build journal: {vehicleTitle}
            </h3>
            <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">{JOURNAL_EXPLAINED}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider">
              Your logged spend
            </p>
            <p className="text-xl font-display font-bold text-brand tabular-nums">{zar(total)}</p>
            <p className="text-[11px] text-ink-400">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </p>
          </div>
        </div>

        {sorted.length === 0 ? (
          <p className="text-sm text-ink-500 dark:text-ink-400 py-8 text-center rounded-xl border border-dashed border-ink-200 dark:border-ink-800">
            No entries yet. Add the first thing you did to this car.
          </p>
        ) : (
          <ol className="relative space-y-8 pl-4">
            <div
              className="absolute left-[23px] top-2 bottom-2 w-px bg-ink-100 dark:bg-ink-800"
              aria-hidden="true"
            />
            {sorted.map((entry) => (
              <li key={entry.id} className="relative flex gap-5">
                <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-brand bg-white dark:bg-ink-900 text-brand">
                  <Icon icon={Wrench} size={18} />
                </div>

                <div className="flex-1 pt-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="text-sm font-bold text-ink-900 dark:text-white">{entry.title}</h4>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-mono font-bold text-ink-500 flex items-center gap-1">
                        <Icon icon={Calendar} size={10} /> {formatEntryDate(entry.date, localeTag("en"))}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemove(entry.id)}
                        className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-ink-400 hover:bg-semantic-error/10 hover:text-semantic-error transition-colors"
                        aria-label={`Remove journal entry ${entry.title}`}
                      >
                        <Icon icon={Trash2} size={12} />
                      </button>
                    </div>
                  </div>

                  {entry.description && (
                    <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed mb-3">
                      {entry.description}
                    </p>
                  )}

                  {(entry.cost !== undefined || entry.parts.length > 0) && (
                    <div className="flex flex-wrap items-center gap-2">
                      {entry.cost !== undefined && (
                        <Badge variant="spec" tone="red">
                          {zar(entry.cost)}
                        </Badge>
                      )}
                      {entry.parts.map((part) => (
                        <Badge key={part} variant="spec">
                          {part}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-8 pt-6 border-t border-ink-100 dark:border-ink-800">
          {!isOpen ? (
            <div className="flex justify-center">
              <SmartButton
                featureKey="garage.add_journal_entry"
                variant="secondary"
                leftIcon={Camera}
                onClick={() => setIsOpen(true)}
              >
                Add modification entry
              </SmartButton>
            </div>
          ) : (
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                submit();
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="What did you do?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={errors.title}
                  hint={errors.title ? undefined : "For example: fitted a cat-back exhaust"}
                  maxLength={80}
                />
                <Input
                  label="Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  error={errors.date}
                />
              </div>
              <Input
                label="Notes"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={600}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Cost in rand (optional)"
                  inputMode="numeric"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  error={errors.cost}
                  hint={errors.cost ? undefined : "Leave blank if you would rather not record it"}
                />
                <Input
                  label="Parts (optional)"
                  value={parts}
                  onChange={(e) => setParts(e.target.value)}
                  hint="Separate with commas"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <SmartButton featureKey="garage.add_journal_entry" type="submit" leftIcon={Plus}>
                  Save entry
                </SmartButton>
                <SmartButton
                  featureKey="garage.add_journal_entry"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </SmartButton>
              </div>
            </form>
          )}
        </div>
      </section>
    </Reveal>
  );
}
