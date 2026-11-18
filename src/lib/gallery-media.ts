import type { DemoVehicle } from "@/lib/demo/vehicles";

export type MediaType = "photo" | "spin" | "video";

/** What the item actually is, stated plainly rather than implied. */
export type MediaKind = "illustration" | "placeholder" | "supplied";

export interface GalleryMedia {
  id: string;
  type: MediaType;
  /** Absent for a placeholder panel, which is drawn instead of loaded. */
  src?: string;
  /** Poster for a video. */
  poster?: string;
  label: string;
  kind: MediaKind;
  /** Shown on the provenance pill, so a viewer knows what they are looking at. */
  note: string;
  frames?: number;
}

export const SPIN_FRAMES = 36;

/** The angles a listing would normally be photographed from. */
const ANGLES = [
  { id: "front", label: "Front three-quarter" },
  { id: "side", label: "Side profile" },
  { id: "rear", label: "Rear three-quarter" },
  { id: "interior", label: "Interior" },
  { id: "engine", label: "Engine bay" },
] as const;

export function spinFrameUrl(vehicleId: string, frame: number): string {
  return `/api/gallery/spin?id=${encodeURIComponent(vehicleId)}&frame=${frame}`;
}

/**
 * The media for a listing. No photographs and no walkthrough video were
 * supplied with these demo listings, so the gallery says so: the panels are
 * placeholders and the 360 view is an illustration. Both are labelled, because
 * presenting a drawing as a photograph of the car would mislead a buyer about
 * its condition.
 */
export function mediaFor(vehicle: DemoVehicle): GalleryMedia[] {
  return [
    {
      id: "spin",
      type: "spin",
      src: spinFrameUrl(vehicle.id, 1),
      label: "360 view",
      kind: "illustration",
      note: "Illustration generated for this demo. Not a photograph of this vehicle.",
      frames: SPIN_FRAMES,
    },
    ...ANGLES.map((angle) => ({
      id: angle.id,
      type: "photo" as const,
      label: angle.label,
      kind: "placeholder" as const,
      note: "Placeholder panel. No photograph has been supplied for this listing.",
    })),
  ];
}

export function mediaBadgeLabel(media: GalleryMedia): string {
  return media.kind === "illustration"
    ? "Illustration"
    : media.kind === "placeholder"
      ? "Placeholder"
      : "Photo";
}
