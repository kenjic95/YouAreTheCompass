import React, { createContext, useContext, useMemo, useState } from "react";
import { coursesMock } from "./course-content.mock";

const CourseCatalogContext = createContext({
  courses: [],
  addCourse: () => null,
});

const normalizeIdPart = (value) =>
  String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const CourseCatalogProvider = ({ children }) => {
  const [courses, setCourses] = useState(coursesMock);

  const addCourse = (courseDraft) => {
    if (!courseDraft?.courseTitle || !courseDraft?.categoryId) {
      return null;
    }

    const idBase = normalizeIdPart(courseDraft.courseTitle) || "new-course";
    const nextId = `${idBase}-${Date.now()}`;
    const newCourse = {
      ...courseDraft,
      id: nextId,
    };

    setCourses((previous) => [newCourse, ...previous]);
    return newCourse;
  };

  const value = useMemo(
    () => ({
      courses,
      addCourse,
    }),
    [courses]
  );

  return (
    <CourseCatalogContext.Provider value={value}>
      {children}
    </CourseCatalogContext.Provider>
  );
};

export const useCourseCatalog = () => useContext(CourseCatalogContext);
