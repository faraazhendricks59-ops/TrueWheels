"use client";

import { useState } from "react";
import { MoreVertical, SlidersHorizontal, Sparkles, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Sheet } from "@/components/ui/Sheet";
import { Tooltip, Dropdown, DropdownItem, Popover } from "@/components/ui/Floating";
import { SmartButton } from "@/components/ui/SmartButton";
import { useToast } from "@/components/ui/Toast";
import { DeleteListingAction } from "@/components/listings/DeleteListingAction";

export function OverlayShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { toast } = useToast();

  return (
    <section className="w-full max-w-2xl p-8 bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-lift">
      <h2 className="text-2xl font-display font-bold text-ink-900 dark:text-white mb-6">
        Overlays
      </h2>

      <div className="flex flex-wrap items-center gap-3">
        <SmartButton featureKey="listings.publish" onClick={() => setModalOpen(true)}>
          Open Modal
        </SmartButton>
        <SmartButton featureKey="listings.publish" variant="outline" onClick={() => setSheetOpen(true)}>
          Open Sheet
        </SmartButton>
        <SmartButton
          featureKey="listings.publish"
          variant="secondary"
          onClick={() => toast({ variant: "success", title: "Saved", description: "Your changes were stored." })}
        >
          Success Toast
        </SmartButton>
        <SmartButton
          featureKey="listings.publish"
          variant="ghost"
          onClick={() => toast({ variant: "error", title: "Upload failed", description: "The image exceeded 5 MB." })}
        >
          Error Toast
        </SmartButton>

        <Tooltip content="Filters apply to the current search">
          <button
            type="button"
            aria-label="Search filters"
            className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-ink-200 dark:border-ink-700 text-ink-500 focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <SlidersHorizontal size={16} strokeWidth={1.75} />
          </button>
        </Tooltip>

        <Dropdown
          label="Listing actions"
          trigger={
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-ink-200 dark:border-ink-700 text-ink-500">
              <MoreVertical size={16} strokeWidth={1.75} />
            </span>
          }
        >
          <DropdownItem>Edit listing</DropdownItem>
          <DropdownItem>Duplicate</DropdownItem>
          <DropdownItem destructive>Archive</DropdownItem>
        </Dropdown>

        <Popover
          label="Auction insights"
          trigger={
            <span className="inline-flex items-center gap-2 h-10 px-3 rounded-xl border border-ink-200 dark:border-ink-700 text-ink-500 text-sm">
              <Sparkles size={16} strokeWidth={1.75} /> Insights
            </span>
          }
        >
          <p className="text-sm font-semibold text-ink-900 dark:text-white mb-1">Auction insights</p>
          <p className="text-xs text-ink-500 dark:text-ink-300">
            Watchers are up 18% week-on-week. Consider a 48-hour flash auction.
          </p>
        </Popover>

        <DeleteListingAction listingId="TW-88214" />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Reserve this vehicle?"
        description="A refundable deposit holds the car for 48 hours."
        footer={
          <>
            <SmartButton featureKey="listings.cancel" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </SmartButton>
            <SmartButton
              featureKey="listings.publish"
              onClick={() => {
                setModalOpen(false);
                toast({ variant: "success", title: "Vehicle reserved", description: "The seller has been notified." });
              }}
            >
              Confirm
            </SmartButton>
          </>
        }
      >
        <p className="text-sm text-ink-600 dark:text-ink-300">
          You will be charged R 2,500 today. The balance is settled at collection or delivery.
        </p>
      </Modal>

      <Sheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Filters"
        description="Refine the marketplace results"
        footer={
          <SmartButton featureKey="listings.publish" onClick={() => setSheetOpen(false)}>
            Apply filters
          </SmartButton>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-ink-600 dark:text-ink-300">
            Sheet content: price range, mileage, province, and body type controls live here.
          </p>
          <div className="flex items-center gap-2 text-xs text-ink-400">
            <Trash2 size={12} strokeWidth={1.75} /> Reset all filters
          </div>
        </div>
      </Sheet>
    </section>
  );
}
