import { useCallback, useEffect, useMemo, useState } from "react";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../../../../services/auth/firebase";
import { useUserProfile } from "../../../../services/auth/user-profile.context";
import { useCourseCatalog } from "../../../../services/learnings/course-catalog.context";
import { useCategoryCatalog } from "../../../../services/learnings/category-catalog.context";
import { ALL_OPTION_ID, chunk } from "./student-progress.constants";

export const useStudentProgressData = () => {
  const { authUser, role } = useUserProfile();
  const { courses } = useCourseCatalog();
  const { categories } = useCategoryCatalog();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [progressRows, setProgressRows] = useState([]);
  const [studentNamesById, setStudentNamesById] = useState({});
  const [loadError, setLoadError] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(ALL_OPTION_ID);
  const [selectedCourseId, setSelectedCourseId] = useState(ALL_OPTION_ID);
  const [completionFilter, setCompletionFilter] = useState(ALL_OPTION_ID);
  const [refreshTick, setRefreshTick] = useState(0);

  const roleLabel = String(role ?? "").toLowerCase();
  const currentUserId = String(authUser?.uid ?? "");

  const courseById = useMemo(
    () =>
      (courses ?? []).reduce((accumulator, course) => {
        accumulator[String(course?.id)] = course;
        return accumulator;
      }, {}),
    [courses]
  );

  const teacherCourseIds = useMemo(() => {
    if (roleLabel !== "teacher") {
      return [];
    }

    return (courses ?? [])
      .filter((course) => {
        const ownerId = String(course?.ownerId ?? "").trim();
        const createdBy = String(course?.createdBy ?? "").trim();
        return ownerId === currentUserId || createdBy === currentUserId;
      })
      .map((course) => String(course?.id ?? ""))
      .filter(Boolean);
  }, [courses, currentUserId, roleLabel]);

  useEffect(() => {
    if (!isFirebaseConfigured || !db || !authUser?.uid) {
      setLoadError("Firebase is not configured.");
      setProgressRows([]);
      setStudentNamesById({});
      setIsLoading(false);
      setIsRefreshing(false);
      return undefined;
    }

    setIsLoading(true);
    setLoadError("");
    const unsubscribers = [];
    let hasEmitted = false;

    const pushRows = (rows = []) => {
      const sortedRows = [...rows].sort((a, b) => {
        const aUpdatedAt = a?.updatedAt?.seconds ?? 0;
        const bUpdatedAt = b?.updatedAt?.seconds ?? 0;
        return bUpdatedAt - aUpdatedAt;
      });
      setProgressRows(sortedRows);
      if (!hasEmitted) {
        hasEmitted = true;
        setIsLoading(false);
      }
      setIsRefreshing(false);
    };

    if (roleLabel === "admin") {
      const unsubscribe = onSnapshot(
        collection(db, "enrollments"),
        (snapshot) => {
          const rows = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() ?? {}),
          }));
          pushRows(rows);
        },
        (error) => {
          setLoadError(error?.message || "Unable to load student progress.");
          setIsLoading(false);
          setIsRefreshing(false);
        }
      );
      unsubscribers.push(unsubscribe);
    } else if (roleLabel === "teacher") {
      if (teacherCourseIds.length === 0) {
        setProgressRows([]);
        setIsLoading(false);
        setIsRefreshing(false);
        return undefined;
      }

      const idChunks = chunk(teacherCourseIds, 10);
      const rowsById = new Map();
      const recompute = () => pushRows(Array.from(rowsById.values()));

      idChunks.forEach((courseIds) => {
        const enrollmentsQuery = query(
          collection(db, "enrollments"),
          where("courseId", "in", courseIds)
        );
        const unsubscribe = onSnapshot(
          enrollmentsQuery,
          (snapshot) => {
            const currentChunkCourseIds = new Set(courseIds);
            Array.from(rowsById.entries()).forEach(([rowId, row]) => {
              const rowCourseId = String(row?.courseId ?? "");
              if (currentChunkCourseIds.has(rowCourseId)) {
                rowsById.delete(rowId);
              }
            });

            snapshot.docs.forEach((docSnap) => {
              rowsById.set(docSnap.id, {
                id: docSnap.id,
                ...(docSnap.data() ?? {}),
              });
            });
            recompute();
          },
          (error) => {
            setLoadError(error?.message || "Unable to load student progress.");
            setIsLoading(false);
            setIsRefreshing(false);
          }
        );
        unsubscribers.push(unsubscribe);
      });
    } else {
      setProgressRows([]);
      setIsLoading(false);
      setIsRefreshing(false);
      return undefined;
    }

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe?.());
    };
  }, [authUser?.uid, refreshTick, roleLabel, teacherCourseIds]);

  useEffect(() => {
    let isActive = true;

    const loadStudentNames = async () => {
      const studentIds = Array.from(
        new Set(
          (progressRows ?? [])
            .map((row) => String(row?.userId ?? "").trim())
            .filter(Boolean)
        )
      );

      const nextStudentMap = {};
      for (const studentId of studentIds) {
        try {
          const userSnapshot = await getDoc(doc(db, "users", studentId));
          const userData = userSnapshot.exists() ? userSnapshot.data() : {};
          const fullName = [userData?.firstName, userData?.lastName]
            .filter(Boolean)
            .join(" ")
            .trim();
          nextStudentMap[studentId] =
            String(userData?.displayName ?? "").trim() || fullName || studentId;
        } catch {
          nextStudentMap[studentId] = studentId;
        }
      }

      if (isActive) {
        setStudentNamesById(nextStudentMap);
      }
    };

    loadStudentNames();

    return () => {
      isActive = false;
    };
  }, [progressRows]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setIsLoading(true);
    setRefreshTick((previous) => previous + 1);
  }, []);

  const selectableCourseIds = useMemo(() => {
    if (roleLabel === "admin") {
      return Array.from(
        new Set(
          (courses ?? [])
            .map((course) => String(course?.id ?? "").trim())
            .filter(Boolean)
        )
      );
    }

    return teacherCourseIds;
  }, [courses, roleLabel, teacherCourseIds]);

  const selectableCategoryIds = useMemo(
    () =>
      Array.from(
        new Set(
          selectableCourseIds
            .map((courseId) => String(courseById?.[courseId]?.categoryId ?? "").trim())
            .filter(Boolean)
        )
      ),
    [courseById, selectableCourseIds]
  );

  const selectableCategories = useMemo(
    () =>
      (categories ?? [])
        .filter((category) => selectableCategoryIds.includes(String(category?.id ?? "")))
        .map((category) => ({
          id: String(category?.id ?? ""),
          title: String(category?.categoryTitle ?? "Untitled Category"),
        }))
        .sort((a, b) => String(a.title).localeCompare(String(b.title))),
    [categories, selectableCategoryIds]
  );

  const selectableCourses = useMemo(
    () =>
      selectableCourseIds
        .filter((courseId) => {
          if (selectedCategoryId === ALL_OPTION_ID) {
            return true;
          }

          return (
            String(courseById?.[courseId]?.categoryId ?? "") === String(selectedCategoryId)
          );
        })
        .map((courseId) => ({
          id: courseId,
          title: courseById?.[courseId]?.courseTitle || courseId,
        }))
        .sort((a, b) => String(a.title).localeCompare(String(b.title))),
    [courseById, selectableCourseIds, selectedCategoryId]
  );

  useEffect(() => {
    if (selectedCourseId === ALL_OPTION_ID) {
      return;
    }

    const isSelectedCourseStillVisible = selectableCourses.some(
      (course) => String(course.id) === String(selectedCourseId)
    );

    if (!isSelectedCourseStillVisible) {
      setSelectedCourseId(ALL_OPTION_ID);
    }
  }, [selectableCourses, selectedCourseId]);

  const filteredRows = useMemo(() => {
    const scopedRows = (progressRows ?? []).filter((item) => {
      const rowCourseId = String(item?.courseId ?? "");
      const rowCourse = courseById?.[rowCourseId];
      const rowCategoryId = String(rowCourse?.categoryId ?? "");

      if (selectedCategoryId !== ALL_OPTION_ID && rowCategoryId !== String(selectedCategoryId)) {
        return false;
      }

      if (selectedCourseId === ALL_OPTION_ID) {
        return true;
      }

      return rowCourseId === String(selectedCourseId);
    });

    return scopedRows.filter((item) => {
      const progressPercent = Number(item?.progressPercent ?? 0) || 0;

      if (completionFilter === "not-started") {
        return progressPercent <= 0;
      }

      if (completionFilter === "in-progress") {
        return progressPercent > 0 && progressPercent < 100;
      }

      if (completionFilter === "completed") {
        return progressPercent >= 100;
      }

      return true;
    });
  }, [completionFilter, courseById, progressRows, selectedCategoryId, selectedCourseId]);

  const selectedCourseLabel = useMemo(() => {
    if (selectedCourseId === ALL_OPTION_ID) {
      return "All Courses";
    }

    return (
      selectableCourses.find((course) => String(course.id) === String(selectedCourseId))
        ?.title || "Select Course"
    );
  }, [selectableCourses, selectedCourseId]);

  const selectedCategoryLabel = useMemo(() => {
    if (selectedCategoryId === ALL_OPTION_ID) {
      return "All Categories";
    }

    return (
      selectableCategories.find((category) => String(category.id) === String(selectedCategoryId))
        ?.title || "Select Category"
    );
  }, [selectableCategories, selectedCategoryId]);

  return {
    completionFilter,
    filteredRows,
    isLoading,
    isRefreshing,
    loadError,
    onRefresh,
    roleLabel,
    selectableCategories,
    selectableCourses,
    selectedCategoryLabel,
    selectedCourseLabel,
    setCompletionFilter,
    setSelectedCategoryId,
    setSelectedCourseId,
    studentNamesById,
  };
};
