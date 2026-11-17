"use client";

import { useState } from "react";
import { AlertTriangle, Download, FileText, Trash2 } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { Input } from "@/components/ui/Input";
import { Reveal } from "@/components/motion/Reveal";
import { useToast } from "@/components/ui/Toast";

const DELETE_PHRASE = "DELETE";

export function PrivacySettings() {
  const { toast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  const handleExport = () => {
    toast({
      variant: "trust",
      title: "Data export requested",
      description: "We are compiling your data. A download link will be emailed within 48 hours.",
      source: "POPIA section 23 — right of access.",
    });
  };

  const handleDelete = () => {
    if (deleteText !== DELETE_PHRASE) return;
    toast({
      variant: "error",
      title: "Account deletion scheduled",
      description: "Your data will be purged within 30 days.",
    });
    setShowDeleteConfirm(false);
    setDeleteText("");
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
                Under POPIA you may request a complete copy of all personal information TrueWheels holds
                about you.
              </p>
              <SmartButton
                featureKey="settings.export_data"
                variant="secondary"
                leftIcon={FileText}
                onClick={handleExport}
              >
                Request data export
              </SmartButton>
            </div>
          </div>

          <div className="p-5 bg-semantic-error/5 border border-semantic-error/20 rounded-xl">
            <div className="flex items-start gap-4 mb-4">
              <span className="w-10 h-10 rounded-lg bg-semantic-error/10 flex items-center justify-center flex-shrink-0 text-semantic-error">
                <Icon icon={Trash2} size={18} />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-ink-900 dark:text-white mb-1">Delete account</h3>
                <p className="text-xs text-ink-500 leading-relaxed">
                  Permanently delete your account and all associated data. This cannot be undone; your data
                  is purged within 30 days.
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
                Delete account
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
