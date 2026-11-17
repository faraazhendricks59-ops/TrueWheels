"use client";

import { ReactNode, useState, useCallback, useRef } from "react";
import { clsx } from "clsx";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { FeatureKey } from "@/lib/feature-flags";

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  content: ReactNode;
  /** Returns true when the step may be left. Should also surface its errors. */
  validate: () => boolean;
}

interface FormWizardProps {
  steps: WizardStep[];
  submitFeatureKey: FeatureKey;
  onSubmit: () => Promise<void> | void;
  isSubmitting: boolean;
  submitLabel?: string;
  /** Highest step index the user has reached, for clickable step navigation. */
  onStepChange?: (index: number) => void;
}

export function FormWizard({
  steps,
  submitFeatureKey,
  onSubmit,
  isSubmitting,
  submitLabel = "Publish Listing",
  onStepChange,
}: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, steps.length - 1));
      setCurrentStep(clamped);
      onStepChange?.(clamped);
      // Move focus to the step heading so keyboard and screen-reader users are
      // placed at the start of the new step rather than left on the button.
      requestAnimationFrame(() => headingRef.current?.focus());
    },
    [steps.length, onStepChange]
  );

  const handleNext = () => {
    // validate() both gates progression and reveals the step's errors; a bare
    // boolean return with no error display would leave a dead Continue button.
    if (!steps[currentStep].validate()) return;
    goTo(currentStep + 1);
  };

  const isLastStep = currentStep === steps.length - 1;
  const activeStep = steps[currentStep];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress header */}
      <ol className="flex items-start justify-between mb-10" aria-label="Progress">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          return (
            <li
              key={step.id}
              className="flex items-start flex-1 last:flex-none"
              aria-current={isActive ? "step" : undefined}
            >
              <div className="flex flex-col items-center">
                <div
                  className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300",
                    isActive
                      ? "bg-brand text-white shadow-glow scale-110"
                      : isCompleted
                        ? "bg-semantic-success text-white"
                        : "bg-ink-100 dark:bg-ink-800 text-ink-400"
                  )}
                >
                  {isCompleted ? <Icon icon={Check} size={16} /> : index + 1}
                </div>
                <span
                  className={clsx(
                    "text-xs font-semibold mt-2 text-center hidden sm:block max-w-[8rem]",
                    isActive ? "text-brand" : "text-ink-400"
                  )}
                >
                  {step.title}
                  {isCompleted && <span className="sr-only"> (completed)</span>}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={clsx(
                    "flex-1 h-0.5 mx-2 mt-5 transition-colors duration-300",
                    isCompleted ? "bg-semantic-success" : "bg-ink-100 dark:bg-ink-800"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Live region: announces the step change without moving focus. */}
      <p aria-live="polite" className="sr-only">
        {`Step ${currentStep + 1} of ${steps.length}: ${activeStep.title}`}
      </p>

      {/* Step content */}
      <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-3xl p-8 shadow-lift min-h-[400px]">
        <div className="mb-6">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-2xl font-display font-bold text-ink-900 dark:text-white focus:outline-none"
          >
            {activeStep.title}
          </h2>
          <p className="text-sm text-ink-500 dark:text-ink-300 mt-1">{activeStep.description}</p>
        </div>

        {/* Keyed so each step mounts fresh and plays its own entry animation. */}
        <div key={activeStep.id} className="space-y-6 animate-fade-in">
          {activeStep.content}
        </div>
      </div>

      {/* Navigation footer */}
      <div className="flex justify-between mt-8">
        <SmartButton
          featureKey="wizard.previous_step"
          variant="ghost"
          onClick={() => goTo(currentStep - 1)}
          disabled={currentStep === 0 || isSubmitting}
          leftIcon={ArrowLeft}
        >
          Back
        </SmartButton>

        {isLastStep ? (
          <SmartButton
            featureKey={submitFeatureKey}
            isLoading={isSubmitting}
            onClick={onSubmit}
            rightIcon={Check}
          >
            {submitLabel}
          </SmartButton>
        ) : (
          <SmartButton
            featureKey="wizard.next_step"
            onClick={handleNext}
            disabled={isSubmitting}
            rightIcon={ArrowRight}
          >
            Continue
          </SmartButton>
        )}
      </div>
    </div>
  );
}
