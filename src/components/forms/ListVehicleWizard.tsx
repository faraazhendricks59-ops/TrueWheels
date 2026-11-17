"use client";

import { useState } from "react";
import { z } from "zod";
import { FormWizard, type WizardStep } from "@/components/forms/FormWizard";
import { useZodForm } from "@/lib/useZodForm";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch, Checkbox } from "@/components/ui/Toggles";
import {
  CurrencyInput,
  OdometerInput,
  LicenseDiskScanner,
  formatZAR,
} from "@/components/forms/SpecializedFields";
import { useToast } from "@/components/ui/Toast";

const CURRENT_YEAR = new Date().getFullYear();

// One flat object rather than z.intersection(...): a flat schema keeps
// issue paths simple and, unlike an intersection, exposes a usable shape.
const ListingSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .number({ error: "Year is required" })
    .int("Year must be a whole number")
    .min(1900, "Year must be 1900 or later")
    .max(CURRENT_YEAR, `Year cannot be later than ${CURRENT_YEAR}`),
  vin: z
    .string()
    .length(17, "VIN must be exactly 17 characters")
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/i, "VIN cannot contain I, O or Q"),
  odometer: z
    .number({ error: "Odometer is required" })
    .min(0, "Odometer cannot be negative")
    .max(2_000_000, "Odometer reading looks implausible"),
  photos: z.array(z.string()).min(3, "At least 3 photos are required"),
  price: z
    .number({ error: "Asking price is required" })
    .min(1000, "Price must be at least R 1 000"),
  isVoetstoots: z.boolean(),
  // boolean + refine rather than z.literal(true): the field stays typed
  // boolean (so the Checkbox handler type-checks) while still requiring true.
  agreedToTerms: z.boolean().refine((v) => v === true, "You must agree to the terms"),
});

type ListingValues = z.infer<typeof ListingSchema>;

const STEP_FIELDS: Record<string, (keyof ListingValues)[]> = {
  identity: ["make", "model", "year", "vin"],
  condition: ["odometer", "photos"],
  legal: ["price", "isVoetstoots", "agreedToTerms"],
};

export function ListVehicleWizard() {
  const { toast } = useToast();
  // Arrays/booleans are seeded so the strict schema reports the friendly
  // "at least 3 photos" / "you must agree" messages rather than Zod's generic
  // "expected array, received undefined".
  const form = useZodForm(ListingSchema, {
    photos: [],
    isVoetstoots: false,
    agreedToTerms: false,
  });
  const [scanned, setScanned] = useState(false);

  // Photos are represented as placeholder tokens; a real uploader replaces this.
  const photoCount = form.data.photos?.length ?? 0;

  const validateStep = (stepId: string) => {
    // validate(field) marks each field touched, so errors become visible
    // instead of the Continue button appearing to do nothing.
    const results = STEP_FIELDS[stepId].map((field) => form.validate(field));
    return results.every(Boolean);
  };

  const handleSubmit = async () => {
    await form.handleSubmit(async (values) => {
      // Stand-in for the create-listing call until the data layer lands.
      await new Promise((resolve) => setTimeout(resolve, 900));
      toast({
        variant: "trust",
        title: "Listing Published Successfully",
        description: `${values.year} ${values.make} ${values.model} at ${formatZAR(values.price)} is now live.`,
        source: "Verified by TrueWheels AI Photo QC & VIN Decode.",
      });
    });
  };

  const steps: WizardStep[] = [
    {
      id: "identity",
      title: "Vehicle Identity",
      description: "Tell us about the car. You can scan your license disk to auto-fill.",
      validate: () => validateStep("identity"),
      content: (
        <>
          <LicenseDiskScanner
            onScanComplete={(data) => {
              setScanned(true);
              form.setData({ vin: data.vin });
              toast({
                variant: "success",
                title: "License Disk Scanned",
                description: `VIN ${data.vin} and engine number extracted.`,
              });
            }}
          />

          {scanned && (
            <p className="text-xs text-semantic-success font-medium">
              VIN decoded from your license disk. Please confirm it matches the vehicle.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Make"
              placeholder="Select Make"
              options={[
                { value: "Volkswagen", label: "Volkswagen" },
                { value: "BMW", label: "BMW" },
                { value: "Toyota", label: "Toyota" },
                { value: "Ford", label: "Ford" },
              ]}
              value={form.data.make}
              onChange={(v) => form.updateField("make", v)}
              error={form.errors.make}
            />
            <Select
              label="Model"
              placeholder="Select Model"
              options={[
                { value: "Golf GTI", label: "Golf GTI" },
                { value: "Polo", label: "Polo" },
                { value: "M3 Competition", label: "M3 Competition" },
                { value: "Hilux Legend", label: "Hilux Legend" },
              ]}
              value={form.data.model}
              onChange={(v) => form.updateField("model", v)}
              error={form.errors.model}
            />
          </div>

          <Input
            label="Year"
            type="number"
            min={1900}
            max={CURRENT_YEAR}
            value={Number.isFinite(form.data.year) ? form.data.year : ""}
            onChange={(e) => form.updateField("year", e.target.value === "" ? NaN : Number(e.target.value))}
            error={form.errors.year}
            required
          />

          <Input
            label="VIN (Vehicle Identification Number)"
            value={form.data.vin ?? ""}
            onChange={(e) => form.updateField("vin", e.target.value.toUpperCase())}
            hint="17-character code found on your license disk or dashboard."
            error={form.errors.vin}
            maxLength={17}
            required
          />
        </>
      ),
    },
    {
      id: "condition",
      title: "Condition & Media",
      description: "Upload photos and confirm the current mileage.",
      validate: () => validateStep("condition"),
      content: (
        <>
          <OdometerInput
            value={form.data.odometer ?? NaN}
            onChange={(v) => form.updateField("odometer", v)}
            previousReading={120000}
            error={form.errors.odometer}
          />

          <div className="border-2 border-dashed border-ink-200 dark:border-ink-800 rounded-2xl p-12 text-center">
            <p className="text-sm text-ink-500 dark:text-ink-300 mb-1">
              Photo upload area (minimum 3, maximum 20)
            </p>
            <p className="text-xs text-ink-400 mb-4">{photoCount} of 3 required photos added</p>
            <button
              type="button"
              onClick={() =>
                form.updateField(
                  "photos",
                  Array.from({ length: Math.min(photoCount + 1, 20) }, (_, i) => `photo-${i}.jpg`)
                )
              }
              className="text-xs font-semibold text-brand hover:underline focus:outline-none focus:ring-2 focus:ring-brand rounded"
            >
              Add a sample photo
            </button>
          </div>
          {form.errors.photos && (
            <p role="alert" className="text-xs text-semantic-error font-medium">
              {form.errors.photos}
            </p>
          )}
        </>
      ),
    },
    {
      id: "legal",
      title: "Pricing & Legal",
      description: "Set your price and acknowledge the legal terms of sale.",
      validate: () => validateStep("legal"),
      content: (
        <>
          <CurrencyInput
            id="asking-price"
            label="Asking Price"
            value={form.data.price ?? NaN}
            onChange={(v) => form.updateField("price", v)}
            error={form.errors.price}
            hint="Buyers can still make offers if you mark the price as negotiable."
          />

          <div className="p-5 bg-ink-50 dark:bg-ink-950 rounded-2xl border border-ink-100 dark:border-ink-800">
            <Switch
              label="Sell 'Voetstoots' (As-Is)"
              description="You declare the vehicle is sold without implicit warranties, per the Consumer Protection Act exceptions for private sales. This does not remove your duty to describe the vehicle honestly."
              checked={form.data.isVoetstoots ?? false}
              onChange={(v) => form.updateField("isVoetstoots", v)}
            />
          </div>

          <Checkbox
            label="I confirm the information provided is accurate and I agree to the TrueWheels Terms of Service and POPIA Privacy Policy."
            checked={form.data.agreedToTerms ?? false}
            onChange={(v) => form.updateField("agreedToTerms", v)}
          />
          {form.errors.agreedToTerms && (
            <p role="alert" className="text-xs text-semantic-error font-medium">
              {form.errors.agreedToTerms}
            </p>
          )}
        </>
      ),
    },
  ];

  return (
    <FormWizard
      steps={steps}
      submitFeatureKey="listings.publish"
      onSubmit={handleSubmit}
      isSubmitting={form.isSubmitting}
    />
  );
}
