import { DEMO_VEHICLES } from "@/lib/demo/vehicles";

/**
 * Generates the frames for the illustrative 360 view.
 *
 * There are no spin photographs in this project, and requesting the frames of a
 * spin that was never captured would only produce a wall of failed requests. So
 * the frames are drawn here: a top-down car turned by the requested angle. The
 * viewer is real and the frames really load; what is illustrative is the car.
 */
const FRAME_COUNT = 36;

function hueFor(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 360;
  return hash;
}

function frameSvg(title: string, angle: number, hue: number): string {
  const body = `hsl(${hue} 62% 52%)`;
  const bodyDark = `hsl(${hue} 58% 38%)`;
  const glass = `hsl(${hue} 30% 78%)`;

  // A top-down car: rounded body, cabin, windscreen, four wheels.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="640" height="640" role="img" aria-label="Illustrative top view of a vehicle">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b0d10"/>
      <stop offset="100%" stop-color="#1b1f27"/>
    </linearGradient>
    <radialGradient id="floor" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="hsl(${hue} 40% 22%)"/>
      <stop offset="100%" stop-color="#0b0d10"/>
    </radialGradient>
  </defs>
  <rect width="640" height="640" fill="url(#bg)"/>
  <ellipse cx="320" cy="330" rx="250" ry="250" fill="url(#floor)"/>
  <circle cx="320" cy="320" r="200" fill="none" stroke="hsl(${hue} 60% 60%)" stroke-opacity="0.18" stroke-width="2" stroke-dasharray="6 10"/>
  <g transform="translate(320 320) rotate(${angle})">
    <rect x="-62" y="-168" width="124" height="336" rx="46" fill="${bodyDark}"/>
    <rect x="-58" y="-162" width="116" height="324" rx="42" fill="${body}"/>
    <rect x="-44" y="-84" width="88" height="104" rx="26" fill="${glass}" opacity="0.92"/>
    <rect x="-48" y="34" width="96" height="58" rx="22" fill="${glass}" opacity="0.75"/>
    <rect x="-70" y="-118" width="16" height="46" rx="8" fill="#0b0d10" opacity="0.85"/>
    <rect x="54" y="-118" width="16" height="46" rx="8" fill="#0b0d10" opacity="0.85"/>
    <rect x="-70" y="74" width="16" height="46" rx="8" fill="#0b0d10" opacity="0.85"/>
    <rect x="54" y="74" width="16" height="46" rx="8" fill="#0b0d10" opacity="0.85"/>
  </g>
  <text x="320" y="600" text-anchor="middle" font-family="system-ui, sans-serif" font-size="20" fill="#ffffff" fill-opacity="0.7">${title}</text>
  <text x="320" y="622" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" fill="#ffffff" fill-opacity="0.4">Illustrative view, not a photograph</text>
</svg>`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? "";
  const frame = Number(searchParams.get("frame") ?? "1");

  const vehicle = DEMO_VEHICLES.find((row) => row.id === id);
  if (!vehicle) return new Response("Unknown vehicle", { status: 404 });

  const index = Number.isFinite(frame) ? ((Math.trunc(frame) - 1) % FRAME_COUNT + FRAME_COUNT) % FRAME_COUNT : 0;
  const angle = Math.round((index / FRAME_COUNT) * 360);

  return new Response(frameSvg(vehicle.title, angle, hueFor(vehicle.id)), {
    headers: {
      "Content-Type": "image/svg+xml",
      // Frames never change for a given vehicle, so they can be cached hard.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
