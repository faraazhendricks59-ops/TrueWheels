"use client";

import { useEffect, useId, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { SmartButton } from "@/components/ui/SmartButton";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { useEvents } from "@/components/providers/EventsProvider";
import { EVENT_TYPE_LABELS, EVENT_TYPES, EVENT_LOCAL_ONLY, type EventType } from "@/lib/events";

const TYPE_OPTIONS = EVENT_TYPES.map((value) => ({ value, label: EVENT_TYPE_LABELS[value] }));

function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

/**
 * Adding an event.
 *
 * This really writes the event to this device and it appears at its own route and in
 * the directory. There is no server and no organiser account, so the event is private
 * to this browser, which the form says rather than implying a public listing.
 */
export function CreateEventModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { createEvent } = useEvents();
  const { toast } = useToast();
  const descriptionId = useId();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(todayIso());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("");
  const [venue, setVenue] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<EventType>("meet");

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setDate(todayIso());
      setStartTime("09:00");
      setEndTime("");
      setVenue("");
      setLocation("");
      setType("meet");
    }
  }, [isOpen]);

  const timesInvalid = Boolean(endTime) && Boolean(startTime) && endTime <= startTime;
  const canSubmit = title.trim().length > 0 && Boolean(date) && !timesInvalid;

  const handleCreate = () => {
    if (!canSubmit) return;
    createEvent({ title, description, date, startTime, endTime, venue, location, type });
    toast({
      variant: "success",
      title: "Event saved to this device",
      description: `"${title.trim()}" was added. It is stored in this browser only, and no one else can see it.`,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add an event"
      description="An event you add is kept on this device. It is not published, and nobody else can see it."
      maxWidth="lg"
      footer={
        <>
          <SmartButton featureKey="events.cancel_create" variant="ghost" onClick={onClose}>
            Cancel
          </SmartButton>
          <SmartButton featureKey="events.submit_create" onClick={handleCreate} disabled={!canSubmit}>
            Save event
          </SmartButton>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Title"
          placeholder="e.g. Sunday breakfast run"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={80}
        />

        <div>
          <label
            htmlFor={descriptionId}
            className="text-xs font-semibold text-ink-600 dark:text-ink-300 uppercase tracking-wide block mb-1.5"
          >
            Description
          </label>
          <textarea
            id={descriptionId}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            maxLength={400}
            placeholder="What is happening, and what should people bring?"
            className="w-full p-3 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-sm text-ink-900 dark:text-white placeholder:text-ink-400 focus:outline-none focus:border-brand transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <Input
            label="Start time"
            type="time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
          />
          <Input
            label="End time"
            type="time"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            error={timesInvalid ? "End must be after start." : undefined}
          />
        </div>

        <Select label="Type" options={TYPE_OPTIONS} value={type} onChange={(value) => setType(value as EventType)} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Venue"
            placeholder="e.g. Kyalami Grand Circuit"
            value={venue}
            onChange={(event) => setVenue(event.target.value)}
            maxLength={80}
          />
          <Input
            label="Location"
            placeholder="e.g. Midrand, Gauteng"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            maxLength={80}
          />
        </div>

        <p className="text-[11px] text-ink-400 leading-relaxed">{EVENT_LOCAL_ONLY}</p>
      </div>
    </Modal>
  );
}
