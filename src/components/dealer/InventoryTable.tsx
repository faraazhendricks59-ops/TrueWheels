"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckCircle2,
  Download,
  Edit3,
  Eye,
  MessageSquare,
  MoreHorizontal,
  Pause,
  Play,
  Search,
  Trash2,
} from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { SmartButton } from "@/components/ui/SmartButton";
import { Dropdown, DropdownItem } from "@/components/ui/Floating";
import { useToast } from "@/components/ui/Toast";
import {
  formatZAR,
  SAMPLE_INVENTORY,
  STATUS_CONFIG,
  type InventoryItem,
  type ListingStatus,
} from "@/lib/dealer/data";
import { photoForVehicle } from "@/lib/vehicle-photos";

type SortKey = "title" | "price" | "views" | "inquiries" | "daysListed";
type SortDirection = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string; align: "left" | "right" | "center" }[] = [
  { key: "title", label: "Vehicle", align: "left" },
  { key: "price", label: "Price", align: "right" },
  { key: "views", label: "Views", align: "center" },
  { key: "inquiries", label: "Leads", align: "center" },
  { key: "daysListed", label: "Days", align: "center" },
];

/**
 * Inventory management table.
 *
 * The status actions genuinely change the row: pausing, reactivating and marking
 * sold all write to the table's own state, and the derived counts elsewhere in
 * the command centre follow. Nothing is a button that looks live but does
 * nothing. The data itself is sample data, and the toolbar says so.
 */
export function InventoryTable({ onInventoryChange }: { onInventoryChange?: (items: InventoryItem[]) => void }) {
  const [items, setItems] = useState<InventoryItem[]>(SAMPLE_INVENTORY);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("daysListed");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const { toast } = useToast();

  const commit = (next: InventoryItem[]) => {
    setItems(next);
    onInventoryChange?.(next);
  };

  const setStatus = (ids: string[], status: ListingStatus) => {
    commit(items.map((item) => (ids.includes(item.id) ? { ...item, status } : item)));
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
  };

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const rows = needle
      ? items.filter(
          (item) =>
            item.title.toLowerCase().includes(needle) ||
            item.stockNumber.toLowerCase().includes(needle)
        )
      : items;

    const sorted = [...rows].sort((a, b) => {
      const left = a[sortKey];
      const right = b[sortKey];
      const result =
        typeof left === "string" && typeof right === "string"
          ? left.localeCompare(right)
          : Number(left) - Number(right);
      return sortDirection === "asc" ? result : -result;
    });

    return sorted;
  }, [items, query, sortKey, sortDirection]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection(key === "title" ? "asc" : "desc");
    }
  };

  const allVisibleSelected = filtered.length > 0 && filtered.every((item) => selectedIds.includes(item.id));
  const toggleSelectAll = () =>
    setSelectedIds(allVisibleSelected ? [] : filtered.map((item) => item.id));
  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const exportCsv = (rows: InventoryItem[]) => {
    const header = ["Stock", "Vehicle", "Status", "Price", "Views", "Leads", "Days listed"];
    const body = rows.map((item) =>
      [
        item.stockNumber,
        `"${item.title.replace(/"/g, '""')}"`,
        STATUS_CONFIG[item.status].label,
        item.price,
        item.views,
        item.inquiries,
        item.daysListed,
      ].join(",")
    );
    const csv = [header.join(","), ...body].join("\n");

    // Client-side download: no server round trip, nothing uploaded anywhere.
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "truewheels-inventory.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "Export ready", description: `${rows.length} rows written to CSV.`, variant: "success" });
  };

  const selectedCount = selectedIds.length;

  return (
    <section
      aria-labelledby="inventory-heading"
      className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-card overflow-hidden"
    >
      <div className="p-5 border-b border-ink-100 dark:border-ink-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 id="inventory-heading" className="text-lg font-display font-bold text-ink-900 dark:text-white">
            Inventory management
          </h2>
          <p className="text-xs text-ink-500 dark:text-ink-300 mt-0.5">
            {items.length} sample vehicles
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-full sm:w-64">
            <Input
              aria-label="Search inventory"
              placeholder="Search stock..."
              leftIcon={Search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="!h-9"
            />
          </div>
          <SmartButton
            featureKey="dealer.add_vehicle"
            size="sm"
            onClick={() =>
              toast({
                title: "Not wired up",
                description: "Adding a vehicle needs the listings service, which this build does not include.",
                variant: "info",
              })
            }
          >
            Add vehicle
          </SmartButton>
        </div>
      </div>

      {selectedCount > 0 && (
        <div className="px-5 py-3 bg-brand/5 border-b border-brand/20 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold text-brand" role="status">
            {selectedCount} selected
          </span>
          <div className="flex gap-2">
            <SmartButton
              featureKey="dealer.bulk_pause"
              variant="secondary"
              size="sm"
              onClick={() => setStatus(selectedIds, "paused")}
            >
              Pause
            </SmartButton>
            <SmartButton
              featureKey="dealer.bulk_export"
              variant="secondary"
              size="sm"
              onClick={() => exportCsv(items.filter((item) => selectedIds.includes(item.id)))}
            >
              <Icon icon={Download} size={13} className="mr-1.5" />
              Export
            </SmartButton>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        {/* `relative` makes the table the containing block for the absolutely
            positioned sr-only labels below. Without it they resolve against the
            page, escape the horizontal scroll clip, and widen the document. */}
        <table className="relative w-full text-left">
          <caption className="sr-only">
            Sample dealership inventory. Use the column headers to sort, and the row menu to change a
            listing&apos;s status.
          </caption>
          <thead>
            <tr className="bg-ink-50 dark:bg-ink-950 border-b border-ink-100 dark:border-ink-800">
              <th scope="col" className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  aria-label="Select all vehicles"
                  checked={allVisibleSelected}
                  onChange={toggleSelectAll}
                  className="rounded border-ink-300 text-brand focus:ring-brand"
                />
              </th>
              <th scope="col" className="px-4 py-3 text-[10px] font-bold text-ink-400 uppercase tracking-wider">
                Status
              </th>
              {COLUMNS.map((column) => {
                const isSorted = sortKey === column.key;
                const SortIcon = isSorted ? (sortDirection === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={isSorted ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                    className={clsx(
                      "px-4 py-3 text-[10px] font-bold uppercase tracking-wider",
                      column.align === "right" && "text-right",
                      column.align === "center" && "text-center",
                      isSorted ? "text-ink-600 dark:text-ink-200" : "text-ink-400"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(column.key)}
                      className={clsx(
                        "inline-flex items-center gap-1 rounded transition-colors hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand",
                        column.align === "right" && "flex-row-reverse"
                      )}
                    >
                      {column.label}
                      <Icon icon={SortIcon} size={11} />
                    </button>
                  </th>
                );
              })}
              <th scope="col" className="px-4 py-3 w-10">
                <span className="sr-only">Row actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-ink-500 dark:text-ink-400">
                  No vehicles match &ldquo;{query}&rdquo;.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const statusConfig = STATUS_CONFIG[item.status];
                const isSelected = selectedIds.includes(item.id);
                const photo = photoForVehicle(item);

                return (
                  <tr
                    key={item.id}
                    className={clsx(
                      "transition-colors hover:bg-ink-50/50 dark:hover:bg-ink-950/50",
                      isSelected && "bg-brand/[0.03]"
                    )}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        aria-label={`Select ${item.title}`}
                        checked={isSelected}
                        onChange={() => toggleSelect(item.id)}
                        className="rounded border-ink-300 text-brand focus:ring-brand"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={statusConfig.tone} dot={item.status === "active"}>
                        {statusConfig.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 rounded-lg overflow-hidden bg-ink-100 dark:bg-ink-800 flex-shrink-0">
                          {photo ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={photo.url}
                              alt={`${item.title}, shown as a ${photo.subject}`}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-ink-400">
                              No photo
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-ink-900 dark:text-white truncate max-w-[220px]">
                            {item.title}
                          </p>
                          <p className="text-[10px] font-mono text-ink-400">Stock: {item.stockNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-mono font-bold text-ink-900 dark:text-white tabular-nums">
                        {formatZAR(item.price)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs text-ink-600 dark:text-ink-300 tabular-nums">
                        <Icon icon={Eye} size={12} className="text-ink-400" />
                        {item.views.toLocaleString("en-ZA")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs text-ink-600 dark:text-ink-300 tabular-nums">
                        <Icon icon={MessageSquare} size={12} className="text-ink-400" />
                        {item.inquiries}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-ink-500 dark:text-ink-400 tabular-nums">
                      {item.daysListed}d
                    </td>
                    <td className="px-4 py-3">
                      <Dropdown
                        label={`Actions for ${item.title}`}
                        trigger={
                          // Dropdown renders the button itself; the trigger must
                          // not be one too, or the markup nests buttons.
                          <span className="p-1.5 min-h-[32px] min-w-[32px] inline-flex items-center justify-center text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg transition-colors">
                            <Icon icon={MoreHorizontal} size={16} />
                          </span>
                        }
                      >
                        <DropdownItem
                          onClick={() =>
                            toast({
                              title: "Edit listing",
                              description: "Listing editing is not part of this build.",
                              variant: "info",
                            })
                          }
                        >
                          <Icon icon={Edit3} size={14} /> Edit listing
                        </DropdownItem>
                        {item.status === "active" ? (
                          <DropdownItem onClick={() => setStatus([item.id], "paused")}>
                            <Icon icon={Pause} size={14} /> Pause listing
                          </DropdownItem>
                        ) : (
                          item.status !== "sold" && (
                            <DropdownItem onClick={() => setStatus([item.id], "active")}>
                              <Icon icon={Play} size={14} /> Make live
                            </DropdownItem>
                          )
                        )}
                        {item.status !== "sold" && (
                          <DropdownItem onClick={() => setStatus([item.id], "sold")}>
                            <Icon icon={CheckCircle2} size={14} /> Mark as sold
                          </DropdownItem>
                        )}
                        <DropdownItem
                          destructive
                          onClick={() => {
                            commit(items.filter((row) => row.id !== item.id));
                            setSelectedIds((prev) => prev.filter((id) => id !== item.id));
                          }}
                        >
                          <Icon icon={Trash2} size={14} /> Remove from stock
                        </DropdownItem>
                      </Dropdown>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <footer className="px-5 py-3 border-t border-ink-100 dark:border-ink-800 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] text-ink-400 leading-relaxed">
          Sample data. Status changes here are local to this page and are not saved to a server.
        </p>
        <p className="text-[10px] text-ink-400">
          Photographs: Wikimedia Commons contributors, CC BY-SA 4.0. Representative of the model, not
          the actual vehicle.
        </p>
      </footer>
    </section>
  );
}
