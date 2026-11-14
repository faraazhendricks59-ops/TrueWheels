"use client";

import "leaflet/dist/leaflet.css";
import Image from "next/image";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { VehicleCardProps } from "@/components/vehicles/VehicleCard";

export interface SearchVehicle extends VehicleCardProps { coords: [number, number]; }
const center: [number, number] = [-26.2041, 28.0473];
const formatPrice = (value: number) => new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(value);
const priceIcon = (price: string) => L.divIcon({ className: "custom-price-pin", html: `<div class="map-price-pin">${price}</div>`, iconSize: [100, 32], iconAnchor: [50, 32], popupAnchor: [0, -32] });
function MapBoundsUpdater({ vehicles }: { vehicles: SearchVehicle[] }) { const map = useMap(); const bounds = vehicles.length ? L.latLngBounds(vehicles.map((vehicle) => vehicle.coords)) : L.latLngBounds([center]); map.fitBounds(bounds, { padding: [24, 24], maxZoom: 11 }); return null; }
function PopupVehicle({ vehicle }: { vehicle: SearchVehicle }) { return <div className="min-w-[220px]"><Image src={vehicle.imageUrl} alt={vehicle.title} width={220} height={120} className="mb-2 h-28 w-full rounded object-cover" /><p className="text-sm font-bold text-brand-graphite">{vehicle.title}</p><p className="text-sm font-extrabold text-brand-red">{formatPrice(vehicle.price)}</p><p className="text-xs text-gray-500">{vehicle.location}</p></div>; }
export function InteractiveMapView({ vehicles }: { vehicles: SearchVehicle[] }) { return <div className="relative z-0 h-[calc(100vh-140px)] min-h-[520px] w-full overflow-hidden rounded-xl border border-brand-silver shadow-sm"><MapContainer center={center} zoom={11} scrollWheelZoom className="h-full w-full"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><MapBoundsUpdater vehicles={vehicles} />{vehicles.map((vehicle) => <Marker key={vehicle.id} position={vehicle.coords} icon={priceIcon(formatPrice(vehicle.price))}><Popup maxWidth={260}><PopupVehicle vehicle={vehicle} /></Popup></Marker>)}</MapContainer></div>; }
