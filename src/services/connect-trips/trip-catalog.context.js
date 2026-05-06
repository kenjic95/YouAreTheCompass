import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { auth, db, isFirebaseConfigured, storage } from "../auth/firebase";
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
const CONNECT_TRIPS_COLLECTION = "trips";
const DEFAULT_TRIP_IMAGE =
  "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=900&q=80";

const isRemoteHttpUrl = (value) => /^https?:\/\//i.test(String(value ?? ""));

const getImageExtensionFromUri = (uri) => {
  const normalized = String(uri ?? "").split("?")[0];
  const extension = normalized.split(".").pop()?.toLowerCase();

  if (!extension || extension === normalized.toLowerCase()) {
    return "jpg";
  }

  return extension === "jpeg" ? "jpg" : extension;
};

const getContentTypeFromExtension = (extension) => {
  switch (String(extension ?? "").toLowerCase()) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "heic":
      return "image/heic";
    case "heif":
      return "image/heif";
    default:
      return "image/jpeg";
  }
};

const uploadBlob = (storageRef, blob, metadata) =>
  new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, blob, metadata);
    task.on(
      "state_changed",
      undefined,
      (error) => reject(error),
      () => resolve(task.snapshot)
    );
  });

const normalizeTrip = (trip = {}) => ({
  ...trip,
  id: String(trip?.id ?? ""),
  title: String(trip?.title ?? "").trim(),
  location: String(trip?.location ?? "").trim(),
  description: String(trip?.description ?? "").trim(),
  link: String(trip?.link ?? "https://www.youarethecompass.com/").trim(),
  duration: String(trip?.duration ?? "").trim(),
  price: String(trip?.price ?? "").trim(),
  image: trip?.image || DEFAULT_TRIP_IMAGE,
  ownerId: String(trip?.ownerId ?? trip?.createdBy ?? "").trim(),
});

const sortTrips = (tripList = []) =>
  [...tripList].sort((a, b) => {
    const aCreatedAt = a?.createdAt?.toMillis?.() ?? 0;
    const bCreatedAt = b?.createdAt?.toMillis?.() ?? 0;

    if (aCreatedAt || bCreatedAt) {
      return bCreatedAt - aCreatedAt;
    }

    return String(a?.title ?? "").localeCompare(String(b?.title ?? ""));
  });

const getSeedTrips = () =>
  (tripsMock ?? []).map((trip) => normalizeTrip({ ...trip }));

export const TripCatalogProvider = ({ children }) => {
  const [trips, setTrips] = useState(getSeedTrips());
  const [hasHydrated, setHasHydrated] = useState(false);
  const shouldUseFirebase = isFirebaseConfigured && db;

  useEffect(() => {
    if (shouldUseFirebase) {
      setHasHydrated(true);
      return undefined;
    }

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
          setTrips(sortTrips(parsedTrips.map((trip) => normalizeTrip(trip))));
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
  }, [shouldUseFirebase]);

  useEffect(() => {
    if (!shouldUseFirebase) {
      return undefined;
    }

    const unsubscribe = onSnapshot(
      collection(db, CONNECT_TRIPS_COLLECTION),
      (snapshot) => {
        const mappedTrips = snapshot.docs
          .map((document) =>
            normalizeTrip({
              id: document.id,
              ...document.data(),
            })
          )
          .filter((trip) => trip.id && trip.title);

        setTrips(sortTrips(mappedTrips));
      },
      (error) => {
        console.warn("Unable to subscribe to Firestore connect trips.", {
          code: error?.code,
          message: error?.message,
        });
      }
    );

    return unsubscribe;
  }, [shouldUseFirebase]);

  useEffect(() => {
    if (!hasHydrated || shouldUseFirebase) {
      return;
    }

    AsyncStorage.setItem(TRIP_CATALOG_STORAGE_KEY, JSON.stringify(trips)).catch(
      () => {}
    );
  }, [trips, hasHydrated, shouldUseFirebase]);

  const persistTripImage = async (tripId, imageUri) => {
    if (!imageUri || isRemoteHttpUrl(imageUri) || !storage) {
      return imageUri || DEFAULT_TRIP_IMAGE;
    }

    if (!auth?.currentUser?.uid) {
      return imageUri;
    }

    const extension = getImageExtensionFromUri(imageUri);
    const filePath = `connect-trips/${auth.currentUser.uid}/${tripId}/cover.${extension}`;
    const storageRef = ref(storage, filePath);
    const response = await fetch(imageUri);
    const blob = await response.blob();

    await uploadBlob(storageRef, blob, {
      contentType: getContentTypeFromExtension(extension),
    });

    return getDownloadURL(storageRef);
  };

  const addTrip = useCallback(
    async (tripDraft) => {
      if (!tripDraft?.title) {
        return null;
      }

      const idBase = normalizeIdPart(tripDraft.title) || "new-trip";
      const nextId = `${idBase}-${Date.now()}`;
      const newTrip = {
        ...normalizeTrip(tripDraft),
        id: nextId,
        ownerId: String(
          tripDraft?.ownerId ?? auth?.currentUser?.uid ?? ""
        ).trim(),
      };

      if (!shouldUseFirebase) {
        setTrips((previous) => sortTrips([newTrip, ...previous]));
        return newTrip;
      }

      if (!auth?.currentUser?.uid) {
        return null;
      }

      try {
        const persistedImage = await persistTripImage(nextId, newTrip.image);
        const persistedTrip = {
          ...newTrip,
          image: persistedImage,
          createdBy: auth.currentUser.uid,
          ownerId: newTrip.ownerId || auth.currentUser.uid,
        };

        await setDoc(doc(db, CONNECT_TRIPS_COLLECTION, nextId), {
          ...persistedTrip,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        return persistedTrip;
      } catch (error) {
        console.warn("Unable to create Firestore connect trip.", {
          code: error?.code,
          message: error?.message,
        });
        return null;
      }
    },
    [shouldUseFirebase]
  );

  const updateTrip = useCallback(
    async (tripId, updates) => {
      if (!tripId || !updates) {
        return null;
      }

      const normalizedTripId = String(tripId);
      const previousTrip = (trips ?? []).find(
        (trip) => String(trip?.id) === normalizedTripId
      );

      if (!previousTrip) {
        return null;
      }

      const updatedTrip = normalizeTrip({
        ...previousTrip,
        ...updates,
        id: normalizedTripId,
      });

      setTrips((previous) =>
        sortTrips(
          (previous ?? []).map((trip) =>
            String(trip?.id) === normalizedTripId ? updatedTrip : trip
          )
        )
      );

      if (!shouldUseFirebase) {
        return updatedTrip;
      }

      if (!auth?.currentUser?.uid) {
        return null;
      }

      try {
        const persistedImage = await persistTripImage(
          normalizedTripId,
          updatedTrip.image
        );
        const persistedTrip = {
          ...updatedTrip,
          image: persistedImage,
        };

        await setDoc(
          doc(db, CONNECT_TRIPS_COLLECTION, normalizedTripId),
          {
            ...persistedTrip,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        return persistedTrip;
      } catch (error) {
        console.warn("Unable to update Firestore connect trip.", {
          code: error?.code,
          message: error?.message,
        });
        return null;
      }
    },
    [shouldUseFirebase, trips]
  );

  const deleteTrip = useCallback(
    async (tripId) => {
      if (!tripId) {
        return false;
      }

      const normalizedTripId = String(tripId);
      const didExist = (trips ?? []).some(
        (trip) => String(trip?.id) === normalizedTripId
      );

      if (!didExist) {
        return false;
      }

      setTrips((previous) =>
        (previous ?? []).filter((trip) => {
          return String(trip?.id) !== normalizedTripId;
        })
      );

      if (!shouldUseFirebase) {
        return true;
      }

      if (!auth?.currentUser?.uid) {
        return false;
      }

      try {
        await deleteDoc(doc(db, CONNECT_TRIPS_COLLECTION, normalizedTripId));
        return true;
      } catch (error) {
        console.warn("Unable to delete Firestore connect trip.", {
          code: error?.code,
          message: error?.message,
        });
        return false;
      }
    },
    [shouldUseFirebase, trips]
  );

  const value = useMemo(
    () => ({
      trips,
      addTrip,
      updateTrip,
      deleteTrip,
    }),
    [addTrip, trips, updateTrip, deleteTrip]
  );

  return (
    <TripCatalogContext.Provider value={value}>
      {children}
    </TripCatalogContext.Provider>
  );
};

export const useTripCatalog = () => useContext(TripCatalogContext);
