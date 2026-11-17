"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type * as LeafletNS from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@/components/theme/ThemeProvider";
import { MapControls } from "@/components/map/MapControls";
import { RadiusTool } from "@/components/map/RadiusTool";
import { PRICE_PIN_ICON, pricePinHtml, pinTooltip } from "@/components/map/PriceMarker";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import type { DemoVehicle } from "@/lib/demo/vehicles";
import { boundsOf, vehicleCoords } from "@/lib/geo";
import { localeTag } from "@/lib/i18n/locale";

interface MapViewProps {
  vehicles: DemoVehicle[];
  center: [number, number] | null;
  radiusKm: number;
  onRadiusChange: (center: [number, number] | null, radiusKm?: number) => void;
}

const TILE_LIGHT = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const TILE_DARK = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

// OpenStreetMap data and the CARTO basemap both require attribution, so the
// default control stays on rather than being disabled.
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export function MapView({ vehicles, center, radiusKm, onRadiusChange }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletNS.Map | null>(null);
  const leafletRef = useRef<typeof LeafletNS | null>(null);
  const tileRef = useRef<LeafletNS.TileLayer | null>(null);
  const markersRef = useRef<LeafletNS.LayerGroup | null>(null);
  const circleRef = useRef<LeafletNS.Circle | null>(null);
  const [ready, setReady] = useState(false);
  const [isRadiusActive, setIsRadiusActive] = useState(false);
  const { resolvedTheme } = useTheme();

  // Leaflet touches window at import time, so it is loaded in the browser only.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mod = await import("leaflet");
      if (cancelled || !containerRef.current || mapRef.current) return;
      const L = (mod.default ?? mod) as typeof LeafletNS;
      leafletRef.current = L;

      const map = L.map(containerRef.current, { zoomControl: false, worldCopyJump: true }).setView(
        [-29.0, 25.0],
        5
      );
      mapRef.current = map;
      markersRef.current = L.layerGroup().addTo(map);
      setReady(true);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = null;
      tileRef.current = null;
      circleRef.current = null;
      setReady(false);
    };
  }, []);

  // Basemap swaps with the theme.
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!ready || !L || !map) return;
    if (tileRef.current) map.removeLayer(tileRef.current);
    tileRef.current = L.tileLayer(resolvedTheme === "dark" ? TILE_DARK : TILE_LIGHT, {
      maxZoom: 19,
      attribution: ATTRIBUTION,
    }).addTo(map);
  }, [ready, resolvedTheme]);

  // Pins follow the filtered result set, not a separate invented list.
  useEffect(() => {
    const L = leafletRef.current;
    const markers = markersRef.current;
    if (!ready || !L || !markers) return;
    markers.clearLayers();

    vehicles.slice(0, 300).forEach((vehicle) => {
      const marker = L.marker(vehicleCoords(vehicle), {
        icon: L.divIcon({ ...PRICE_PIN_ICON, html: pricePinHtml(vehicle.price, vehicle.title) }),
        title: pinTooltip(vehicle),
        keyboard: true,
        alt: `${vehicle.title}, R ${vehicle.price.toLocaleString(localeTag("en"))}`,
      });
      marker.bindTooltip(pinTooltip(vehicle), { direction: "top", offset: [0, -28] });
      marker.addTo(markers);
    });
  }, [ready, vehicles]);

  // Circle is owned here so clearing and resizing stay in one place.
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!ready || !L || !map) return;
    if (circleRef.current) {
      map.removeLayer(circleRef.current);
      circleRef.current = null;
    }
    if (center) {
      circleRef.current = L.circle(center, {
        radius: radiusKm * 1000,
        color: "#e10600",
        fillColor: "#e10600",
        fillOpacity: 0.1,
        weight: 2,
        dashArray: "5, 5",
      }).addTo(map);
    }
  }, [ready, center, radiusKm]);

  const handleRadiusDrawn = useCallback(
    (next: [number, number]) => {
      onRadiusChange(next);
      setIsRadiusActive(false);
    },
    [onRadiusChange]
  );

  const zoomIn = () => mapRef.current?.zoomIn();
  const zoomOut = () => mapRef.current?.zoomOut();
  const fitBounds = useCallback(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const bounds = boundsOf(vehicles);
    if (!L || !map || !bounds) return;
    map.fitBounds(L.latLngBounds(bounds), { padding: [48, 48], maxZoom: 11 });
  }, [vehicles]);

  const nearbyCount = vehicles.length;

  return (
    <div className="relative w-full h-[calc(100vh-220px)] min-h-[26rem] rounded-2xl overflow-hidden border border-ink-100 dark:border-ink-800 shadow-lift">
      <div ref={containerRef} className="w-full h-full z-0" aria-label="Map of vehicle locations" />

      {ready && (
        <MapControls
          isRadiusActive={isRadiusActive}
          hasRadius={center !== null}
          radiusKm={radiusKm}
          onToggleRadius={() => setIsRadiusActive((active) => !active)}
          onClearRadius={() => {
            onRadiusChange(null);
            setIsRadiusActive(false);
          }}
          onRadiusChange={(km) => onRadiusChange(center, km)}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onFitBounds={fitBounds}
        />
      )}

      {ready && isRadiusActive && (
        <RadiusTool map={mapRef.current} radiusKm={radiusKm} onRadiusDrawn={handleRadiusDrawn} />
      )}

      <div className="absolute bottom-4 right-4 z-[400] glass rounded-xl px-4 py-2 pointer-events-none">
        <p className="text-[10px] font-bold text-ink-500 uppercase tracking-wider flex items-center gap-1">
          <Icon icon={MapPin} size={10} /> On the map
        </p>
        <p className="text-xs font-semibold text-ink-900 dark:text-white">
          {nearbyCount.toLocaleString(localeTag("en"))} {nearbyCount === 1 ? "vehicle" : "vehicles"}
          {center ? " in radius" : " nearby"}
        </p>
      </div>

      {vehicles.length === 0 && (
        <div className="absolute inset-0 z-[400] flex items-center justify-center pointer-events-none">
          <div className="glass rounded-xl px-4 py-3 pointer-events-auto">
            <p className="text-sm font-semibold text-ink-900 dark:text-white">No vehicles to map</p>
            <Link href="/marketplace" className="text-xs text-brand hover:underline">
              Clear the filters
            </Link>
          </div>
        </div>
      )}

      <span className="sr-only" aria-live="polite">
        {nearbyCount} vehicles shown on the map
      </span>

      {!ready && (
        <div className="absolute inset-0 z-[400] flex items-center justify-center bg-ink-50 dark:bg-ink-900">
          <span className="flex items-center gap-2 text-sm text-ink-500">
            <Badge variant="ai" tone="aurora">Loading map</Badge>
          </span>
        </div>
      )}
    </div>
  );
}

export default MapView;
