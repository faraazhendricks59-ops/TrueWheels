"use client";

import { useState } from "react";
import { AlertTriangle, Download, FileText, Trash2 } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { Input } from "@/components/ui/Input";
import { Reveal } from "@/components/motion/Reveal";
import { useToast } from "@/components/ui/Toast";

const DELETE_PHRASE = "DELETE";
const STORAGE_PREFIX = "truewheels";

/**
 * Privacy controls.
 *
 * The brief's version answered "Request data export" with a `variant: "trust"` toast
 * — a shield beside "Verified Action" — reading "We are compiling your data. A
 * download link will be emailed within 48 hours", citing POPIA section 23. Nothing
 * compiles anything and no email is sent, because there is no server, no account and
 * no address on file. It made the same kind of promise for deletion: "Account
 * deletion scheduled… purged within 30 days", when there is no account and no store
 * on any server to purge.
 *
 * Both controls now do what they say, on the only store this project has — this
 * browser. Export writes a real JSON file of everything under the `truewheels` keys,
 * which is genuinely all the data held about the reader. Delete removes exactly those
 * keys and says so. Neither claims a server-side action, because there is no server.
 */
export function PrivacySettings() {
  const { toast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  const readStoredData = (): Record<string, unknown> => {
    const data: Record<string, unknown> = {};
    try {
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i);
        if (!key || !key.startsWith(STORAGE_PREFIX)) continue;
        const raw = window.localStorage.getItem(key);
        if (raw === null) continue;
        try {
          data[key] = JSON.parse(raw);
        } catch {
          data[key] = raw;
        }
      }
    } catch {
      // Storage unavailable; the caller handles the empty result.
    }
    return data;
  };

  const handleExport = () => {
    const data = readStoredData();
    if (Object.keys(data).length === 0) {
      toast({
        variant: "info",
        title: "Nothing stored yet",
        description: "There is no data in this browser to export. Save a listing, add a vehicle or create an event first.",
      });
      return;
    }

    const payload = {
      exportedAt: new Date().toISOString(),
      scope:
        "Everything TrueWheels stores about you is in this browser. This file is the whole of it. Nothing is held on a server, so there is no other copy to request.",
      data,
    };

    try {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "truewheels-data-export.json";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      setTimeout(() => URL.revokeObjectURL(url), 0);
      toast({
        variant: "success",
        title: "Export downloaded",
        description: `Saved "truewheels-data-export.json" (${Object.keys(data).length} stores) to your downloads.`,
      });
    } catch {
      toast({
        variant: "error",
        title: "Could not create the file",
        description: "This browser blocked the download. Try again, or check your download settings.",
      });
    }
  };

  const handleDelete = () => {
    if (deleteText !== DELETE_PHRASE) return;

    let removed = 0;
    try {
      const keys: string[] = [];
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) keys.push(key);
      }
      keys.forEach((key) => {
        window.localStorage.removeItem(key);
        removed += 1;
      });
    } catch {
      // Storage refused; the toast below reports what actually happened.
    }

    setShowDeleteConfirm(false);
    setDeleteText("");

    toast({
      variant: "success",
      title: removed > 0 ? `Cleared ${removed} stored items` : "Nothing was stored",
      description:
        "Everything TrueWheels had in this browser has been removed. There is no account on a server, so nothing else needed deleting.",
    });

    // Reload so every provider re-reads the now-empty stores.
    window.setTimeout(() => window.location.assign("/"), 1200);
  };

  return (
    <Reveal variant="up" delay={200}>
      <section className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6 shadow-lift">
        <h2 className="text-lg font-display font-bold text-ink-900 dark:text-white mb-6">
          Privacy &amp; POPIA controls
        </h2>

        <div className="space-y-8">
          <div className="p-5 bg-aurora-blue/5 border border-aurora-blue/20 rounded-xl flex items-start gap-4">
            <span className="w-10 h-10 rounded-lg bg-aurora-blue/10 flex items-center justify-center flex-shrink-0 text-aurora-blue">
              <Icon icon={Download} size={18} />
            </span>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-ink-900 dark:text-white mb-1">Export my data</h3>
              <p className="text-xs text-ink-500 mb-3 leading-relaxed">
                Downloads a copy of everything TrueWheels holds about you. That is everything in this
                browser — your saved listings, garage, events and preferences — because TrueWheels keeps
                your data here and nowhere else.
              </p>
              <SmartButton
                featureKey="settings.export_data"
                variant="secondary"
                leftIcon={FileText}
                onClick={handleExport}
              >
                Download my data
              </SmartButton>
            </div>
          </div>

          <div className="p-5 bg-semantic-error/5 border border-semantic-error/20 rounded-xl">
            <div className="flex items-start gap-4 mb-4">
              <span className="w-10 h-10 rounded-lg bg-semantic-error/10 flex items-center justify-center flex-shrink-0 text-semantic-error">
                <Icon icon={Trash2} size={18} />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-ink-900 dark:text-white mb-1">Delete my data</h3>
                <p className="text-xs text-ink-500 leading-relaxed">
                  Erases everything TrueWheels has stored in this browser and returns the site to its
                  starting state. This cannot be undone. There is no account on a server, so nothing is
                  deleted anywhere else — the data was only ever here.
                </p>
              </div>
            </div>

            {!showDeleteConfirm ? (
              <SmartButton
                featureKey="settings.delete_account"
                variant="danger"
                leftIcon={Trash2}
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete my data
              </SmartButton>
            ) : (
              <div className="space-y-3 pt-4 border-t border-semantic-error/20">
                <div className="flex items-start gap-2 p-3 bg-semantic-error/10 rounded-lg">
                  <Icon icon={AlertTriangle} size={16} className="text-semantic-error mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-semantic-error font-medium">
                    To confirm, type <span className="font-mono font-bold">DELETE</span> in the box below.
                  </p>
                </div>
                <Input
                  label="Confirmation"
                  value={deleteText}
                  onChange={(event) => setDeleteText(event.target.value)}
                  placeholder="Type DELETE to confirm"
                  containerClassName="[&_input]:font-mono"
                  autoComplete="off"
                />
                <div className="flex flex-wrap gap-3">
                  <SmartButton
                    featureKey="settings.cancel_delete"
                    variant="ghost"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteText("");
                    }}
                  >
                    Cancel
                  </SmartButton>
                  <SmartButton
                    featureKey="settings.confirm_delete"
                    variant="danger"
                    onClick={handleDelete}
                    disabled={deleteText !== DELETE_PHRASE}
                  >
                    Permanently delete
                  </SmartButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
