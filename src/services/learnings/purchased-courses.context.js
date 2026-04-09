import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COURSE_PROGRESS_KEY_PREFIX = "learnings-progress";

const PurchasedCoursesContext = createContext({
  purchasedCourses: [],
  cartCourses: [],
  addPurchasedCourse: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
});

export const PurchasedCoursesProvider = ({ children }) => {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [cartCourses, setCartCourses] = useState([]);

  useEffect(() => {
    // Mock app cleanup: prevent old local test progress from affecting new runs.
    const clearLegacyProgress = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const progressKeys = keys.filter((key) =>
          key.startsWith(`${COURSE_PROGRESS_KEY_PREFIX}:`)
        );

        if (progressKeys.length > 0) {
          await AsyncStorage.multiRemove(progressKeys);
        }
      } catch {
        // no-op
      }
    };

    clearLegacyProgress();
  }, []);

  const addPurchasedCourse = (course) => {
    if (!course?.id) {
      return;
    }

    const isAlreadyPurchased = purchasedCourses.some(
      (existingCourse) => existingCourse.id === course.id
    );

    if (isAlreadyPurchased) {
      return;
    }

    setPurchasedCourses((previousCourses) => {
      return [...previousCourses, course];
    });

    setCartCourses((previousCourses) =>
      previousCourses.filter((existingCourse) => existingCourse.id !== course.id)
    );

    const progressStorageKey = `${COURSE_PROGRESS_KEY_PREFIX}:${course.id}`;
    AsyncStorage.setItem(progressStorageKey, JSON.stringify([])).catch(() => {});
  };

  const addToCart = (course) => {
    if (!course?.id) {
      return;
    }

    setCartCourses((previousCourses) => {
      const isAlreadyInCart = previousCourses.some(
        (existingCourse) => existingCourse.id === course.id
      );
      const isAlreadyPurchased = purchasedCourses.some(
        (existingCourse) => existingCourse.id === course.id
      );

      if (isAlreadyInCart || isAlreadyPurchased) {
        return previousCourses;
      }

      return [...previousCourses, course];
    });
  };

  const removeFromCart = (courseId) => {
    setCartCourses((previousCourses) =>
      previousCourses.filter((existingCourse) => existingCourse.id !== courseId)
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
