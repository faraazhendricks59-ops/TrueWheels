import { Logo } from "@/components/brand/Logo";
import { Reveal } from "@/components/motion/Reveal";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <Reveal variant="up">
        <Logo animated size="xl" />
      </Reveal>
      <p className="text-ink-400 text-sm">The Automotive Operating System.</p>
    </main>
  );
}
