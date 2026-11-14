"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ListingStepper } from "@/components/sell/ListingStepper";
import { ListingFormData, StepVehicleIdentity } from "@/components/sell/StepVehicleIdentity";
import { StepMediaUpload } from "@/components/sell/StepMediaUpload";
import { StepPricingLocation } from "@/components/sell/StepPricingLocation";
import { StepVehicleSpecs } from "@/components/sell/StepVehicleSpecs";

const STEP_LABELS = ["Identity", "Specs", "Photos", "Pricing", "Review"];
const INITIAL_FORM_DATA: ListingFormData = { vin: "", make: "", model: "", year: "", mileage: "", fuelType: "", transmission: "", condition: "", color: "", images: [], price: "", negotiable: false, province: "", city: "" };

export default function SellPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ListingFormData>(INITIAL_FORM_DATA);
  const updateFormData = (data: Partial<ListingFormData>) => setFormData((current) => ({ ...current, ...data }));
  const handleNext = () => setCurrentStep((step) => Math.min(step + 1, STEP_LABELS.length));
  const handleBack = () => setCurrentStep((step) => Math.max(step - 1, 1));
  return <div className="mx-auto max-w-4xl px-4 py-12"><div className="mb-8 text-center"><h1 className="text-3xl font-extrabold tracking-tight text-brand-graphite">List Your Vehicle</h1><p className="mt-2 text-gray-500">Reach thousands of verified buyers on TrueWheels.</p></div><ListingStepper currentStep={currentStep} totalSteps={STEP_LABELS.length} stepLabels={STEP_LABELS} /><div className="min-h-[400px] rounded-2xl border border-brand-silver bg-surface-white p-6 shadow-sm md:p-8">{currentStep === 1 && <StepVehicleIdentity formData={formData} updateFormData={updateFormData} />}{currentStep === 2 && <StepVehicleSpecs formData={formData} updateFormData={updateFormData} />}{currentStep === 3 && <StepMediaUpload formData={formData} updateFormData={updateFormData} />}{currentStep === 4 && <StepPricingLocation formData={formData} updateFormData={updateFormData} />}{currentStep === 5 && <div className="flex h-64 flex-col items-center justify-center text-center"><h2 className="mb-2 text-xl font-bold text-brand-graphite">Step 5: Review &amp; Publish</h2><p className="text-gray-500">Final review screen coming in Phase 14.</p></div>}</div><div className="mx-auto mt-8 flex max-w-2xl justify-between"><Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 1} className="w-32">Back</Button><Button type="button" onClick={handleNext} disabled={currentStep === STEP_LABELS.length} className="w-32">{currentStep === 4 ? "Review" : "Next"}</Button></div></div>;
}
