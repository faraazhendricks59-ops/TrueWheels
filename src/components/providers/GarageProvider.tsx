"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  EMPTY_GARAGE,
  GARAGE_KEY,
  garageId,
  parseGarage,
  type Garage,
  type GarageVehicle,
  type JournalEntry,
  type ServiceEntry,
} from "@/lib/garage";

interface GarageContextValue {
  garage: Garage;
  isHydrated: boolean;
  addVehicle: (vehicle: Omit<GarageVehicle, "id">) => string;
  updateVehicle: (id: string, patch: Partial<GarageVehicle>) => void;
  removeVehicle: (id: string) => void;
  addJournalEntry: (vehicleId: string, entry: Omit<JournalEntry, "id">) => void;
  removeJournalEntry: (vehicleId: string, entryId: string) => void;
  addServiceEntry: (vehicleId: string, entry: Omit<ServiceEntry, "id">) => void;
  removeServiceEntry: (vehicleId: string, entryId: string) => void;
  clearGarage: () => void;
}

const GarageContext = createContext<GarageContextValue | undefined>(undefined);

export function useGarage(): GarageContextValue {
  const context = useContext(GarageContext);
  if (!context) throw new Error("useGarage must be used inside a GarageProvider");
  return context;
}

/**
 * The user's garage, persisted in this browser.
 *
 * Mirrors PersonalizationProvider: the first render is always empty so the server
 * and client markup agree, and storage is read in an effect. The id counter is
 * seeded from the existing entries rather than Math.random, so an entry created
 * during hydration cannot produce two different ids on the two passes.
 */
export function GarageProvider({ children }: { children: ReactNode }) {
  const [garage, setGarage] = useState<Garage>(EMPTY_GARAGE);
  const [isHydrated, setIsHydrated] = useState(false);
  const nextId = useRef(0);

  useEffect(() => {
    let stored: Garage = EMPTY_GARAGE;
    try {
      const raw = window.localStorage.getItem(GARAGE_KEY);
      stored = raw ? parseGarage(JSON.parse(raw)) : EMPTY_GARAGE;
    } catch {
      // Corrupt or unavailable storage must not break the page.
      stored = EMPTY_GARAGE;
    }
    nextId.current = stored.vehicles.length + 1;
    setGarage(stored);
    setIsHydrated(true);
  }, []);

  const persist = useCallback((next: Garage) => {
    setGarage(next);
    try {
      window.localStorage.setItem(GARAGE_KEY, JSON.stringify(next));
    } catch {
      // Quota or private mode: the session keeps working, it just will not survive a reload.
    }
  }, []);

  const addVehicle = useCallback(
    (vehicle: Omit<GarageVehicle, "id">) => {
      const id = garageId("g", nextId.current++);
      persist({ ...garage, vehicles: [...garage.vehicles, { ...vehicle, id }] });
      return id;
    },
    [garage, persist]
  );

  const updateVehicle = useCallback(
    (id: string, patch: Partial<GarageVehicle>) => {
      persist({
        ...garage,
        vehicles: garage.vehicles.map((vehicle) =>
          vehicle.id === id ? { ...vehicle, ...patch, id: vehicle.id } : vehicle
        ),
      });
    },
    [garage, persist]
  );

  const removeVehicle = useCallback(
    (id: string) => {
      const journals = { ...garage.journals };
      const services = { ...garage.services };
      delete journals[id];
      delete services[id];
      persist({
        vehicles: garage.vehicles.filter((vehicle) => vehicle.id !== id),
        journals,
        services,
      });
    },
    [garage, persist]
  );

  const addJournalEntry = useCallback(
    (vehicleId: string, entry: Omit<JournalEntry, "id">) => {
      const existing = garage.journals[vehicleId] ?? [];
      const id = garageId("j", nextId.current++);
      persist({
        ...garage,
        journals: { ...garage.journals, [vehicleId]: [...existing, { ...entry, id }] },
      });
    },
    [garage, persist]
  );

  const removeJournalEntry = useCallback(
    (vehicleId: string, entryId: string) => {
      const kept = (garage.journals[vehicleId] ?? []).filter((entry) => entry.id !== entryId);
      const journals = { ...garage.journals };
      if (kept.length) journals[vehicleId] = kept;
      else delete journals[vehicleId];
      persist({ ...garage, journals });
    },
    [garage, persist]
  );

  const addServiceEntry = useCallback(
    (vehicleId: string, entry: Omit<ServiceEntry, "id">) => {
      const existing = garage.services[vehicleId] ?? [];
      const id = garageId("s", nextId.current++);
      persist({
        ...garage,
        services: { ...garage.services, [vehicleId]: [...existing, { ...entry, id }] },
      });
    },
    [garage, persist]
  );

  const removeServiceEntry = useCallback(
    (vehicleId: string, entryId: string) => {
      const kept = (garage.services[vehicleId] ?? []).filter((entry) => entry.id !== entryId);
      const services = { ...garage.services };
      if (kept.length) services[vehicleId] = kept;
      else delete services[vehicleId];
      persist({ ...garage, services });
    },
    [garage, persist]
  );

  const clearGarage = useCallback(() => persist(EMPTY_GARAGE), [persist]);

  const value = useMemo(
    () => ({
      garage,
      isHydrated,
      addVehicle,
      updateVehicle,
      removeVehicle,
      addJournalEntry,
      removeJournalEntry,
      addServiceEntry,
      removeServiceEntry,
      clearGarage,
    }),
    [
      garage,
      isHydrated,
      addVehicle,
      updateVehicle,
      removeVehicle,
      addJournalEntry,
      removeJournalEntry,
      addServiceEntry,
      removeServiceEntry,
      clearGarage,
    ]
  );

  return <GarageContext.Provider value={value}>{children}</GarageContext.Provider>;
}
