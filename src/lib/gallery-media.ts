import type { DemoVehicle } from "@/lib/demo/vehicles";
import { photoForVehicle } from "@/lib/vehicle-photos";

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
 * The media for a listing.
 *
 * The first item is a real photograph of this model, licensed from Wikimedia
 * Commons, so the gallery opens on an actual car of the right kind. It is not a
 * photograph of this particular vehicle, and it carries its credit so a viewer
 * can see where it came from. The remaining angles were never supplied, so they
 * stay labelled placeholders, and the 360 view stays labelled an illustration;
 * presenting either as a photograph of the car would mislead a buyer about its
 * condition.
 */
export function mediaFor(vehicle: DemoVehicle): GalleryMedia[] {
  const photo = photoForVehicle(vehicle);

  return [
    ...(photo
      ? [
          {
            id: "hero",
            type: "photo" as const,
            src: photo.url,
            label: "Photograph",
            kind: "supplied" as const,
            note: `Photograph of a ${photo.subject} from Wikimedia Commons by ${photo.attribution}, ${photo.licence}. Not this specific vehicle.`,
          },
        ]
      : []),
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

/** True when the gallery has a real photograph to open on. */
export function hasRealPhoto(vehicle: DemoVehicle): boolean {
  return Boolean(photoForVehicle(vehicle));
}
