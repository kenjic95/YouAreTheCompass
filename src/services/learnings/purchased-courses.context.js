import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCourseCatalog } from "./course-catalog.context";

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
  const [purchasedCourseIds, setPurchasedCourseIds] = useState([]);
  const [cartCourseIds, setCartCourseIds] = useState([]);

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

  const addPurchasedCourse = (course) => {
    const courseId = course?.id;
    if (!courseId) {
      return;
    }
    if (purchasedCourseIds.includes(courseId)) {
      return;
    }

    setPurchasedCourseIds((previousIds) =>
      previousIds.includes(courseId) ? previousIds : [...previousIds, courseId]
    );
    setCartCourseIds((previousIds) =>
      previousIds.filter((existingId) => existingId !== courseId)
    );

    const progressStorageKey = `${COURSE_PROGRESS_KEY_PREFIX}:${courseId}`;
    AsyncStorage.setItem(progressStorageKey, JSON.stringify([])).catch(() => {});
  };

  const addToCart = (course) => {
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
  };

  const removeFromCart = (courseId) => {
    setCartCourseIds((previousIds) =>
      previousIds.filter((existingId) => existingId !== courseId)
    );
  };

  const value = useMemo(
    () => ({
      purchasedCourses,
      cartCourses,
      addPurchasedCourse,
      addToCart,
      removeFromCart,
    }),
    [purchasedCourses, cartCourses]
  );

  return (
    <PurchasedCoursesContext.Provider value={value}>
      {children}
    </PurchasedCoursesContext.Provider>
  );
};

export const usePurchasedCourses = () => useContext(PurchasedCoursesContext);
