import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { db, isFirebaseConfigured } from "../auth/firebase";
import { useUserProfile } from "../auth/user-profile.context";

const initialJournals = [
  {
    id: "1",
    title: "Hiking in Blue Mountains",
    date: "April 3, 2026",
    checklistItems: ["Water bottle", "Trail snacks"],
    beforeTripNotes: "I want to catch the sunrise and take photos.",
    afterTripNotes: "The lookout was worth the early start.",
  },
  {
    id: "2",
    title: "Scuba Diving in Cairns",
    date: "April 6, 2026",
    checklistItems: ["Towel", "Underwater camera"],
    beforeTripNotes: "A little nervous, but excited for the reef.",
    afterTripNotes: "Saw incredible coral and felt more confident.",
  },
  {
    id: "3",
    title: "Camping in Cockatoo Island",
    date: "April 8, 2026",
    checklistItems: ["Tent", "Flashlight"],
    beforeTripNotes: "Hoping for a calm night by the harbour.",
    afterTripNotes: "The skyline view at night was the highlight.",
  },
  {
    id: "4",
    title: "Coastal Walk in Coogee",
    date: "April 9, 2026",
    checklistItems: ["Hat", "Sunscreen"],
    beforeTripNotes: "Planning a slow walk and cafe stop after.",
    afterTripNotes: "Perfect weather and a really easy reset.",
  },
];

const TripLogsContext = createContext({
  journals: [],
  saveJournal: async () => null,
  getJournalById: () => null,
  isLoading: false,
});

const normalizeChecklistItems = (items = []) =>
  items.map((item) => item.trim()).filter(Boolean);

const normalizeJournal = (journal = {}) => ({
  ...journal,
  id: String(journal?.id ?? "").trim(),
  title: journal?.title?.trim() || "Untitled Journal",
  date: journal?.date?.trim() || "No date added",
  checklistItems: normalizeChecklistItems(journal?.checklistItems),
  beforeTripNotes: journal?.beforeTripNotes?.trim() || "",
  afterTripNotes: journal?.afterTripNotes?.trim() || "",
});

const getTimestampMillis = (value) => {
  if (typeof value?.toMillis === "function") {
    return value.toMillis();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  return Number(value) || 0;
};

const sortJournals = (journalsToSort = []) =>
  [...journalsToSort].sort((firstJournal, secondJournal) => {
    const secondTime = getTimestampMillis(
      secondJournal.updatedAt ?? secondJournal.createdAt
    );
    const firstTime = getTimestampMillis(
      firstJournal.updatedAt ?? firstJournal.createdAt
    );

    return secondTime - firstTime;
  });

export const TripLogsProvider = ({ children }) => {
  const { authUser } = useUserProfile();
  const [journals, setJournals] = useState(initialJournals);
  const [isLoading, setIsLoading] = useState(false);
  const userId = authUser?.uid ? String(authUser.uid) : "";

  useEffect(() => {
    if (!isFirebaseConfigured || !db || !userId) {
      setJournals(initialJournals);
      setIsLoading(false);
      return undefined;
    }

    setIsLoading(true);

    const journalsQuery = query(
      collection(db, "tripJournals"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      journalsQuery,
      (snapshot) => {
        const mappedJournals = snapshot.docs
          .map((document) =>
            normalizeJournal({
              id: document.id,
              ...document.data(),
            })
          )
          .filter((journal) => journal.id);

        setJournals(sortJournals(mappedJournals));
        setIsLoading(false);
      },
      (error) => {
        console.warn("Unable to subscribe to Firestore trip journals.", {
          code: error?.code,
          message: error?.message,
        });
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, [userId]);

  const saveJournal = useCallback(
    async (journal) => {
      const normalizedJournal = normalizeJournal(journal);

      const journalId = normalizedJournal?.id || Date.now().toString();
      const completeJournal = {
        ...normalizedJournal,
        id: journalId,
      };

      setJournals((currentJournals) => {
        const journalIndex = currentJournals.findIndex(
          (existingJournal) => existingJournal.id === journalId
        );

        if (journalIndex === -1) {
          return sortJournals([
            {
              ...completeJournal,
              updatedAt: Date.now(),
            },
            ...currentJournals,
          ]);
        }

        return sortJournals(
          currentJournals.map((existingJournal) =>
            existingJournal.id === journalId
              ? {
                  ...existingJournal,
                  ...completeJournal,
                  updatedAt: Date.now(),
                }
              : existingJournal
          )
        );
      });

      if (!isFirebaseConfigured || !db || !userId) {
        return journalId;
      }

      try {
        const isExistingJournal = journals.some(
          (existingJournal) => String(existingJournal.id) === String(journalId)
        );
        const journalPayload = {
          ...completeJournal,
          userId,
          updatedAt: serverTimestamp(),
        };

        if (!isExistingJournal) {
          journalPayload.createdAt = serverTimestamp();
        }

        await setDoc(doc(db, "tripJournals", journalId), journalPayload, {
          merge: true,
        });
      } catch (error) {
        console.warn("Unable to save Firestore trip journal.", {
          code: error?.code,
          message: error?.message,
        });
        return null;
      }

      return journalId;
    },
    [journals, userId]
  );

  const getJournalById = useCallback(
    (journalId) =>
      journals.find((journal) => String(journal.id) === String(journalId)) ||
      null,
    [journals]
  );

  const value = useMemo(
    () => ({
      journals,
      saveJournal,
      getJournalById,
      isLoading,
    }),
    [getJournalById, isLoading, journals, saveJournal]
  );

  return (
    <TripLogsContext.Provider value={value}>
      {children}
    </TripLogsContext.Provider>
  );
};

export const useTripLogs = () => useContext(TripLogsContext);
