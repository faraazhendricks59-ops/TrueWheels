"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { SmartButton } from "@/components/ui/SmartButton";
import {
  GARAGE_ROLES,
  GARAGE_STATES,
  ROLE_LABELS,
  STATE_LABELS,
  type GarageRole,
  type GarageState,
} from "@/lib/garage";

export interface NewVehicle {
  title: string;
  year: number;
  state: GarageState;
  role: GarageRole;
  mileage?: number;
  location?: string;
  value?: number;
}

/**
 * Adds a vehicle by hand.
 *
 * The brief's "Add Vehicle" button had no handler at all. This is the real thing:
 * a validated form. It exists because a garage has to be able to contain a car
 * that was not bought here, otherwise the lifecycle tracker is only a saved-list
 * with extra labels.
 */
export function AddVehicleModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (vehicle: NewVehicle) => void;
}) {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [state, setState] = useState<GarageState>("current");
  const [role, setRole] = useState<GarageRole>("daily");
  const [mileage, setMileage] = useState("");
  const [location, setLocation] = useState("");
  const [value, setValue] = useState("");
  const [errors, setErrors] = useState<{ title?: string; year?: string; value?: string }>({});

  const thisYear = new Date().getFullYear();

  const submit = () => {
    const next: typeof errors = {};
    const yearNumber = Number(year);
    if (!title.trim()) next.title = "Enter the make and model";
    if (!/^\d{4}$/.test(year) || yearNumber < 1900 || yearNumber > thisYear + 1) {
      next.year = `Enter a year between 1900 and ${thisYear + 1}`;
    }
    if (value.trim() && (!/^\d+$/.test(value.trim()) || Number(value) < 0)) {
      next.value = "Enter a whole number of rand";
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    onAdd({
      title: title.trim().slice(0, 80),
      year: yearNumber,
      state,
      role,
      mileage: mileage.trim() ? Number(mileage) : undefined,
      location: location.trim() ? location.trim().slice(0, 60) : undefined,
      value: value.trim() ? Number(value) : undefined,
    });
    setTitle("");
    setYear("");
    setMileage("");
    setLocation("");
    setValue("");
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add a vehicle">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <Input
          label="Make and model"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          hint={errors.title ? undefined : "For example: Toyota Hilux 2.8 GD-6"}
          maxLength={80}
        />
        <Input
          label="Year"
          inputMode="numeric"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          error={errors.year}
          maxLength={4}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Lifecycle"
            value={state}
            onChange={(value) => setState(value as GarageState)}
            options={GARAGE_STATES.map((s) => ({ value: s, label: STATE_LABELS[s] }))}
          />
          <Select
            label="Role"
            value={role}
            onChange={(value) => setRole(value as GarageRole)}
            options={GARAGE_ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] }))}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Odometer in km (optional)"
            inputMode="numeric"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
          />
          <Input
            label="Location (optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            maxLength={60}
          />
        </div>
        <Input
          label="Value in rand (optional)"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={errors.value}
          hint={errors.value ? undefined : "Your own figure. TrueWheels does not value vehicles."}
        />

        <div className="flex items-center gap-2 pt-1">
          <SmartButton featureKey="garage.add_submit" type="submit" leftIcon={Plus}>
            Add to garage
          </SmartButton>
          <SmartButton featureKey="garage.add_submit" variant="ghost" onClick={onClose}>
            Cancel
          </SmartButton>
        </div>
      </form>
    </Modal>
  );
}
