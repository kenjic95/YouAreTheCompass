import React, { createContext, useContext, useMemo, useState } from "react";
import { coursesMock } from "./course-content.mock";

const CourseCatalogContext = createContext({
  courses: [],
  addCourse: () => null,
  updateCourse: () => null,
  deleteCourse: () => false,
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

  const updateCourse = (courseId, updates) => {
    if (!courseId || !updates) {
      return null;
    }

    let updatedCourse = null;
    setCourses((previous) =>
      previous.map((course) => {
        if (course?.id !== courseId) {
          return course;
        }

        updatedCourse = {
          ...course,
          ...updates,
        };
        return updatedCourse;
      })
    );

    return updatedCourse;
  };

  const deleteCourse = (courseId) => {
    if (!courseId) {
      return false;
    }

    let didDelete = false;
    setCourses((previous) => {
      const nextCourses = previous.filter((course) => {
        const shouldKeep = course?.id !== courseId;
        if (!shouldKeep) {
          didDelete = true;
        }
        return shouldKeep;
      });
      return nextCourses;
    });

    return didDelete;
  };

  const value = useMemo(
    () => ({
      courses,
      addCourse,
      updateCourse,
      deleteCourse,
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
