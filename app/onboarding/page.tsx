"use client";

import { useState } from "react";
import { AuthForm } from "@/components/onboarding/AuthForm";
import { CinematicIntro } from "@/components/onboarding/CinematicIntro";
import { IntentMatrix } from "@/components/onboarding/IntentMatrix";

type OnboardingStep = "intro" | "intents" | "auth" | "complete";

export default function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>("intro");
  const [intents, setIntents] = useState<string[]>([]);
  const handleAuthSuccess = () => setStep("complete");
  if (step === "intro") return <CinematicIntro onEnter={() => setStep("intents")} />;
  return <div className="flex min-h-screen flex-col bg-surface-grey"><header className="flex w-full justify-center px-8 py-6"><a href="/onboarding" className="flex items-center gap-2" aria-label="TrueWheels onboarding home"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-red text-lg font-bold text-white">T</span><span className="text-xl font-bold tracking-tight text-brand-graphite">True<span className="text-brand-red">Wheels</span></span></a></header><main className="flex flex-1 items-center justify-center">{step === "intents" && <IntentMatrix onComplete={(selected) => { setIntents(selected); setStep("auth"); }} />}{step === "auth" && <AuthForm intents={intents} onBack={() => setStep("intents")} onSuccess={handleAuthSuccess} />}{step === "complete" && <div className="px-4 py-12 text-center"><div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">✓</div><h1 className="mb-2 text-3xl font-extrabold text-brand-graphite">Welcome to TrueWheels</h1><p className="mb-6 text-gray-500">Your tailored automotive experience is ready.</p><a href="/" className="inline-flex h-11 items-center rounded-lg bg-brand-red px-6 font-semibold text-white hover:bg-brand-red-dark">Explore TrueWheels</a></div>}</main></div>;
}
