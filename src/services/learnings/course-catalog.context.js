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
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { coursesMock } from "./course-content.mock";
import { auth, db, isFirebaseConfigured } from "../auth/firebase";

const CourseCatalogContext = createContext({
  courses: [],
  addCourse: async () => null,
  updateCourse: async () => null,
  deleteCourse: async () => false,
});

const normalizeIdPart = (value) =>
  String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const DEFAULT_COURSE_PHOTO =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80";

const normalizeCourse = (course = {}) => ({
  ...course,
  id: String(course?.id ?? ""),
  categoryId: String(course?.categoryId ?? ""),
  categoryTitle: String(course?.categoryTitle ?? "").trim(),
  courseTitle: String(course?.courseTitle ?? "").trim(),
  author: String(course?.author ?? "Course Creator").trim(),
  priceValue: String(course?.priceValue ?? "$0").trim(),
  coursePhoto: course?.coursePhoto || course?.photoUrl || DEFAULT_COURSE_PHOTO,
  ownerId: String(course?.ownerId ?? ""),
  courseContent: Array.isArray(course?.courseContent)
    ? course.courseContent
    : [],
});

const getSeedCourses = () =>
  (coursesMock ?? []).map((course) =>
    normalizeCourse({
      ...course,
      id: String(course?.id ?? ""),
      categoryId: String(course?.categoryId ?? ""),
    })
  );

const sortCourses = (courseList = []) =>
  [...courseList].sort((a, b) => {
    const aTitle = String(a?.courseTitle ?? "").toLowerCase();
    const bTitle = String(b?.courseTitle ?? "").toLowerCase();
    return aTitle.localeCompare(bTitle);
  });

export const CourseCatalogProvider = ({ children }) => {
  const [courses, setCourses] = useState(getSeedCourses());

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setCourses(getSeedCourses());
      return undefined;
    }

    const unsubscribe = onSnapshot(
      collection(db, "courses"),
      (snapshot) => {
        const mappedCourses = snapshot.docs
          .map((document) =>
            normalizeCourse({
              id: document.id,
              ...document.data(),
            })
          )
          .filter(
            (course) => course.id && course.courseTitle && course.categoryId
          );

        setCourses(sortCourses(mappedCourses));
      },
      (error) => {
        console.warn("Unable to subscribe to Firestore courses.", {
          code: error?.code,
          message: error?.message,
        });
      }
    );

    return unsubscribe;
  }, []);

  const addCourse = useCallback(async (courseDraft) => {
    if (!courseDraft?.courseTitle || !courseDraft?.categoryId) {
      return null;
    }

    const idBase = normalizeIdPart(courseDraft.courseTitle) || "new-course";
    const nextId = `${idBase}-${Date.now()}`;
    const newCourse = normalizeCourse({
      ...courseDraft,
      id: nextId,
      categoryId: String(courseDraft?.categoryId ?? ""),
    });

    if (!isFirebaseConfigured || !db) {
      setCourses((previous) => sortCourses([newCourse, ...previous]));
      return newCourse;
    }

    if (!auth?.currentUser?.uid) {
      return null;
    }

    try {
      await setDoc(doc(db, "courses", nextId), {
        ...newCourse,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return newCourse;
    } catch (error) {
      console.warn("Unable to create Firestore course.", {
        code: error?.code,
        message: error?.message,
      });
      return null;
    }
  }, []);

  const updateCourse = useCallback(
    async (courseId, updates, options = {}) => {
      if (!courseId || !updates) {
        return null;
      }

      const normalizedCourseId = String(courseId);
      const previousCourse = (courses ?? []).find(
        (course) => String(course?.id) === normalizedCourseId
      );

      if (!previousCourse) {
        return null;
      }

      const updatedCourse = normalizeCourse({
        ...previousCourse,
        ...updates,
        id: normalizedCourseId,
      });

      const shouldPersist = options?.persist !== false;

      setCourses((previous) =>
        sortCourses(
          previous.map((course) =>
            String(course?.id) === normalizedCourseId ? updatedCourse : course
          )
        )
      );

      if (!shouldPersist) {
        return updatedCourse;
      }

      if (!isFirebaseConfigured || !db) {
        return updatedCourse;
      }

      if (!auth?.currentUser?.uid) {
        return null;
      }

      try {
        await setDoc(
          doc(db, "courses", normalizedCourseId),
          {
            ...updatedCourse,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
        return updatedCourse;
      } catch (error) {
        console.warn("Unable to update Firestore course.", {
          code: error?.code,
          message: error?.message,
        });
        return null;
      }
    },
    [courses]
  );

  const deleteCourse = useCallback(
    async (courseId) => {
      if (!courseId) {
        return false;
      }

      const normalizedCourseId = String(courseId);
      const didExist = (courses ?? []).some(
        (course) => String(course?.id) === normalizedCourseId
      );

      if (!didExist) {
        return false;
      }

      if (!isFirebaseConfigured || !db) {
        setCourses((previous) =>
          previous.filter((course) => String(course?.id) !== normalizedCourseId)
        );
        return true;
      }

      if (!auth?.currentUser?.uid) {
        return false;
      }

      try {
        await deleteDoc(doc(db, "courses", normalizedCourseId));
        return true;
      } catch (error) {
        console.warn("Unable to delete Firestore course.", {
          code: error?.code,
          message: error?.message,
        });
        return false;
      }
    },
    [courses]
  );

  const value = useMemo(
    () => ({
      courses,
      addCourse,
      updateCourse,
      deleteCourse,
    }),
    [addCourse, courses, deleteCourse, updateCourse]
  );

  return (
    <CourseCatalogContext.Provider value={value}>
      {children}
    </CourseCatalogContext.Provider>
  );
};

export const useCourseCatalog = () => useContext(CourseCatalogContext);
