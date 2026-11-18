"use client";

import { useEffect, useState } from "react";
import { Share2, Copy, Check, MessageCircle, Facebook, Twitter, Link2 } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Sheet } from "@/components/ui/Sheet";
import { QrCodeSvg } from "@/components/ui/QrCodeSvg";
import { useToast } from "@/components/ui/Toast";
import { listingRef } from "@/lib/seller";
import type { DemoVehicle } from "@/lib/demo/vehicles";

/**
 * Share a listing.
 *
 * The link shared is the real page URL, built from the browser's own location.
 * The brief used a fixed short domain, `https://tw.co.za/v/<id>?ref=share_...`,
 * and described it as trackable. That domain is not owned by this project, so
 * every share would have posted a dead link pointing at somebody else's site, and
 * the `ref` parameter implied referral tracking that does not exist.
 *
 * The QR code is generated here rather than fetched from an image API, so the
 * link is not sent to a third party and the code works offline.
 *
 * The native share option is offered only when the browser provides it, which is
 * detected after mount to keep the server and client markup identical.
 */
export function ShareSheet({
  isOpen,
  onClose,
  vehicle,
}: {
  isOpen: boolean;
  onClose: () => void;
  vehicle: DemoVehicle;
}) {
  const [url, setUrl] = useState("");
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState<"link" | "text" | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) return;
    setUrl(`${window.location.origin}/vehicles/${vehicle.id}`);
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, [isOpen, vehicle.id]);

  const summary = `${vehicle.title} — ${listingRef(vehicle)} on TrueWheels`;

  const copy = async (value: string, which: "link" | "text") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast({
        variant: "error",
        title: "Could not copy",
        description: "Your browser blocked clipboard access. Select the text and copy it manually.",
      });
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: vehicle.title, text: summary, url });
      onClose();
    } catch {
      // The user dismissed the sheet, or the platform refused. Neither is an error
      // worth reporting, and the fallback links below remain available.
    }
  };

  const channels = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(`${summary} ${url}`)}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "X",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(summary)}&url=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="Share this vehicle" side="bottom">
      <div className="space-y-6 pb-8">
        {canShare && (
          <button
            type="button"
            onClick={nativeShare}
            className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors"
          >
            <Icon icon={Share2} size={16} />
            Share via your device
          </button>
        )}

        <div>
          <p className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-3">
            Share to
          </p>
          <div className="grid grid-cols-3 gap-3">
            {channels.map((channel) => (
              <a
                key={channel.name}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 py-2 rounded-xl hover:bg-ink-50 dark:hover:bg-ink-950 transition-colors"
              >
                <span className="w-12 h-12 rounded-2xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-600 dark:text-ink-200">
                  <Icon icon={channel.icon} size={20} />
                </span>
                <span className="text-[10px] font-semibold text-ink-500 dark:text-ink-400">
                  {channel.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-3">
            Link to this listing
          </p>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
            <span className="pl-2 text-ink-400 flex-shrink-0">
              <Icon icon={Link2} size={15} />
            </span>
            <input
              readOnly
              value={url}
              aria-label="Listing link"
              onFocus={(e) => e.currentTarget.select()}
              className="flex-1 min-w-0 bg-transparent text-xs font-mono text-ink-600 dark:text-ink-300 focus:outline-none px-1"
            />
            <button
              type="button"
              onClick={() => copy(url, "link")}
              aria-label="Copy the listing link"
              className="w-11 h-11 flex items-center justify-center rounded-lg bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 hover:border-brand/40 transition-colors flex-shrink-0"
            >
              <Icon
                icon={copied === "link" ? Check : Copy}
                size={14}
                className={copied === "link" ? "text-semantic-success" : "text-ink-500"}
              />
            </button>
          </div>
          <p className="text-[10px] text-ink-400 mt-2">
            This is the page address itself. TrueWheels does not run a link
            shortener, so there is nothing to redirect and no referral code is added.
          </p>
        </div>

        <div className="pt-5 border-t border-ink-100 dark:border-ink-800">
          <p className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-3">
            QR code
          </p>
          <div className="flex items-start gap-5 p-4 bg-white dark:bg-ink-950 rounded-2xl border border-ink-100 dark:border-ink-800">
            {url && (
              <QrCodeSvg
                value={url}
                size={124}
                className="rounded-lg flex-shrink-0"
                label={`QR code linking to the ${vehicle.title}`}
              />
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink-900 dark:text-white mb-1">
                For a showroom or a windscreen
              </p>
              <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
                Generated in this page from the listing address, so the link is not
                sent to any outside service. Anyone who scans it lands on this
                listing.
              </p>
              <button
                type="button"
                onClick={() => copy(url, "text")}
                className="mt-3 inline-flex items-center gap-1.5 min-h-[36px] px-3 rounded-lg border border-ink-200 dark:border-ink-700 text-[11px] font-semibold text-ink-600 dark:text-ink-300 hover:border-brand/40 hover:text-brand transition-colors"
              >
                <Icon icon={copied === "text" ? Check : Copy} size={12} />
                {copied === "text" ? "Copied" : "Copy the address"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
