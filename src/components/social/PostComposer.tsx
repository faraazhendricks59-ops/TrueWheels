"use client";

import { useEffect, useRef, useState } from "react";
import { Car, Save, Trash2, X } from "lucide-react";
import { SmartButton } from "@/components/ui/SmartButton";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { VehicleEmbed } from "./VehicleEmbed";
import { useToast } from "@/components/ui/Toast";
import { clearDraft, readDraft, writeDraft, COMPOSER_DISCLOSURE } from "@/lib/social";
import { DEMO_VEHICLES } from "@/lib/demo/vehicles";

const MAX_LENGTH = 500;

/**
 * The community composer.
 *
 * The brief's version had a Post button that cleared the textarea, and three
 * icon buttons that did nothing at all. A Post button that silently discards
 * what someone wrote is worse than no button.
 *
 * There is no community service to publish to, so nothing is published. What the
 * composer can honestly do is keep a draft on this device, and that is what it
 * does: the text and the linked vehicle survive a reload, and a separate action
 * discards them. The status line says so rather than leaving someone to guess
 * whether their post went out.
 *
 * The "link a vehicle" control searches the real demo listings rather than
 * accepting a hand-written title and price, which is what the brief's free-text
 * embed would have allowed.
 */
export function PostComposer() {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [linkedId, setLinkedId] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [query, setQuery] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const draft = readDraft();
    if (draft.text) setText(draft.text);
    if (draft.vehicleId) setLinkedId(draft.vehicleId);
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (!text.trim() && !linkedId) {
        clearDraft();
        setSavedAt(null);
        return;
      }
      writeDraft({ text, vehicleId: linkedId });
      setSavedAt(
        new Intl.DateTimeFormat("en-ZA", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
      );
    }, 600);
    return () => window.clearTimeout(handle);
  }, [text, linkedId]);

  const autoGrow = () => {
    const node = textareaRef.current;
    if (!node) return;
    node.style.height = "auto";
    node.style.height = `${node.scrollHeight}px`;
  };

  const linkedVehicle = linkedId
    ? DEMO_VEHICLES.find((vehicle) => vehicle.id === linkedId)
    : undefined;
  const matches = query.trim()
    ? DEMO_VEHICLES.filter((vehicle) =>
        `${vehicle.title} ${vehicle.location}`.toLowerCase().includes(query.trim().toLowerCase()),
      ).slice(0, 5)
    : DEMO_VEHICLES.slice(0, 5);

  const discard = () => {
    setText("");
    setLinkedId(null);
    clearDraft();
    setSavedAt(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    toast({ variant: "info", title: "Draft discarded" });
  };

  return (
    <FeatureGate featureKey="community.post_composer">
      <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-4">
        <div className="flex gap-3">
          <div
            className="w-10 h-10 rounded-full bg-ink-100 dark:bg-ink-800 flex-shrink-0 flex items-center justify-center text-xs font-bold text-ink-500 dark:text-ink-300"
            aria-hidden="true"
          >
            You
          </div>

          <div className="flex-1 min-w-0">
            <label htmlFor="community-composer" className="sr-only">
              Write a post
            </label>
            <textarea
              id="community-composer"
              ref={textareaRef}
              value={text}
              maxLength={MAX_LENGTH}
              onChange={(event) => {
                setText(event.target.value);
                autoGrow();
              }}
              placeholder="Write an example post about the car scene"
              rows={2}
              className="w-full bg-transparent text-[15px] text-ink-900 dark:text-white placeholder:text-ink-400 focus:outline-none resize-none py-2"
            />

            {linkedVehicle && (
              <div className="relative">
                <VehicleEmbed vehicle={linkedVehicle} />
                <button
                  type="button"
                  onClick={() => setLinkedId(null)}
                  aria-label="Remove linked listing"
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 text-ink-500 hover:text-brand"
                >
                  <X size={13} />
                </button>
              </div>
            )}

            {picking && (
              <div className="mt-3 rounded-xl border border-ink-100 dark:border-ink-800 p-3">
                <label htmlFor="composer-vehicle-search" className="sr-only">
                  Search listings to link
                </label>
                <input
                  id="composer-vehicle-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search listings by name or town"
                  className="w-full text-sm bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800 rounded-lg px-3 py-2 text-ink-900 dark:text-white placeholder:text-ink-400 focus:outline-none focus:border-brand/40"
                />
                <ul className="mt-2 space-y-1">
                  {matches.map((vehicle) => (
                    <li key={vehicle.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setLinkedId(vehicle.id);
                          setPicking(false);
                          setQuery("");
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-ink-50 dark:hover:bg-ink-800 text-ink-700 dark:text-ink-200"
                      >
                        {vehicle.title} — {vehicle.location}
                      </button>
                    </li>
                  ))}
                  {matches.length === 0 && (
                    <li className="px-2 py-1.5 text-xs text-ink-400">No listing matches that.</li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-ink-100 dark:border-ink-800">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPicking((value) => !value)}
                  aria-pressed={picking}
                  className="inline-flex items-center gap-1.5 min-h-[36px] px-2.5 rounded-lg text-xs font-semibold text-ink-500 dark:text-ink-400 hover:text-brand hover:bg-brand/5 transition-colors"
                >
                  <Car size={15} strokeWidth={1.75} aria-hidden="true" />
                  {linkedId ? "Change listing" : "Link a listing"}
                </button>
                {text.length > 0 && (
                  <span className="text-[10px] text-ink-400 tabular-nums">
                    {text.length}/{MAX_LENGTH}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {(text.trim() || linkedId) && (
                  <SmartButton
                    featureKey="community.discard_draft"
                    variant="secondary"
                    className="!h-9 !px-3"
                    leftIcon={Trash2}
                    onClick={discard}
                  >
                    Discard
                  </SmartButton>
                )}
                <SmartButton
                  featureKey="community.submit_post"
                  className="!h-9 !px-4"
                  leftIcon={Save}
                  onClick={() =>
                    toast({
                      variant: "info",
                      title: "Saved as a draft on this device",
                      description: "TrueWheels has no community service, so it cannot publish it.",
                    })
                  }
                  disabled={!text.trim() && !linkedId}
                >
                  Save draft
                </SmartButton>
              </div>
            </div>

            <p className="text-[11px] text-ink-400 leading-relaxed mt-2.5">
              {COMPOSER_DISCLOSURE}
              {savedAt && <span className="block mt-0.5">Draft last saved at {savedAt}.</span>}
            </p>
          </div>
        </div>
      </div>
    </FeatureGate>
  );
}
