import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  useMockCourses: false,
  setUseMockCourses: () => {},
});
const expoExtra = Constants.expoConfig?.extra || {};
const toBooleanFlag = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase() === "true";
const envMockCoursesValue = String(
  process.env.EXPO_PUBLIC_DEV_USE_MOCK_COURSES ?? ""
)
  .trim()
  .toLowerCase();
const hasExplicitEnvMockCoursesFlag =
  envMockCoursesValue === "true" || envMockCoursesValue === "false";
const DEV_USE_MOCK_COURSES_DEFAULT = hasExplicitEnvMockCoursesFlag
  ? envMockCoursesValue === "true"
  : toBooleanFlag(expoExtra.devUseMockCourses) ||
    toBooleanFlag(process.env.EXPO_PUBLIC_DEV_USE_MOCK_COURSES);
const DEV_USE_MOCK_COURSES_KEY = "dev-use-mock-courses";

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
  categoryId: String(
    course?.categoryId ??
      course?.categoryID ??
      course?.category?.id ??
      course?.category ??
      ""
  ).trim(),
  categoryTitle: String(
    course?.categoryTitle ?? course?.categoryName ?? ""
  ).trim(),
  courseTitle: String(course?.courseTitle ?? course?.title ?? "").trim(),
  author: String(course?.author ?? "Course Creator").trim(),
  priceValue: String(course?.priceValue ?? course?.price ?? "$0").trim(),
  coursePhoto: course?.coursePhoto || course?.photoUrl || DEFAULT_COURSE_PHOTO,
  ownerId: String(course?.ownerId ?? course?.createdBy ?? "").trim(),
  courseContent: Array.isArray(course?.courseContent)
    ? course.courseContent
    : Array.isArray(course?.contentParts)
    ? course.contentParts
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
  const [useMockCourses, setUseMockCourses] = useState(
    DEV_USE_MOCK_COURSES_DEFAULT
  );

  useEffect(() => {
    if (hasExplicitEnvMockCoursesFlag) {
      return undefined;
    }

    let isMounted = true;

    const loadMockCoursesOverride = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(
          DEV_USE_MOCK_COURSES_KEY
        );
        if (!isMounted || storedValue == null) {
          return;
        }
        setUseMockCourses(toBooleanFlag(storedValue));
      } catch (error) {
        console.warn("Unable to load mock courses preference.", {
          message: error?.message,
        });
      }
    };

    loadMockCoursesOverride();

    return () => {
      isMounted = false;
    };
  }, []);

  const persistUseMockCourses = useCallback(async (nextValue) => {
    setUseMockCourses(Boolean(nextValue));
    try {
      await AsyncStorage.setItem(
        DEV_USE_MOCK_COURSES_KEY,
        String(Boolean(nextValue))
      );
    } catch (error) {
      console.warn("Unable to save mock courses preference.", {
        message: error?.message,
      });
    }
  }, []);

  useEffect(() => {
    if (useMockCourses || !isFirebaseConfigured || !db) {
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
          .filter((course) => course.id && course.courseTitle);

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
  }, [useMockCourses]);

  const addCourse = useCallback(
    async (courseDraft) => {
      if (!courseDraft?.courseTitle || !courseDraft?.categoryId) {
        return null;
      }

      const idBase = normalizeIdPart(courseDraft.courseTitle) || "new-course";
      const nextId = `${idBase}-${Date.now()}`;
      const ownerId = String(
        courseDraft?.ownerId ?? auth?.currentUser?.uid ?? ""
      ).trim();
      const newCourse = normalizeCourse({
        ...courseDraft,
        id: nextId,
        categoryId: String(courseDraft?.categoryId ?? ""),
        ownerId,
      });

      if (useMockCourses || !isFirebaseConfigured || !db) {
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
    },
    [useMockCourses]
  );

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

      if (useMockCourses || !isFirebaseConfigured || !db) {
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
    [courses, useMockCourses]
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

      if (useMockCourses || !isFirebaseConfigured || !db) {
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
    [courses, useMockCourses]
  );

  const value = useMemo(
    () => ({
      courses,
      addCourse,
      updateCourse,
      deleteCourse,
      useMockCourses,
      setUseMockCourses: persistUseMockCourses,
    }),
    [
      addCourse,
      courses,
      deleteCourse,
      persistUseMockCourses,
      updateCourse,
      useMockCourses,
    ]
  );

  return (
    <CourseCatalogContext.Provider value={value}>
      {children}
    </CourseCatalogContext.Provider>
  );
};

export const useCourseCatalog = () => useContext(CourseCatalogContext);
