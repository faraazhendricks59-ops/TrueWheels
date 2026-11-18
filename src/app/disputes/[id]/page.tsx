import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { DisputeTimeline } from "@/components/disputes/DisputeTimeline";
import { EvidenceVault } from "@/components/disputes/EvidenceVault";
import { MediationChat } from "@/components/disputes/MediationChat";
import { AdminResolutionPanel } from "@/components/disputes/AdminResolutionPanel";
import { Reveal } from "@/components/motion/Reveal";
import { DEMO_VEHICLES } from "@/lib/demo/vehicles";

/**
 * The dispute route.
 *
 * The brief called it a "Dispute Resolution Center" with a case, a mediator and an
 * admin adjudication panel. There is no case system, no mediator and no escrow, so
 * this is a guide to resolving a vehicle dispute in South Africa — the real forums,
 * the real steps, and the scam patterns — plus a tool to fingerprint the reader's own
 * evidence locally. See `src/lib/disputes-data.ts`.
 *
 * Follows the vehicle route: only real catalogue ids resolve, and an unknown id is a
 * real 404.
 */
export function generateStaticParams() {
  return DEMO_VEHICLES.map((vehicle) => ({ id: vehicle.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const vehicle = DEMO_VEHICLES.find((row) => row.id === params.id);
  if (!vehicle) return { title: "Listing not found | TrueWheels" };
  return {
    title: `A problem with the ${vehicle.title}? | TrueWheels`,
    description:
      "TrueWheels does not run a dispute resolution service. How a vehicle dispute is actually resolved in South Africa.",
    robots: { index: false, follow: false },
  };
}

export default function DisputePage({ params }: { params: { id: string } }) {
  const vehicle = DEMO_VEHICLES.find((row) => row.id === params.id);
  if (!vehicle) notFound();

  return (
    <AppShell>
      <div className="max-w-[1400px] mx-auto py-8 space-y-6">
        <Reveal variant="up">
          <div>
            <h1 className="text-3xl font-display font-bold text-ink-900 dark:text-white">
              If something is wrong with the vehicle
            </h1>
            <p className="text-ink-500 dark:text-ink-300 mt-1 max-w-3xl">
              TrueWheels does not decide disputes and does not hold your money. This
              page shows the steps that actually resolve a vehicle dispute, the bodies
              that can decide one, and a way to fingerprint your own evidence.
            </p>
          </div>
        </Reveal>

        <Reveal variant="up" delay={100}>
          <DisputeTimeline vehicle={vehicle} />
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <Reveal variant="up" delay={200}>
              <EvidenceVault vehicleId={vehicle.id} />
            </Reveal>
            <Reveal variant="up" delay={250}>
              <AdminResolutionPanel />
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal variant="up" delay={300}>
              <MediationChat />
            </Reveal>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
