"use client";

import { useState, useEffect } from "react";
import { SplashScreen } from "./SplashScreen";
import { IntentGate } from "./IntentGate";
import { AuthModal } from "@/components/auth/AuthModal";

type OnboardingStage = "splash" | "intent" | "auth" | "complete";

export function OnboardingController({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<OnboardingStage>("splash");

  useEffect(() => {
    // Check if user has already completed onboarding
    const completed = localStorage.getItem("truewheels_onboarding_complete");
    if (completed === "true") {
      setStage("complete");
    }
  }, []);

  const handleSplashComplete = () => setStage("intent");

  const handleIntentComplete = (intents: string[]) => {
    localStorage.setItem("truewheels_intents", JSON.stringify(intents));
    setStage("auth");
  };

  const handleAuthComplete = () => {
    localStorage.setItem("truewheels_onboarding_complete", "true");
    setStage("complete");
  };

  if (stage === "complete") return <>{children}</>;

  return (
    <>
      {stage === "splash" && <SplashScreen onComplete={handleSplashComplete} />}
      {stage === "intent" && <IntentGate onComplete={handleIntentComplete} />}
      {stage === "auth" && <AuthModal onComplete={handleAuthComplete} />}
    </>
  );
}
