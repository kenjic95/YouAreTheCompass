import React, { createContext, useContext, useMemo, useState } from "react";

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

    setCartCourses((previousCourses) =>
      previousCourses.filter((existingCourse) => existingCourse.id !== course.id)
    );
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
