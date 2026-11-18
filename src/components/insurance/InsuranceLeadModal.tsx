"use client";

import { ShieldCheck, FileText, Info, Phone, Mail, AlertTriangle } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { INSURANCE_OBLIGATIONS } from "@/lib/insurance";

interface InsuranceLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleTitle: string;
}

/**
 * How to get an actual insurance quote.
 *
 * The brief for this modal asked for a form collecting an ID number (rendered
 * with type="password", which hides it from the person typing it while still
 * posting it), a mobile number, a licence code and how many years the licence
 * had been held, behind a POPIA consent checkbox. On submit it claimed the
 * request had been sent and that the named insurer would email a formal quote
 * within two hours, and described the page as "Lead securely transmitted via
 * TrueWheels API".
 *
 * Nothing is transmitted anywhere. There is no endpoint, no insurer on the other
 * side, and no integration of any kind, so every part of that submit path was
 * untrue. Worse, it asked for an identity number and a mobile number in order to
 * feed a request that could never be sent. An ID number is the highest-value
 * personal data in South Africa; collecting it for an application that does not
 * exist is indefensible, and a consent checkbox does not fix a request that goes
 * nowhere.
 *
 * The modal therefore collects nothing. It explains how a real quote is
 * obtained, what to have ready, and what the law entitles you to. There is no
 * form, no consent checkbox, and no success message, because there is nothing to
 * submit.
 *
 * If a real insurer integration is ever added, this is the point at which to
 * reintroduce fields, and at that point they should be the minimum the insurer
 * actually requires, sent to that insurer, with a record of the consent given.
 */
export function InsuranceLeadModal({
  isOpen,
  onClose,
  vehicleTitle,
}: InsuranceLeadModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Getting a real insurance quote"
      description={`How to request cover for the ${vehicleTitle}.`}
      maxWidth="md"
      footer={
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
          <span className="text-[10px] text-ink-400 flex items-center gap-1">
            <Icon icon={ShieldCheck} size={10} />
            No details collected on this page
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
        <div className="p-4 rounded-xl bg-aurora-blue/5 border border-aurora-blue/20 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-aurora-blue/10 flex items-center justify-center text-aurora-blue flex-shrink-0">
            <Icon icon={Info} size={16} />
          </div>
          <div>
            <p className="text-xs font-bold text-ink-900 dark:text-white mb-0.5">
              Nothing is collected here, and nothing is sent
            </p>
            <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
              TrueWheels is not a licensed financial services provider and has no
              agreement with any insurer, so it cannot pass your details to one.
              Filling in a form on this page would not reach anybody. To get a
              quote, go to the insurer or a registered broker directly.
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-ink-900 dark:text-white mb-2 flex items-center gap-2">
            <Icon icon={FileText} size={13} className="text-ink-500" />
            What to have ready
          </h4>
          <ul className="space-y-1.5">
            {[
              "Your identity number and driver's licence code, which the insurer needs to price the risk.",
              "The vehicle's registration number and VIN, and the make, model and year.",
              "Where the car is parked overnight, and whether it has a tracker or immobiliser.",
              "Your claims history for the last few years, and whether you want to protect a no-claims bonus.",
              "The outstanding finance settlement figure, if the car is financed.",
            ].map((item) => (
              <li
                key={item}
                className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-1 before:h-1 before:rounded-full before:bg-ink-300 dark:before:bg-ink-600"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-ink-900 dark:text-white mb-2">
            Where to go
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href="https://www.fsca.co.za/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 p-3 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800 hover:border-brand/30 transition-colors"
            >
              <Icon icon={ShieldCheck} size={14} className="text-brand mt-0.5 flex-shrink-0" />
              <span>
                <span className="block text-[11px] font-bold text-ink-900 dark:text-white">
                  FSCA
                </span>
                <span className="block text-[10px] text-ink-500 dark:text-ink-400">
                  Check that an insurer or broker is licensed
                </span>
              </span>
            </a>
            <a
              href="https://www.osti.co.za/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 p-3 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800 hover:border-brand/30 transition-colors"
            >
              <Icon icon={Phone} size={14} className="text-brand mt-0.5 flex-shrink-0" />
              <span>
                <span className="block text-[11px] font-bold text-ink-900 dark:text-white">
                  Short-Term Insurance Ombudsman
                </span>
                <span className="block text-[10px] text-ink-500 dark:text-ink-400">
                  Free help if a claim is rejected
                </span>
              </span>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-ink-900 dark:text-white mb-2 flex items-center gap-2">
            <Icon icon={AlertTriangle} size={13} className="text-semantic-warning" />
            If the car is financed
          </h4>
          <ul className="space-y-1.5">
            {INSURANCE_OBLIGATIONS.map((line) => (
              <li
                key={line}
                className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-1 before:h-1 before:rounded-full before:bg-ink-300 dark:before:bg-ink-600"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
          <p className="text-[10px] text-ink-500 dark:text-ink-400 leading-relaxed">
            <span className="font-bold text-ink-600 dark:text-ink-300">
              About your information.
            </span>{" "}
            Because this page collects nothing, there is no consent to give and
            nothing to revoke. If you deal with an insurer directly, they must tell
            you what they do with your information under the Protection of Personal
            Information Act, and you may ask them for it and ask them to delete it.
            Any complaint about that can be taken to the Information Regulator.
          </p>
        </div>
      </div>
    </Modal>
  );
}
