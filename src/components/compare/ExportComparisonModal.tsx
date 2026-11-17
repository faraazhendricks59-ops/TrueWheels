"use client";

import { useEffect, useState } from "react";
import { FileText, Link2, Mail } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { SmartButton } from "@/components/ui/SmartButton";
import { Input } from "@/components/ui/Input";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { useToast } from "@/components/ui/Toast";

interface ExportComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** The shareable address for the current comparison. */
  shareUrl: string;
}

const rowClass =
  "w-full flex items-center gap-4 p-4 rounded-xl border border-ink-100 dark:border-ink-800 hover:border-brand/30 hover:bg-ink-50 dark:hover:bg-ink-950 transition-all text-left group";

export function ExportComparisonModal({ isOpen, onClose, shareUrl }: ExportComparisonModalProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) setCopied(false);
  }, [isOpen]);

  const copyLink = async () => {
    const absolute = `${window.location.origin}${shareUrl}`;
    try {
      await navigator.clipboard.writeText(absolute);
      setCopied(true);
      toast({ variant: "success", title: "Link copied", description: absolute });
    } catch {
      // Clipboard access can be denied; the field below still shows the link.
      toast({
        variant: "info",
        title: "Copy unavailable",
        description: "Your browser blocked clipboard access. Select the link to copy it.",
      });
    }
  };

  // The browser's print dialog offers "Save as PDF", which produces a real
  // document without pretending a server-side generator exists.
  const printReport = () => {
    toast({
      variant: "info",
      title: "Opening print view",
      description: "Choose “Save as PDF” as the destination to keep a copy.",
    });
    window.print();
  };

  const sendEmail = () => {
    const subject = encodeURIComponent("TrueWheels vehicle comparison");
    const body = encodeURIComponent(`Compare these vehicles:\n\n${window.location.origin}${shareUrl}\n`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export comparison"
      description="Share this side-by-side breakdown or keep a copy for later."
      footer={
        <SmartButton featureKey="compare.close_export" variant="ghost" onClick={onClose}>
          Close
        </SmartButton>
      }
    >
      <div className="space-y-4">
        <FeatureGate featureKey="compare.share_link">
          <div className="space-y-2">
            <button type="button" onClick={copyLink} className={rowClass}>
              <span className="w-10 h-10 rounded-lg bg-aurora-blue/10 flex items-center justify-center text-aurora-blue group-hover:scale-110 transition-transform">
                <Icon icon={Link2} size={18} />
              </span>
              <span>
                <span className="block text-sm font-bold text-ink-900 dark:text-white">
                  {copied ? "Link copied" : "Copy share link"}
                </span>
                <span className="block text-xs text-ink-500">
                  The address already encodes this exact comparison.
                </span>
              </span>
            </button>
            <Input label="Share link" readOnly value={`${typeof window !== "undefined" ? window.location.origin : ""}${shareUrl}`} />
          </div>
        </FeatureGate>

        <FeatureGate featureKey="compare.print">
          <button type="button" onClick={printReport} className={rowClass}>
            <span className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
              <Icon icon={FileText} size={18} />
            </span>
            <span>
              <span className="block text-sm font-bold text-ink-900 dark:text-white">
                Download a PDF report
              </span>
              <span className="block text-xs text-ink-500">
                Opens your browser&rsquo;s print dialog, where you can save as PDF.
              </span>
            </span>
          </button>
        </FeatureGate>

        <FeatureGate featureKey="compare.email_export">
          <div className="pt-4 border-t border-ink-100 dark:border-ink-800">
            <p className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-3">
              Send it to yourself
            </p>
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                <Input
                  type="email"
                  label="Email address"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <SmartButton
                featureKey="compare.email_export"
                onClick={sendEmail}
                disabled={!email.includes("@")}
                className="mt-6"
                leftIcon={Mail}
              >
                Send
              </SmartButton>
            </div>
            <p className="text-[11px] text-ink-400 mt-2">
              Opens your email app with the link already written.
            </p>
          </div>
        </FeatureGate>
      </div>
    </Modal>
  );
}
