import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { tripsMock } from "./trips.mock";

const TripCatalogContext = createContext({
  trips: [],
  addTrip: () => null,
  updateTrip: () => null,
  deleteTrip: () => false,
});

const normalizeIdPart = (value) =>
  String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const TRIP_CATALOG_STORAGE_KEY = "home-connect-trip-catalog-v1";

export const TripCatalogProvider = ({ children }) => {
  const [trips, setTrips] = useState(tripsMock);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadPersistedTrips = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(
          TRIP_CATALOG_STORAGE_KEY
        );
        if (!storedValue) {
          return;
        }

        const parsedTrips = JSON.parse(storedValue);
        if (!Array.isArray(parsedTrips)) {
          return;
        }

        if (isActive) {
          setTrips(parsedTrips);
        }
      } catch {
        // no-op: fallback to mock data
      } finally {
        if (isActive) {
          setHasHydrated(true);
        }
      }
    };

    loadPersistedTrips();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    AsyncStorage.setItem(TRIP_CATALOG_STORAGE_KEY, JSON.stringify(trips)).catch(
      () => {}
    );
  }, [trips, hasHydrated]);

  const addTrip = (tripDraft) => {
    if (!tripDraft?.title) {
      return null;
    }

    const idBase = normalizeIdPart(tripDraft.title) || "new-trip";
    const nextId = `${idBase}-${Date.now()}`;
    const newTrip = {
      ...tripDraft,
      id: nextId,
    };

    setTrips((previous) => [newTrip, ...previous]);
    return newTrip;
  };

  const updateTrip = (tripId, updates) => {
    if (!tripId || !updates) {
      return null;
    }

    let updatedTrip = null;
    setTrips((previous) =>
      (previous ?? []).map((trip) => {
        if (trip?.id !== tripId) {
          return trip;
        }

        updatedTrip = {
          ...trip,
          ...updates,
        };
        return updatedTrip;
      })
    );

    return updatedTrip;
  };

  const deleteTrip = (tripId) => {
    if (!tripId) {
      return false;
    }

    let didDelete = false;
    setTrips((previous) =>
      (previous ?? []).filter((trip) => {
        const shouldKeep = trip?.id !== tripId;
        if (!shouldKeep) {
          didDelete = true;
        }
        return shouldKeep;
      })
    );

    return didDelete;
  };

  const value = useMemo(
    () => ({
      trips,
      addTrip,
      updateTrip,
      deleteTrip,
    }),
    [trips]
  );

  return (
    <TripCatalogContext.Provider value={value}>
      {children}
    </TripCatalogContext.Provider>
  );
};

export const useTripCatalog = () => useContext(TripCatalogContext);
