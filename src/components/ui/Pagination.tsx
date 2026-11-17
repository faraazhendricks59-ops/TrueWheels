"use client";

import { clsx } from "clsx";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Icon } from "./Icon";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Builds the page sequence. An ellipsis only appears when it hides two or more
 * pages; a gap of exactly one page is filled with that page number instead, so
 * the control never renders `1 ... 3 4 5 ... 9` where the ellipsis replaces a
 * single button and adds nothing.
 */
export function getPageItems(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const delta = 1;
  const keep = new Set<number>([1, totalPages]);
  for (let i = currentPage - delta; i <= currentPage + delta; i++) {
    if (i >= 1 && i <= totalPages) keep.add(i);
  }
  const sorted = Array.from(keep).sort((a, b) => a - b);

  const items: (number | "...")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    items.push(sorted[i]);
    const next = sorted[i + 1];
    if (next === undefined) break;
    const missing = next - sorted[i] - 1;
    if (missing === 1) items.push(sorted[i] + 1);
    else if (missing >= 2) items.push("...");
  }
  return items;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageItems(currentPage, totalPages);
  const navButton =
    "h-10 w-10 flex items-center justify-center rounded-xl border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:focus:ring-offset-ink-950";

  return (
    <nav aria-label="Pagination" className={clsx("flex items-center justify-center gap-2", className)}>
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={navButton}
      >
        <Icon icon={ChevronLeft} size={16} />
      </button>

      {pages.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="h-10 w-10 flex items-center justify-center text-ink-400"
          >
            <Icon icon={MoreHorizontal} size={16} />
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
            className={clsx(
              "h-10 w-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:focus:ring-offset-ink-950",
              currentPage === page
                ? "bg-brand text-white shadow-glow"
                : "border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={navButton}
      >
        <Icon icon={ChevronRight} size={16} />
      </button>
    </nav>
  );
}
