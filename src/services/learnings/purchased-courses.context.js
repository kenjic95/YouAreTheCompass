import React, { createContext, useContext, useMemo, useState } from "react";

const PurchasedCoursesContext = createContext({
  purchasedCourses: [],
  addPurchasedCourse: () => {},
});

export const PurchasedCoursesProvider = ({ children }) => {
  const [purchasedCourses, setPurchasedCourses] = useState([]);

  const addPurchasedCourse = (course) => {
    if (!course?.id) {
      return;
    }

    setPurchasedCourses((previousCourses) => {
      const isAlreadyPurchased = previousCourses.some(
        (existingCourse) => existingCourse.id === course.id
      );

      if (isAlreadyPurchased) {
        return previousCourses;
      }

      return [...previousCourses, course];
    });
  };

  const value = useMemo(
    () => ({
      purchasedCourses,
      addPurchasedCourse,
    }),
    [purchasedCourses]
  );

  return (
    <PurchasedCoursesContext.Provider value={value}>
      {children}
    </PurchasedCoursesContext.Provider>
  );
};

export const usePurchasedCourses = () => useContext(PurchasedCoursesContext);
