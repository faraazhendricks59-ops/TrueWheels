"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ListingStepper } from "@/components/sell/ListingStepper";
import { ListingFormData, StepVehicleIdentity } from "@/components/sell/StepVehicleIdentity";
import { StepMediaUpload } from "@/components/sell/StepMediaUpload";
import { StepPricingLocation } from "@/components/sell/StepPricingLocation";
import { StepReview } from "@/components/sell/StepReview";
import { StepVehicleSpecs } from "@/components/sell/StepVehicleSpecs";
import { ListingSuccess } from "@/components/sell/ListingSuccess";

const STEP_LABELS = ["Identity", "Specs", "Photos", "Pricing", "Review"];
const INITIAL_FORM_DATA: ListingFormData = { vin: "", make: "", model: "", year: "", mileage: "", fuelType: "", transmission: "", condition: "", color: "", images: [], price: "", negotiable: false, province: "", city: "" };

export default function SellPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [formData, setFormData] = useState<ListingFormData>(INITIAL_FORM_DATA);
  const updateFormData = (data: Partial<ListingFormData>) => setFormData((current) => ({ ...current, ...data }));
  const handleNext = () => setCurrentStep((step) => Math.min(step + 1, STEP_LABELS.length));
  const handleBack = () => setCurrentStep((step) => Math.max(step - 1, 1));
  const handlePublish = () => { if (!agreeToTerms || isSubmitting) return; setIsSubmitting(true); window.setTimeout(() => { setIsSubmitting(false); setIsSuccess(true); }, 2000); };
  const handleReset = () => { setIsSuccess(false); setCurrentStep(1); setFormData(INITIAL_FORM_DATA); setAgreeToTerms(false); };
  const handleViewListing = () => { window.location.href = formData.make && formData.model ? "/marketplace" : "/marketplace"; };
  if (isSuccess) return <div className="mx-auto max-w-4xl px-4 py-12"><ListingSuccess onListAnother={handleReset} onViewListing={handleViewListing} /></div>;
  return <div className="mx-auto max-w-4xl px-4 py-12"><div className="mb-8 text-center"><h1 className="text-3xl font-extrabold tracking-tight text-brand-graphite">List Your Vehicle</h1><p className="mt-2 text-gray-500">Reach thousands of verified buyers on TrueWheels.</p></div><ListingStepper currentStep={currentStep} totalSteps={STEP_LABELS.length} stepLabels={STEP_LABELS} /><div className="min-h-[400px] rounded-2xl border border-brand-silver bg-surface-white p-6 shadow-sm md:p-8">{currentStep === 1 && <StepVehicleIdentity formData={formData} updateFormData={updateFormData} />}{currentStep === 2 && <StepVehicleSpecs formData={formData} updateFormData={updateFormData} />}{currentStep === 3 && <StepMediaUpload formData={formData} updateFormData={updateFormData} />}{currentStep === 4 && <StepPricingLocation formData={formData} updateFormData={updateFormData} />}{currentStep === 5 && <StepReview formData={formData} agreeToTerms={agreeToTerms} setAgreeToTerms={setAgreeToTerms} />}</div><div className="mx-auto mt-8 flex max-w-2xl justify-between"><Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 1 || isSubmitting} className="w-32">Back</Button>{currentStep < 5 ? <Button type="button" onClick={handleNext} className="w-32">Next</Button> : <Button type="button" onClick={handlePublish} disabled={!agreeToTerms || isSubmitting} className="w-40">{isSubmitting ? <><Loader2 className="mr-2 animate-spin" size={16} />Publishing...</> : "Publish Listing"}</Button>}</div></div>;
}
