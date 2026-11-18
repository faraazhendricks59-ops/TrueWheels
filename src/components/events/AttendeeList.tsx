"use client";

import Link from "next/link";
import { Car, Users } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { useGarage } from "@/components/providers/GarageProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { NO_OTHER_ATTENDEES, RSVP_LABELS, type RsvpStatus } from "@/lib/events";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Who is attending.
 *
 * The brief's list was populated with named people and the cars they were "bringing
 * from their Digital Garage". There are no accounts (src/lib/profile.ts,
 * NO_FOLLOW_GRAPH) and garages are local to a device (src/lib/garage.ts), so neither
 * the people nor their cars exist to read. Every attendee in the brief was invented.
 *
 * What is real: the reader, their own RSVP, and — from their own digital garage on
 * this device — the vehicles they actually own. So the one attendee shown is the
 * reader, the car preview comes from their real garage, and the panel states that
 * there is nobody else rather than implying a crowd.
 */
export function AttendeeList({ rsvp }: { rsvp: RsvpStatus }) {
  const { garage } = useGarage();
  const { user } = useAuth();

  const ownerName = user?.name ?? "You";
  const vehicles = garage.vehicles;

  return (
    <Reveal variant="up" delay={200}>
      <section className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-ink-900 dark:text-white flex items-center gap-2">
            <Icon icon={Users} size={14} className="text-ink-400" />
            Attendees
          </h2>
          <Badge variant="status" tone={rsvp === "going" ? "green" : "ink"}>
            {rsvp === "none" ? "No answer yet" : RSVP_LABELS[rsvp]}
          </Badge>
        </div>

        <p className="px-5 pt-3 text-[11px] text-ink-400 leading-relaxed">{NO_OTHER_ATTENDEES}</p>

        <div className="p-5">
          <div className="flex items-start gap-4">
            <span className="w-10 h-10 rounded-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-sm font-bold text-ink-600 dark:text-ink-300 flex-shrink-0">
              {initials(ownerName)}
            </span>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-ink-900 dark:text-white truncate">{ownerName}</p>
              <p className="text-xs text-ink-500 dark:text-ink-400">
                {rsvp === "none" ? "You have not answered yet" : `You are ${RSVP_LABELS[rsvp].toLowerCase()}`}
              </p>

              <div className="mt-3">
                <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Icon icon={Car} size={11} />
                  From your garage
                </p>

                {vehicles.length === 0 ? (
                  <p className="text-[11px] text-ink-400 leading-relaxed">
                    Your garage is empty, so there is nothing to bring.{" "}
                    <Link href="/garage" className="text-brand font-semibold hover:underline">
                      Add a vehicle
                    </Link>{" "}
                    to see it here.
                  </p>
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {vehicles.slice(0, 6).map((vehicle) => (
                      <li
                        key={vehicle.id}
                        className="flex items-center gap-2 rounded-lg border border-ink-100 dark:border-ink-800 px-2.5 py-1.5"
                      >
                        <span className="w-6 h-6 rounded bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-[9px] font-bold text-ink-500">
                          {vehicle.year}
                        </span>
                        <span className="text-[11px] font-medium text-ink-700 dark:text-ink-200 truncate max-w-[9rem]">
                          {vehicle.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
