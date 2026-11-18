"use client";

import { useState } from "react";
import { ReviewsSummary } from "./ReviewsSummary";
import { WriteReviewModal } from "./WriteReviewModal";
import type { SellerIdentity } from "@/lib/seller";
import type { DemoVehicle } from "@/lib/demo/vehicles";

/**
 * Holds the review modal's open state.
 *
 * Kept as a small client wrapper so the reviews section can stay a server-safe
 * component and the modal is only mounted when it is opened.
 */
export function ReviewsSection({
  vehicle,
  seller,
}: {
  vehicle: DemoVehicle;
  seller: SellerIdentity;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ReviewsSummary
        vehicle={vehicle}
        seller={seller}
        onWriteReview={() => setIsModalOpen(true)}
      />
      <WriteReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicleTitle={vehicle.title}
      />
    </>
  );
}
