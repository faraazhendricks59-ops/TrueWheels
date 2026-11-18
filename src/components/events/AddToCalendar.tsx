"use client";

import { Calendar, ChevronDown } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { Dropdown, DropdownItem } from "@/components/ui/Floating";
import { useToast } from "@/components/ui/Toast";
import { downloadIcs, googleCalendarUrl, outlookCalendarUrl, type EventRecord } from "@/lib/events";

/**
 * Calendar export.
 *
 * This is the one part of the phase that is a real feature rather than a claim, so
 * it is built to actually work. The brief's version pointed "Apple Calendar" at the
 * Google URL and never produced an .ics; here Apple (and any desktop client) gets a
 * genuine RFC 5545 file, downloaded through an object URL, and Google and Outlook get
 * their documented deeplink formats.
 *
 * The success message names the file that was saved, so the reader can find it,
 * rather than claiming a reminder that no service will send.
 */
export function AddToCalendar({ event }: { event: EventRecord }) {
  const { toast } = useToast();

  const handleIcs = () => {
    try {
      downloadIcs(event);
      toast({
        variant: "success",
        title: "Calendar file downloaded",
        description: `Saved "${event.slug}.ics". Open it to add the event to Apple Calendar, Outlook or any other client.`,
      });
    } catch {
      toast({
        variant: "error",
        title: "Could not create the file",
        description: "This browser blocked the download. Try again, or add the event to Google Calendar directly.",
      });
    }
  };

  const trigger = (
    <SmartButton
      featureKey="events.calendar_trigger"
      variant="secondary"
      className="w-full !h-10"
      rightIcon={ChevronDown}
    >
      <Icon icon={Calendar} size={14} />
      Add to calendar
    </SmartButton>
  );

  return (
    <Dropdown trigger={trigger} align="right">
      <DropdownItem
        onClick={() => {
          window.open(googleCalendarUrl(event), "_blank", "noopener,noreferrer");
        }}
      >
        Google Calendar
      </DropdownItem>
      <DropdownItem
        onClick={() => {
          window.open(outlookCalendarUrl(event), "_blank", "noopener,noreferrer");
        }}
      >
        Outlook
      </DropdownItem>
      <DropdownItem onClick={handleIcs}>Apple Calendar (.ics file)</DropdownItem>
    </Dropdown>
  );
}
