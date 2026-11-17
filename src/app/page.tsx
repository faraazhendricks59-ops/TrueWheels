import { Logo } from "@/components/brand/Logo";
import { Reveal } from "@/components/motion/Reveal";
import { LiveStatsCard } from "@/components/dashboard/LiveStatsCard";
import { CreateListingForm } from "@/components/listings/CreateListingForm";
import { OverlayShowcase } from "@/components/ui/OverlayShowcase";
import { MarketplaceFeed } from "@/components/marketplace/MarketplaceFeed";
import { ListVehicleWizard } from "@/components/forms/ListVehicleWizard";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 py-16 px-4">
      <Reveal variant="up">
        <div className="flex flex-col items-center gap-6">
          <Logo animated size="xl" />
          <p className="text-ink-400 text-sm">The Automotive Operating System.</p>
        </div>
      </Reveal>
      <Reveal variant="up" delay={120}>
        <LiveStatsCard />
      </Reveal>
      <Reveal variant="up" delay={200}>
        <CreateListingForm />
      </Reveal>
      <Reveal variant="up" delay={260}>
        <OverlayShowcase />
      </Reveal>
      <Reveal variant="up" delay={320}>
        <MarketplaceFeed />
      </Reveal>
      <Reveal variant="up" delay={380}>
        <ListVehicleWizard />
      </Reveal>
    </div>
  );
}
