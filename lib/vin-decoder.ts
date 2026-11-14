export interface DecodedVehicle {
  make: string;
  model: string;
  year: number;
  engine: string;
  body_type: string;
}

export async function decodeVIN(vin: string): Promise<DecodedVehicle> {
  const normalized = vin.trim().toUpperCase();
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(normalized)) {
    throw new Error("VIN must contain 17 valid characters");
  }

  const response = await fetch("/api/vin/decode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vin: normalized }),
  });
  if (!response.ok) throw new Error("VIN decoding failed");
  return response.json() as Promise<DecodedVehicle>;
}
