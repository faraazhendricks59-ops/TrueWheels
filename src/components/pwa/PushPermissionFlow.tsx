"use client";

import { Bell, BellOff, Info, ShieldCheck } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { SmartButton } from "@/components/ui/SmartButton";

/**
 * Push notifications: the honest version, which is an explanation, not a request.
 *
 * The brief wanted a value-driven permission flow that called
 * `Notification.requestPermission()` after explaining the benefits. The trouble is that
 * there is nothing behind the permission. TrueWheels has no push service — no
 * subscription is stored, no server can send a message, and the notification system in
 * this project is in-app and explicitly marked simulated (see `src/lib/notifications.ts`,
 * where the realtime channel is labelled "(simulated)"). The app also says as much in
 * Settings, where it notes that no mail or SMS service is connected.
 *
 * Asking for the notification permission anyway would do real harm:
 *  - The browser prompt is a one-shot, per-origin decision. A reader who grants it here
 *    has spent it, and gets no notifications, because nothing can send any. If a push
 *    service is built later, the prompt is already answered and cannot be re-asked.
 *  - The benefits offered — price-drop alerts, outbid notices — would never arrive, so
 *    the consent would have been obtained on a false promise. Consent given for
 *    something that does not happen is not consent.
 *
 * So this panel requests nothing. It explains what notifications do today, and what
 * would have to be built before a permission prompt is worth showing. The prompt itself
 * is the browser's to show at the moment the app can actually honour it.
 */
export function PushPermissionFlow({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications"
      description="What TrueWheels can tell you today, and what it cannot."
      maxWidth="md"
      footer={
        <SmartButton featureKey="pwa.push_info" variant="ghost" onClick={onClose}>
          Close
        </SmartButton>
      }
    >
      <div className="space-y-5">
        <div className="p-4 bg-aurora-blue/5 border border-aurora-blue/20 rounded-xl flex items-start gap-3">
          <Icon icon={Info} size={16} className="text-aurora-blue mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-ink-900 dark:text-white mb-1">
              No permission is being requested here
            </p>
            <p className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed">
              This app has no push service, so a notification could not reach you even if
              you allowed it. Asking for the permission now would use up the one prompt
              your browser allows per site, and you would still receive nothing. The prompt
              is deliberately not shown until there is something to send.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
            <div className="flex items-center gap-2 mb-1.5">
              <Icon icon={Bell} size={13} className="text-brand" />
              <p className="text-xs font-bold text-ink-900 dark:text-white">What works now</p>
            </div>
            <p className="text-[10px] text-ink-500 dark:text-ink-300 leading-relaxed">
              In-app notifications appear in the bell menu while you are using TrueWheels.
              Your category and quiet-hours preferences in Settings control them, and they
              are saved on this device.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
            <div className="flex items-center gap-2 mb-1.5">
              <Icon icon={BellOff} size={13} className="text-ink-400" />
              <p className="text-xs font-bold text-ink-900 dark:text-white">What does not</p>
            </div>
            <p className="text-[10px] text-ink-500 dark:text-ink-300 leading-relaxed">
              Nothing reaches you when the app is closed. There are no price-drop, outbid or
              message alerts on your device, and no email or SMS either — no delivery
              service is connected to this build.
            </p>
          </div>
        </div>

        <div className="p-4 bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Icon icon={ShieldCheck} size={13} className="text-semantic-success" />
            <p className="text-xs font-bold text-ink-900 dark:text-white">
              What would have to exist first
            </p>
          </div>
          <ul className="space-y-1.5 text-[10px] text-ink-500 dark:text-ink-300 leading-relaxed">
            <li>• A push service that stores a subscription for your device</li>
            <li>• A server that sends a message when a price drops or a bid changes</li>
            <li>• A record of what you agreed to, and a way to withdraw it</li>
          </ul>
          <p className="text-[10px] text-ink-400 leading-relaxed mt-2">
            Until those exist, the browser prompt is not shown, because it could not be
            honoured. This is a POPIA-relevant promise, so it is one worth keeping.
          </p>
        </div>
      </div>
    </Modal>
  );
}
