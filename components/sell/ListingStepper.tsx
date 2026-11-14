interface ListingStepperProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function ListingStepper({ currentStep, totalSteps, stepLabels }: ListingStepperProps) {
  const safeStep = Math.min(Math.max(currentStep, 1), totalSteps);
  const progress = totalSteps > 1 ? ((safeStep - 1) / (totalSteps - 1)) * 100 : 0;
  return <div className="mx-auto mb-10 w-full max-w-2xl" aria-label={`Listing progress: step ${safeStep} of ${totalSteps}`}><div className="relative flex items-center justify-between"><div className="absolute left-0 top-1/2 -z-10 h-1 w-full -translate-y-1/2 rounded-full bg-brand-silver" /><div className="absolute left-0 top-1/2 -z-10 h-1 -translate-y-1/2 rounded-full bg-brand-red transition-all duration-500" style={{ width: `${progress}%` }} />{stepLabels.map((label, index) => { const stepNum = index + 1; const isActive = stepNum === safeStep; const isCompleted = stepNum < safeStep; return <div key={label} className="flex flex-col items-center bg-surface-grey px-2"><div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${isActive ? "scale-110 border-brand-red bg-brand-red text-white shadow-md" : isCompleted ? "border-brand-graphite bg-brand-graphite text-white" : "border-brand-silver bg-surface-white text-gray-400"}`} aria-current={isActive ? "step" : undefined}>{isCompleted ? "✓" : stepNum}</div><span className={`mt-2 hidden text-[10px] font-medium sm:block ${isActive ? "text-brand-red" : "text-gray-400"}`}>{label}</span></div>; })}</div></div>;
}
