"use client";

import { useEffect } from "react";
import type * as LeafletNS from "leaflet";

interface RadiusToolProps {
  map: LeafletNS.Map | null;
  /** Radius in kilometres applied when the user clicks the map. */
  radiusKm: number;
  onRadiusDrawn: (center: [number, number]) => void;
}

/**
 * Arms the map so the next click sets a search centre. Logic only; the circle
 * itself is drawn by MapView so it can be cleared and resized in one place.
 */
export function RadiusTool({ map, radiusKm, onRadiusDrawn }: RadiusToolProps) {
  useEffect(() => {
    if (!map) return;

    const container = map.getContainer();
    container.classList.add("radius-active");

    const handleClick = (event: LeafletNS.LeafletMouseEvent) => {
      onRadiusDrawn([event.latlng.lat, event.latlng.lng]);
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
      container.classList.remove("radius-active");
    };
  }, [map, radiusKm, onRadiusDrawn]);

  return null;
}
