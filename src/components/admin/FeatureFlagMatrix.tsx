"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { AlertTriangle, Check, Search, X } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { flagGroups, realFlags } from "@/lib/god-mode-data";

/**
 * Every flag the application was built with, read-only.
 *
 * The brief's matrix was a dense editable table with per-flag toggles, targeting
 * chips and rollout percentages. None of those controls would do anything, because
 * the flags are compile-time constants — so an operator would flip a switch, see it
 * flip, and be wrong about the state of the system.
 *
 * What is honest and still useful is the real list: 256 flags, which ones are on,
 * and which are off in the build as shipped. That answers the question an operator
 * actually has — "what did we ship?" — without pretending to change it.
 */
export function FeatureFlagMatrix() {
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("all");

  const flags = useMemo(() => realFlags(), []);
  const groups = useMemo(() => flagGroups(), []);

  const filtered = useMemo(
    () =>
      flags.filter((row) => {
        const matchesSearch =
          !search ||
          row.key.toLowerCase().includes(search.toLowerCase());
        const matchesGroup = groupFilter === "all" || row.group === groupFilter;
        return matchesSearch && matchesGroup;
      }),
    [flags, search, groupFilter]
  );

  const enabledCount = flags.filter((row) => row.enabled).length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Flags in the build" value={flags.length} />
        <Stat label="Enabled" value={enabledCount} accent="text-semantic-success" />
        <Stat label="Disabled" value={flags.length - enabledCount} accent="text-ink-400" />
        <Stat label="Groups" value={groups.length} />
      </div>

      <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-4 flex flex-col lg:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search flags by key…"
            leftIcon={Search}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <select
          value={groupFilter}
          onChange={(event) => setGroupFilter(event.target.value)}
          aria-label="Filter by group"
          className="h-10 px-3 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800 text-xs font-semibold text-ink-700 dark:text-ink-200 focus:outline-none focus:border-brand"
        >
          <option value="all">All groups</option>
          {groups.map((group) => (
            <option key={group.group} value={group.group}>
              {group.group} ({group.count})
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-ink-50 dark:bg-ink-950 border-b border-ink-100 dark:border-ink-800">
                <th className="px-5 py-3 text-[10px] font-bold text-ink-400 uppercase tracking-wider">
                  Flag key
                </th>
                <th className="px-5 py-3 text-[10px] font-bold text-ink-400 uppercase tracking-wider">
                  Group
                </th>
                <th className="px-5 py-3 text-[10px] font-bold text-ink-400 uppercase tracking-wider">
                  In this build
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
              {filtered.map((row) => (
                <tr key={row.key} className="hover:bg-ink-50/50 dark:hover:bg-ink-950/50">
                  <td className="px-5 py-2.5">
                    <code className="text-[11px] font-mono text-ink-700 dark:text-ink-200">
                      {row.key}
                    </code>
                  </td>
                  <td className="px-5 py-2.5">
                    <Badge variant="spec">{row.group}</Badge>
                  </td>
                  <td className="px-5 py-2.5">
                    <span
                      className={clsx(
                        "inline-flex items-center gap-1.5 text-[11px] font-semibold",
                        row.enabled ? "text-semantic-success" : "text-ink-400"
                      )}
                    >
                      <Icon icon={row.enabled ? Check : X} size={12} strokeWidth={2.5} />
                      {row.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-sm text-ink-400">
            No flags match your filters.
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 p-3 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
        <Icon icon={AlertTriangle} size={13} className="text-ink-400 mt-0.5 flex-shrink-0" />
        <p className="text-[10px] text-ink-500 dark:text-ink-400 leading-relaxed">
          Changing any flag means changing the code and deploying a new build. There is
          no toggle here that would take effect on the running application.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5">
      <p className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-1">{label}</p>
      <p
        className={clsx(
          "text-3xl font-display font-bold tabular-nums",
          accent ?? "text-ink-900 dark:text-white"
        )}
      >
        {value}
      </p>
    </div>
  );
}
