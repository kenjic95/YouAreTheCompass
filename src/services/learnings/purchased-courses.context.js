import React, {
  useCallback,
  createContext,
  useEffect,
  useContext,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useCourseCatalog } from "./course-catalog.context";
import { db, isFirebaseConfigured } from "../auth/firebase";
import { useUserProfile } from "../auth/user-profile.context";

const COURSE_PROGRESS_KEY_PREFIX = "learnings-progress";

const PurchasedCoursesContext = createContext({
  purchasedCourses: [],
  cartCourses: [],
  addPurchasedCourse: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
});

export const PurchasedCoursesProvider = ({ children }) => {
  const { courses } = useCourseCatalog();
  const { authUser } = useUserProfile();
  const [purchasedCourseIds, setPurchasedCourseIds] = useState([]);
  const [cartCourseIds, setCartCourseIds] = useState([]);
  const userId = authUser?.uid ? String(authUser.uid) : "";

  useEffect(() => {
    if (!isFirebaseConfigured || !db || !userId) {
      if (!userId) {
        setPurchasedCourseIds([]);
      }
      return undefined;
    }

    const enrollmentsQuery = query(
      collection(db, "enrollments"),
      where("userId", "==", userId),
      where("status", "==", "active")
    );

    const unsubscribe = onSnapshot(
      enrollmentsQuery,
      (snapshot) => {
        const nextPurchasedIds = Array.from(
          new Set(
            snapshot.docs
              .map((document) => String(document.data()?.courseId ?? "").trim())
              .filter(Boolean)
          )
        );

        setPurchasedCourseIds(nextPurchasedIds);
      },
      (error) => {
        console.warn("Unable to subscribe to Firestore enrollments.", {
          code: error?.code,
          message: error?.message,
        });
      }
    );

    return unsubscribe;
  }, [userId]);

  const purchasedCourses = useMemo(() => {
    const purchasedSet = new Set(purchasedCourseIds);
    return (courses ?? []).filter((course) => purchasedSet.has(course?.id));
  }, [courses, purchasedCourseIds]);

  const cartCourses = useMemo(() => {
    const purchasedSet = new Set(purchasedCourseIds);
    const cartSet = new Set(cartCourseIds);
    return (courses ?? []).filter(
      (course) => cartSet.has(course?.id) && !purchasedSet.has(course?.id)
    );
  }, [cartCourseIds, courses, purchasedCourseIds]);

  const addPurchasedCourse = useCallback(
    async (course) => {
      const courseId = String(course?.id ?? "").trim();
      if (!courseId) {
        return false;
      }
      if (purchasedCourseIds.includes(courseId)) {
        return true;
      }

      const shouldPersistToFirestore = Boolean(
        isFirebaseConfigured && db && userId
      );

      if (shouldPersistToFirestore) {
        const enrollmentId = `${userId}_${courseId}`;

        try {
          await setDoc(
            doc(db, "enrollments", enrollmentId),
            {
              userId,
              courseId,
              status: "active",
              enrolledAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (error) {
          console.warn("Unable to create Firestore enrollment.", {
            code: error?.code,
            message: error?.message,
          });
          return false;
        }
      }

      setPurchasedCourseIds((previousIds) =>
        previousIds.includes(courseId)
          ? previousIds
          : [...previousIds, courseId]
      );
      setCartCourseIds((previousIds) =>
        previousIds.filter((existingId) => existingId !== courseId)
      );

      const progressStorageKey = `${COURSE_PROGRESS_KEY_PREFIX}:${courseId}`;
      AsyncStorage.setItem(progressStorageKey, JSON.stringify([])).catch(
        () => {}
      );

      return true;
    },
    [purchasedCourseIds, userId]
  );

  const addToCart = useCallback(
    (course) => {
      const courseId = course?.id;
      if (!courseId) {
        return;
      }

      setCartCourseIds((previousIds) => {
        const isAlreadyInCart = previousIds.includes(courseId);
        const isAlreadyPurchased = purchasedCourseIds.includes(courseId);
        if (isAlreadyInCart || isAlreadyPurchased) {
          return previousIds;
        }

        return [...previousIds, courseId];
      });
    },
    [purchasedCourseIds]
  );

  const removeFromCart = useCallback((courseId) => {
    setCartCourseIds((previousIds) =>
      previousIds.filter((existingId) => existingId !== courseId)
    );
  }, []);

  const value = useMemo(
    () => ({
      purchasedCourses,
      cartCourses,
      addPurchasedCourse,
      addToCart,
      removeFromCart,
    }),
    [
      addPurchasedCourse,
      addToCart,
      cartCourses,
      purchasedCourses,
      removeFromCart,
    ]
  );

  return (
    <PurchasedCoursesContext.Provider value={value}>
      {children}
    </PurchasedCoursesContext.Provider>
  );
};

export const usePurchasedCourses = () => useContext(PurchasedCoursesContext);
