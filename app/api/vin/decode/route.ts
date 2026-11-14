import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { vin?: unknown } | null;
  const vin = typeof body?.vin === "string" ? body.vin.trim().toUpperCase() : "";
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return NextResponse.json({ error: "Invalid VIN" }, { status: 400 });
  return NextResponse.json({ error: "VIN provider is not configured" }, { status: 503 });
}
