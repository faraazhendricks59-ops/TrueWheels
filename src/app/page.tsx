import { Logo } from "@/components/brand/Logo";
import { Reveal } from "@/components/motion/Reveal";
import { LiveStatsCard } from "@/components/dashboard/LiveStatsCard";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-10 py-16">
      <Reveal variant="up">
        <div className="flex flex-col items-center gap-6">
          <Logo animated size="xl" />
          <p className="text-ink-400 text-sm">The Automotive Operating System.</p>
        </div>
      </Reveal>
      <Reveal variant="up" delay={120}>
        <LiveStatsCard />
      </Reveal>
    </main>
  );
}
