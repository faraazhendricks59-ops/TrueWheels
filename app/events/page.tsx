import type { Metadata } from "next";
import { EventsPageLayout } from "@/components/events/EventsPageLayout";

export const metadata: Metadata = { title: "Events & Car Meets | TrueWheels", description: "Discover track days, car meets, shows, and cruises across South Africa. RSVP and join the community." };
export default function EventsPage() { return <div className="min-h-screen bg-surface-grey"><EventsPageLayout /></div>; }
