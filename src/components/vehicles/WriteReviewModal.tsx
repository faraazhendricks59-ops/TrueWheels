"use client";

import { ShieldQuestion, Info, AlertTriangle } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { REVIEW_REQUIREMENTS } from "@/lib/seller";

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleTitle: string;
}

/**
 * Why a review cannot be left, and what it would take.
 *
 * The brief for this modal showed a "Verified Transaction" banner asserting
 * that the vehicle "was transacted through TrueWheels Secure Pay", then a star
 * picker and a comment box whose submit handler claimed the review had been
 * published and that it was "verified against transaction ID #TXN-99281".
 *
 * There is no transaction, no payment system, and no review store. The
 * transaction ID was invented, the verification never happened, and pressing
 * publish would have told the reviewer their words were live when nothing had
 * been saved anywhere. The form has therefore been removed rather than disabled:
 * a star picker that cannot submit is worse than no star picker, because the
 * effort of writing a review is spent before the person learns it went nowhere.
 *
 * What remains is the explanation: the conditions a review would have to meet
 * to be worth reading, which is the substance of the anti-fraud gate the brief
 * was reaching for. That gate is a real requirement of a review system, and it
 * is stated here as a requirement rather than claimed to be in place.
 */
export function WriteReviewModal({
  isOpen,
  onClose,
  vehicleTitle,
}: WriteReviewModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reviews are not open yet"
      description={`Why you cannot review the ${vehicleTitle}, and what would change that.`}
      maxWidth="md"
      footer={
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
          <span className="text-[10px] text-ink-400 flex items-center gap-1">
            <Icon icon={Info} size={10} />
            Nothing is collected here
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="p-4 rounded-xl bg-semantic-warning/5 border border-semantic-warning/20 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-semantic-warning/10 flex items-center justify-center text-semantic-warning flex-shrink-0">
            <Icon icon={AlertTriangle} size={16} />
          </div>
          <div>
            <p className="text-xs font-bold text-ink-900 dark:text-white mb-0.5">
              There is no purchase record to verify
            </p>
            <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
              No vehicle has been bought or sold through TrueWheels, and there is no
              payment system to buy one with. A review is only worth reading when
              the platform can prove the reviewer actually dealt with the seller,
              and that proof does not exist here. Accepting a review anyway would
              mean publishing an unverifiable opinion next to a seller&apos;s name.
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-ink-900 dark:text-white mb-2 flex items-center gap-2">
            <Icon icon={ShieldQuestion} size={13} className="text-ink-500" />
            What a review here would have to satisfy
          </h4>
          <ul className="space-y-1.5">
            {REVIEW_REQUIREMENTS.map((requirement) => (
              <li
                key={requirement}
                className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-1 before:h-1 before:rounded-full before:bg-ink-300 dark:before:bg-ink-600"
              >
                {requirement}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-ink-900 dark:text-white mb-2">
            Why the gate matters
          </h4>
          <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
            A seller&apos;s reputation is worth money, so it attracts abuse in both
            directions: a seller posting praise for themselves, or a competitor
            posting complaints. Tying a review to a completed sale on the platform
            is the only reliable way to stop both, and it is also what makes a
            rating meaningful. A rating that anyone can leave is not a signal, it
            is a comment box.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
          <p className="text-[10px] text-ink-500 dark:text-ink-400 leading-relaxed">
            <span className="font-bold text-ink-600 dark:text-ink-300">
              If you have a problem with a seller.
            </span>{" "}
            A dispute about a vehicle you have already bought is a consumer matter.
            The National Consumer Commission handles complaints about suppliers, and
            the Motor Industry Ombudsman of South Africa handles disputes with
            motor traders. Both are free to approach.
          </p>
        </div>
      </div>
    </Modal>
  );
}
