"use client";

import { useState } from "react";
import { decodeVIN, type DecodedVehicle } from "@/lib/vin-decoder";

export function ListingStep1() {
  const [vin, setVin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [vehicleData, setVehicleData] = useState<DecodedVehicle | null>(null);

  async function handleVinSubmit() {
    setError("");
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
      setError("VIN must contain 17 valid characters.");
      return;
    }
    setLoading(true);
    try {
      setVehicleData(await decodeVIN(vin));
    } catch {
      setVehicleData(null);
      setError("Could not decode VIN. Please enter details manually.");
    } finally {
      setLoading(false);
    }
  }

  return <section className="mx-auto max-w-2xl p-8">
    <h1 className="mb-2 text-2xl font-bold">Let&apos;s start with the basics.</h1>
    <p className="mb-6 text-sm text-gray-500">Enter the 17-character VIN to auto-fill your vehicle details.</p>
    <div className="flex flex-col gap-3 sm:flex-row">
      <input value={vin} onChange={(event) => setVin(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 17))} placeholder="Enter VIN" maxLength={17} aria-label="Vehicle identification number" className="flex-1 rounded-lg border border-brand-silver px-4 py-3 uppercase tracking-wider focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20" />
      <button type="button" onClick={handleVinSubmit} disabled={loading} className="rounded-lg bg-brand-graphite px-6 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Decoding..." : "Auto-Fill"}</button>
    </div>
    {error && <p role="alert" className="mt-3 text-sm text-semantic-error">{error}</p>}
    {vehicleData && <div className="mt-8 rounded-xl border border-brand-silver bg-surface-grey p-6"><h2 className="text-lg font-bold">We found your car:</h2><p className="mt-2 text-xl font-extrabold">{vehicleData.year} {vehicleData.make} {vehicleData.model}</p><p className="mt-2 text-sm text-gray-500">Engine: {vehicleData.engine} | Body: {vehicleData.body_type}</p></div>}
  </section>;
}
