import { localeTag } from "@/lib/i18n/locale";

/**
 * Leaflet renders markers as positioned HTML, so the pin is built as a string
 * for a divIcon. Kept free of the Leaflet namespace so it stays a pure,
 * testable description of the pin.
 */
export function formatPinPrice(price: number): string {
  if (price >= 1_000_000) {
    const millions = price / 1_000_000;
    // One decimal only where it adds information (R1.2m, not R1.0m).
    return `R${millions.toFixed(millions < 10 ? 1 : 0)}m`;
  }
  return `R${Math.round(price / 1000)}k`;
}

export const PRICE_PIN_ICON = {
  className: "custom-price-pin",
  iconSize: [84, 32] as [number, number],
  iconAnchor: [42, 32] as [number, number],
};

/** The pin is a real button so it is focusable and keyboard activatable. */
export function pricePinHtml(price: number, title: string): string {
  const label = `${formatPinPrice(price)}. ${title}`;
  return `<button type="button" class="pin-inner" aria-label="${escapeHtml(label)}">${escapeHtml(
    formatPinPrice(price)
  )}</button>`;
}

/** The title comes from data, so it is escaped before entering the HTML string. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function pinTooltip(vehicle: { title: string; price: number }): string {
  return `${vehicle.title} · R ${vehicle.price.toLocaleString(localeTag("en"))}`;
}
