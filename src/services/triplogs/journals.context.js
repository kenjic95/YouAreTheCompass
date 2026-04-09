import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

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
  saveJournal: () => null,
  getJournalById: () => null,
});

const normalizeChecklistItems = (items = []) =>
  items.map((item) => item.trim()).filter(Boolean);

export const TripLogsProvider = ({ children }) => {
  const [journals, setJournals] = useState(initialJournals);

  const saveJournal = useCallback((journal) => {
    const normalizedJournal = {
      ...journal,
      title: journal?.title?.trim() || "Untitled Journal",
      date: journal?.date?.trim() || "No date added",
      checklistItems: normalizeChecklistItems(journal?.checklistItems),
      beforeTripNotes: journal?.beforeTripNotes?.trim() || "",
      afterTripNotes: journal?.afterTripNotes?.trim() || "",
    };

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
        return [completeJournal, ...currentJournals];
      }

      return currentJournals.map((existingJournal) =>
        existingJournal.id === journalId ? completeJournal : existingJournal
      );
    });

    return journalId;
  }, []);

  const getJournalById = useCallback(
    (journalId) => journals.find((journal) => journal.id === journalId) || null,
    [journals]
  );

  const value = useMemo(
    () => ({
      journals,
      saveJournal,
      getJournalById,
    }),
    [getJournalById, journals, saveJournal]
  );

  return (
    <TripLogsContext.Provider value={value}>
      {children}
    </TripLogsContext.Provider>
  );
};

export const useTripLogs = () => useContext(TripLogsContext);
