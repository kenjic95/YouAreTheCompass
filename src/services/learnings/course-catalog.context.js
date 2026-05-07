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
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { coursesMock } from "./course-content.mock";
import { auth, db, isFirebaseConfigured, storage } from "../auth/firebase";

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

const isRemoteHttpUrl = (value) => /^https?:\/\//i.test(String(value ?? ""));

const getImageExtensionFromUri = (uri) => {
  const normalized = String(uri ?? "").split("?")[0];
  const extension = normalized.split(".").pop()?.toLowerCase();

  if (!extension || extension === normalized.toLowerCase()) {
    return "jpg";
  }

  if (extension === "jpeg") {
    return "jpg";
  }

  return extension;
};

const getContentTypeFromExtension = (extension) => {
  switch (extension) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "heic":
      return "image/heic";
    case "heif":
      return "image/heif";
    default:
      return "image/jpeg";
  }
};

const getFileExtensionFromUri = (uri, fallback = "bin") => {
  const normalized = String(uri ?? "").split("?")[0];
  const extension = normalized.split(".").pop()?.toLowerCase();

  if (!extension || extension === normalized.toLowerCase()) {
    return fallback;
  }

  return extension;
};

const getFileExtensionFromName = (name, fallback = "bin") => {
  const normalized = String(name ?? "").trim();
  if (!normalized.includes(".")) {
    return fallback;
  }

  const extension = normalized.split(".").pop()?.toLowerCase();
  if (!extension) {
    return fallback;
  }

  if (extension === "jpeg") {
    return "jpg";
  }

  return extension;
};

const getFileExtensionFromMimeType = (mimeType, fallback = "bin") => {
  const normalizedMime = String(mimeType ?? "").toLowerCase().trim();
  switch (normalizedMime) {
    case "video/mp4":
      return "mp4";
    case "video/quicktime":
      return "mov";
    case "video/webm":
      return "webm";
    case "application/pdf":
      return "pdf";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/heic":
      return "heic";
    case "image/heif":
      return "heif";
    case "image/jpeg":
    case "image/jpg":
      return "jpg";
    default:
      return fallback;
  }
};

const getFileExtensionForCoursePart = (part = {}) => {
  const uri = String(part?.localUri ?? "").trim();
  const localFileName = String(part?.localFileName ?? "").trim();
  const localMimeType = String(part?.localMimeType ?? "").trim();

  const fromName = getFileExtensionFromName(localFileName, "");
  if (fromName) {
    return fromName;
  }

  const fromMime = getFileExtensionFromMimeType(localMimeType, "");
  if (fromMime) {
    return fromMime;
  }

  return getFileExtensionFromUri(uri, "bin");
};

const getStorageContentTypeForCoursePart = (part = {}, extension = "bin") => {
  const explicitMimeType = String(part?.localMimeType ?? "").trim();
  if (explicitMimeType) {
    return explicitMimeType;
  }

  const normalizedExtension = String(extension ?? "").toLowerCase();
  const normalizedType = String(part?.contentType ?? "").toLowerCase();
  const normalizedKind = String(part?.asset?.kind ?? "").toLowerCase();

  if (
    normalizedType === "pdf" ||
    normalizedKind === "pdf" ||
    normalizedExtension === "pdf"
  ) {
    return "application/pdf";
  }

  if (
    normalizedType === "video" ||
    normalizedKind === "video" ||
    ["mp4", "mov", "m4v", "webm"].includes(normalizedExtension)
  ) {
    switch (normalizedExtension) {
      case "mov":
        return "video/quicktime";
      case "webm":
        return "video/webm";
      default:
        return "video/mp4";
    }
  }

  return getContentTypeFromExtension(normalizedExtension);
};

const uploadBlobWithProgress = (storageRef, blob, metadata, onProgress) =>
  new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, blob, metadata);
    task.on(
      "state_changed",
      (snapshot) => {
        const totalBytes = Number(snapshot.totalBytes) || 0;
        const transferredBytes = Number(snapshot.bytesTransferred) || 0;
        const fileProgress =
          totalBytes > 0
            ? Math.min(1, Math.max(0, transferredBytes / totalBytes))
            : 0;
        onProgress?.(fileProgress);
      },
      (error) => reject(error),
      () => resolve(task.snapshot)
    );
  });

const buildProgressEmitter = (onUploadProgress, totalUnits) => {
  let completedUnits = 0;

  const emit = (message, inFlightUnitProgress = 0) => {
    const safeTotal = Math.max(1, Number(totalUnits) || 0);
    const normalizedInFlight = Math.min(
      1,
      Math.max(0, Number(inFlightUnitProgress) || 0)
    );
    const percent = Math.round(
      ((completedUnits + normalizedInFlight) / safeTotal) * 100
    );

    onUploadProgress?.({
      message,
      completedUnits,
      totalUnits: safeTotal,
      percent: Math.min(100, Math.max(0, percent)),
    });
  };

  const completeOne = (message) => {
    completedUnits += 1;
    emit(message, 0);
  };

  emit("Preparing upload...", 0);

  return {
    emit,
    completeOne,
  };
};

const uploadCourseContentAssets = async (
  courseId,
  courseContent = [],
  progressEmitter
) => {
  if (!Array.isArray(courseContent) || courseContent.length === 0) {
    return courseContent;
  }

  if (!storage || !auth?.currentUser?.uid) {
    return courseContent;
  }

  const uploadedParts = await Promise.all(
    courseContent.map(async (part, index) => {
      const sourceUri = String(part?.localUri ?? "").trim();
      if (!sourceUri || isRemoteHttpUrl(sourceUri)) {
        return part;
      }

      const partId = Number(part?.contentId) || index + 1;
      const extension = getFileExtensionForCoursePart(part);
      const filePath = `course-content/${auth.currentUser.uid}/${courseId}/part-${partId}.${extension}`;
      const storageRef = ref(storage, filePath);
      const response = await fetch(sourceUri);
      const blob = await response.blob();
      const contentType = getStorageContentTypeForCoursePart(part, extension);

      progressEmitter?.emit(`Uploading content part ${partId}...`, 0);
      await uploadBlobWithProgress(
        storageRef,
        blob,
        { contentType },
        (fileProgress) =>
          progressEmitter?.emit(
            `Uploading content part ${partId}...`,
            fileProgress
          )
      );
      progressEmitter?.completeOne(`Uploaded content part ${partId}.`);
      const downloadUrl = await getDownloadURL(storageRef);

      return {
        ...part,
        localUri: downloadUrl,
        uri: downloadUrl,
        url: downloadUrl,
      };
    })
  );

  return uploadedParts;
};

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
    course?.categoryTitle ??
      course?.categoryName ??
      course?.category?.categoryTitle ??
      ""
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
    async (courseDraft, options = {}) => {
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
        const needsCoursePhotoUpload =
          Boolean(newCourse.coursePhoto) && !isRemoteHttpUrl(newCourse.coursePhoto);
        const uploadableCourseParts = (newCourse.courseContent ?? []).filter(
          (part) => {
            const sourceUri = String(part?.localUri ?? "").trim();
            return sourceUri && !isRemoteHttpUrl(sourceUri);
          }
        );
        const totalUploadUnits =
          uploadableCourseParts.length + (needsCoursePhotoUpload ? 1 : 0);
        const progressEmitter =
          totalUploadUnits > 0
            ? buildProgressEmitter(options?.onUploadProgress, totalUploadUnits)
            : null;

        let persistedCoursePhoto = newCourse.coursePhoto;

        if (
          persistedCoursePhoto &&
          !isRemoteHttpUrl(persistedCoursePhoto) &&
          storage
        ) {
          const extension = getImageExtensionFromUri(persistedCoursePhoto);
          const filePath = `courses/${auth.currentUser.uid}/${nextId}/cover.${extension}`;
          const storageRef = ref(storage, filePath);
          const response = await fetch(persistedCoursePhoto);
          const blob = await response.blob();

          progressEmitter?.emit("Uploading course cover...", 0);
          await uploadBlobWithProgress(
            storageRef,
            blob,
            { contentType: getContentTypeFromExtension(extension) },
            (fileProgress) =>
              progressEmitter?.emit("Uploading course cover...", fileProgress)
          );
          progressEmitter?.completeOne("Uploaded course cover.");
          persistedCoursePhoto = await getDownloadURL(storageRef);
        }

        const persistedCourseContent = await uploadCourseContentAssets(
          nextId,
          newCourse.courseContent,
          progressEmitter
        );

        const persistedCourse = {
          ...newCourse,
          coursePhoto: persistedCoursePhoto,
          photoUrl: persistedCoursePhoto,
          courseContent: persistedCourseContent,
        };
        options?.onUploadProgress?.({
          message: "Saving course...",
          percent: 100,
          completedUnits: totalUploadUnits,
          totalUnits: Math.max(1, totalUploadUnits),
        });

        await setDoc(doc(db, "courses", nextId), {
          ...persistedCourse,
          createdBy: auth.currentUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return persistedCourse;
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
        const needsCoursePhotoUpload =
          Boolean(updatedCourse.coursePhoto) &&
          !isRemoteHttpUrl(updatedCourse.coursePhoto);
        const uploadableCourseParts = (updatedCourse.courseContent ?? []).filter(
          (part) => {
            const sourceUri = String(part?.localUri ?? "").trim();
            return sourceUri && !isRemoteHttpUrl(sourceUri);
          }
        );
        const totalUploadUnits =
          uploadableCourseParts.length + (needsCoursePhotoUpload ? 1 : 0);
        const progressEmitter =
          totalUploadUnits > 0
            ? buildProgressEmitter(options?.onUploadProgress, totalUploadUnits)
            : null;

        let persistedCoursePhoto = updatedCourse.coursePhoto;

        if (
          persistedCoursePhoto &&
          !isRemoteHttpUrl(persistedCoursePhoto) &&
          storage
        ) {
          const extension = getImageExtensionFromUri(persistedCoursePhoto);
          const filePath = `courses/${auth.currentUser.uid}/${normalizedCourseId}/cover.${extension}`;
          const storageRef = ref(storage, filePath);
          const response = await fetch(persistedCoursePhoto);
          const blob = await response.blob();

          progressEmitter?.emit("Uploading course cover...", 0);
          await uploadBlobWithProgress(
            storageRef,
            blob,
            { contentType: getContentTypeFromExtension(extension) },
            (fileProgress) =>
              progressEmitter?.emit("Uploading course cover...", fileProgress)
          );
          progressEmitter?.completeOne("Uploaded course cover.");
          persistedCoursePhoto = await getDownloadURL(storageRef);
        }

        const persistedCourseContent = await uploadCourseContentAssets(
          normalizedCourseId,
          updatedCourse.courseContent,
          progressEmitter
        );

        const persistedCourse = {
          ...updatedCourse,
          coursePhoto: persistedCoursePhoto,
          photoUrl: persistedCoursePhoto,
          courseContent: persistedCourseContent,
        };
        options?.onUploadProgress?.({
          message: "Saving course...",
          percent: 100,
          completedUnits: totalUploadUnits,
          totalUnits: Math.max(1, totalUploadUnits),
        });

        await setDoc(
          doc(db, "courses", normalizedCourseId),
          {
            ...persistedCourse,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
        return persistedCourse;
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
