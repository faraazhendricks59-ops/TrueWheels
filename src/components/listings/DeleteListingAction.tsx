"use client";

import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { SmartButton } from "@/components/ui/SmartButton";
import { useToast } from "@/components/ui/Toast";
import { Icon } from "@/components/ui/Icon";

export function DeleteListingAction({ listingId }: { listingId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    // Stand-in for the real API call until the data layer lands.
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsDeleting(false);
    setIsOpen(false);

    toast({
      variant: "trust",
      title: "Listing Removed",
      description: "The vehicle has been permanently removed from the marketplace.",
      source: "Action verified by TrueWheels Audit Log. ID: " + listingId,
    });
  };

  return (
    <>
      <SmartButton
        featureKey="listings.delete"
        variant="danger"
        size="sm"
        onClick={() => setIsOpen(true)}
        leftIcon={Trash2}
      >
        Delete
      </SmartButton>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Listing?"
        description="This action cannot be undone. The vehicle will be permanently removed from TrueWheels."
        maxWidth="sm"
        footer={
          <>
            <SmartButton featureKey="listings.cancel" variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </SmartButton>
            <SmartButton
              featureKey="listings.delete"
              variant="danger"
              isLoading={isDeleting}
              onClick={handleDelete}
            >
              Yes, Delete Permanently
            </SmartButton>
          </>
        }
      >
        <div className="flex items-start gap-4 p-4 bg-semantic-error/5 border border-semantic-error/20 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-semantic-error/10 flex items-center justify-center flex-shrink-0">
            <Icon icon={AlertTriangle} className="text-semantic-error" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-900 dark:text-white">Warning</p>
            <p className="text-xs text-ink-500 dark:text-ink-300 mt-1">
              Any active bids, saved searches, or user favorites linked to this listing will be broken.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
