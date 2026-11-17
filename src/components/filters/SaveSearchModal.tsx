"use client";

import { useEffect, useState } from "react";
import { Bell, Mail, Smartphone } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Toggles";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { addSavedSearch, describeFilters } from "@/lib/saved-searches";

export interface SaveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Query string of the current filters, stored so the search can be reopened. */
  queryString: string;
}

export function SaveSearchModal({ isOpen, onClose, queryString }: SaveSearchModalProps) {
  const { toast } = useToast();
  const suggested = describeFilters(queryString);
  const [name, setName] = useState(suggested);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);

  // Re-seed the name whenever the modal opens, so it reflects what is on screen
  // now rather than whatever was typed the last time it was opened.
  useEffect(() => {
    if (isOpen) setName(describeFilters(queryString));
  }, [isOpen, queryString]);

  const handleSave = () => {
    const trimmed = name.trim() || suggested;
    const saved = addSavedSearch({
      name: trimmed,
      query: queryString,
      emailAlerts,
      pushAlerts,
    });

    toast({
      variant: "trust",
      title: "Search saved",
      description: `We will alert you when new "${trimmed}" listings match your criteria.`,
      source: saved
        ? "Saved to this device. Alerts run once an account is linked."
        : "Alerts run once an account is linked.",
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Save this search"
      description="Get notified when new vehicles match your exact criteria."
      footer={
        <>
          <SmartButton featureKey="filters.cancel_save" variant="ghost" onClick={onClose}>
            Cancel
          </SmartButton>
          <SmartButton featureKey="filters.confirm_save" onClick={handleSave}>
            <Icon icon={Bell} size={14} /> Save and activate alerts
          </SmartButton>
        </>
      }
    >
      <div className="space-y-6">
        <Input
          label="Search name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          hint="Give your search a memorable name."
        />

        <div className="p-4 bg-ink-50 dark:bg-ink-950 rounded-xl border border-ink-100 dark:border-ink-800 space-y-4">
          <p className="text-xs font-bold text-ink-400 uppercase tracking-wide">Alert preferences</p>

          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-white dark:bg-ink-900 flex items-center justify-center text-ink-500 border border-ink-100 dark:border-ink-800">
                <Icon icon={Mail} size={14} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink-900 dark:text-white">Email alerts</span>
                <span className="block text-xs text-ink-500">Daily or instant digest</span>
              </span>
            </span>
            <Switch label={<span className="sr-only">Email alerts</span>} checked={emailAlerts} onChange={setEmailAlerts} />
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-white dark:bg-ink-900 flex items-center justify-center text-ink-500 border border-ink-100 dark:border-ink-800">
                <Icon icon={Smartphone} size={14} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink-900 dark:text-white">Push notifications</span>
                <span className="block text-xs text-ink-500">Instant mobile alerts</span>
              </span>
            </span>
            <Switch label={<span className="sr-only">Push notifications</span>} checked={pushAlerts} onChange={setPushAlerts} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
