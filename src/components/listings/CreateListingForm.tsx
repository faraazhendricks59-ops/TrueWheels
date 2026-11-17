"use client";

import { useState } from "react";
import { Car, MapPin } from "lucide-react";
import { SmartButton } from "@/components/ui/SmartButton";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch, Checkbox } from "@/components/ui/Toggles";

export function CreateListingForm() {
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [make, setMake] = useState<string>();

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-lift">
      <h2 className="text-2xl font-display font-bold text-ink-900 dark:text-white mb-6">
        List Your Vehicle
      </h2>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Make"
            value={make}
            onChange={setMake}
            options={[
              { value: "bmw", label: "BMW" },
              { value: "vw", label: "Volkswagen" },
              { value: "toyota", label: "Toyota" },
            ]}
            placeholder="Select Make"
          />
          <Select
            label="Model"
            options={[
              { value: "m3", label: "M3" },
              { value: "m4", label: "M4" },
            ]}
            placeholder="Select Model"
            disabled
          />
        </div>

        <Input
          label="Asking Price (ZAR)"
          type="number"
          placeholder="e.g. 650000"
          leftIcon={Car}
          hint="Market average for this model is R 620,000"
        />

        <Input label="Location" placeholder="e.g. Sandton, Johannesburg" leftIcon={MapPin} />

        <div className="py-4 border-t border-ink-100 dark:border-ink-800">
          <Switch
            label="Price is negotiable"
            description="Allow buyers to make offers below your asking price."
            checked={isNegotiable}
            onChange={setIsNegotiable}
          />
        </div>

        <Checkbox
          label="I agree to the TrueWheels Terms of Service and POPIA privacy policy."
          checked={agreedToTerms}
          onChange={setAgreedToTerms}
        />

        <div className="flex justify-end gap-3 pt-4">
          <SmartButton featureKey="listings.cancel" variant="ghost">
            Cancel
          </SmartButton>
          <SmartButton
            featureKey="listings.publish"
            type="submit"
            disabled={!agreedToTerms}
            rightIcon={Car}
          >
            Publish Listing
          </SmartButton>
        </div>
      </form>
    </div>
  );
}
