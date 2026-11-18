"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { SmartButton } from "@/components/ui/SmartButton";
import { Switch } from "@/components/ui/Toggles";
import { Reveal } from "@/components/motion/Reveal";

export function ProfileSettings() {
  return (
    <Reveal variant="up">
      <section className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6 shadow-lift">
        <h2 className="text-lg font-display font-bold text-ink-900 dark:text-white mb-6">Public profile</h2>

        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <div className="relative w-24 h-24 mx-auto sm:mx-0 flex-shrink-0">
            <div className="w-full h-full rounded-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-2xl font-bold text-ink-400">
              JD
            </div>
            <button
              type="button"
              aria-label="Change profile photo"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center shadow-lg hover:bg-brand-600 transition-colors"
            >
              <Icon icon={Camera} size={14} />
            </button>
          </div>

          <div className="flex-1 space-y-4">
            <Input label="Display name" defaultValue="John Doe" autoComplete="name" />
            <Input label="Username" defaultValue="@johndoe" hint="truewheels.co.za/johndoe" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="settings-bio"
              className="text-xs font-semibold text-ink-600 dark:text-ink-300 uppercase tracking-wide block mb-1.5"
            >
              Bio
            </label>
            <textarea
              id="settings-bio"
              className="w-full h-24 p-3 rounded-xl bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 text-sm text-ink-900 dark:text-white focus:outline-none focus:border-brand transition-colors resize-none"
              placeholder="Tell the community about your automotive interests"
              defaultValue="BMW enthusiast. Track day regular. Cape Town based."
            />
          </div>
          <Input label="Location" defaultValue="Cape Town, South Africa" autoComplete="address-level2" />
        </div>

        <div className="flex justify-end mt-6 pt-6 border-t border-ink-100 dark:border-ink-800">
          <SmartButton featureKey="settings.save_profile">Save changes</SmartButton>
        </div>
      </section>
    </Reveal>
  );
}

/**
 * The device list used to read "Chrome on macOS · Cape Town, ZA · Active now" and
 * "Safari on iPhone 15 · Cape Town, ZA · 2 hours ago". Nothing records a device, a
 * location or a sign-in time: there is no session table, and the only session this
 * project can issue is the demo cookie on this browser. A device the reader does not
 * recognise is exactly the signal that prompts a password change, so inventing one
 * manufactures alarm. The list now names only the browser in front of them.
 */
const NO_SESSION_TRACKING =
  "TrueWheels does not track sessions, so it cannot list the devices signed in to this account. If you have signed in elsewhere and want to end those sessions, do it in the account settings of the service you signed in with.";

export function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <Reveal variant="up" delay={100}>
      <section className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6 shadow-lift">
        <h2 className="text-lg font-display font-bold text-ink-900 dark:text-white mb-6">Security &amp; sessions</h2>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-ink-900 dark:text-white">Change password</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Current password" type="password" autoComplete="current-password" />
              <Input label="New password" type="password" autoComplete="new-password" />
              <Input label="Confirm new password" type="password" autoComplete="new-password" />
            </div>
            <div className="flex justify-end">
              <SmartButton featureKey="settings.update_password" variant="secondary">
                Update password
              </SmartButton>
            </div>
          </div>

          <div className="h-px bg-ink-100 dark:bg-ink-800" />

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-ink-900 dark:text-white">Two-factor authentication</h3>
              </div>
              <p className="text-xs text-ink-500">
                {twoFactor
                  ? "Recorded as on, in this browser only. No authenticator is enrolled, because there is no authentication service to enrol one with."
                  : "There is no authentication service here, so no second factor can be enrolled. The switch records a preference on this device and nothing more."}
              </p>
            </div>
            <Switch
              label={<span className="sr-only">Two-factor authentication</span>}
              checked={twoFactor}
              onChange={setTwoFactor}
            />
          </div>

          <div className="h-px bg-ink-100 dark:bg-ink-800" />

          <div>
            <h3 className="text-sm font-semibold text-ink-900 dark:text-white mb-4">Active sessions</h3>
            <p className="text-xs text-ink-500 leading-relaxed">{NO_SESSION_TRACKING}</p>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
