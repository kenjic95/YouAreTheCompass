import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../../../services/auth/firebase";
import { useUserProfile } from "../../../services/auth/user-profile.context";
import { useCourseCatalog } from "../../../services/learnings/course-catalog.context";
import { useCategoryCatalog } from "../../../services/learnings/category-catalog.context";
import { Text } from "../../../components/typography/text.component";

const chunk = (items = [], size = 10) => {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

const formatPercent = (value) => `${Math.max(0, Math.min(100, Number(value) || 0))}%`;
const COMPLETION_FILTERS = [
  { id: "all", label: "All" },
  { id: "not-started", label: "Not Started" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

export const StudentProgressScreen = () => {
  const { authUser, role } = useUserProfile();
  const { courses } = useCourseCatalog();
  const { categories } = useCategoryCatalog();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [progressRows, setProgressRows] = useState([]);
  const [studentNamesById, setStudentNamesById] = useState({});
  const [loadError, setLoadError] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [completionFilter, setCompletionFilter] = useState("all");
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

      if (!isActive) {
        return;
      }
      setStudentNamesById(nextStudentMap);
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
        .filter((category) =>
          selectableCategoryIds.includes(String(category?.id ?? ""))
        )
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
          if (selectedCategoryId === "all") {
            return true;
          }

          return (
            String(courseById?.[courseId]?.categoryId ?? "") ===
            String(selectedCategoryId)
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
    if (selectedCourseId === "all") {
      return;
    }

    const isSelectedCourseStillVisible = selectableCourses.some(
      (course) => String(course.id) === String(selectedCourseId)
    );

    if (!isSelectedCourseStillVisible) {
      setSelectedCourseId("all");
    }
  }, [selectableCourses, selectedCourseId]);

  const filteredRows = useMemo(() => {
    const scopedRows = (progressRows ?? []).filter((item) => {
      const rowCourseId = String(item?.courseId ?? "");
      const rowCourse = courseById?.[rowCourseId];
      const rowCategoryId = String(rowCourse?.categoryId ?? "");

      if (
        selectedCategoryId !== "all" &&
        rowCategoryId !== String(selectedCategoryId)
      ) {
        return false;
      }

      if (selectedCourseId === "all") {
        return true;
      }

      return rowCourseId === String(selectedCourseId);
    });

    return scopedRows.filter((item) => {
      const progressPercent = Number(item?.progressPercent ?? 0) || 0;

      let matchesCompletion = true;
      if (completionFilter === "not-started") {
        matchesCompletion = progressPercent <= 0;
      } else if (completionFilter === "in-progress") {
        matchesCompletion = progressPercent > 0 && progressPercent < 100;
      } else if (completionFilter === "completed") {
        matchesCompletion = progressPercent >= 100;
      }

      return matchesCompletion;
    });
  }, [completionFilter, courseById, progressRows, selectedCategoryId, selectedCourseId]);

  const selectedCourseLabel = useMemo(() => {
    if (selectedCourseId === "all") {
      return "All Courses";
    }

    return (
      selectableCourses.find((course) => String(course.id) === String(selectedCourseId))
        ?.title || "Select Course"
    );
  }, [selectableCourses, selectedCourseId]);

  const selectedCategoryLabel = useMemo(() => {
    if (selectedCategoryId === "all") {
      return "All Categories";
    }

    return (
      selectableCategories.find(
        (category) => String(category.id) === String(selectedCategoryId)
      )?.title || "Select Category"
    );
  }, [selectableCategories, selectedCategoryId]);

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextWrap}>
          <Text variant="title" style={styles.title}>
            Student Progress
          </Text>
          <Text variant="caption" style={styles.subtitle}>
            {roleLabel === "admin"
              ? "Showing all student enrollments and progress."
              : "Showing student progress for your courses."}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onRefresh}
          style={styles.refreshButton}
        >
          <Text variant="caption" style={styles.refreshButtonText}>
            Refresh
          </Text>
        </TouchableOpacity>
      </View>

      {loadError ? (
        <Text variant="caption" style={styles.errorText}>
          {loadError}
        </Text>
      ) : null}

      <View style={styles.filtersWrap}>
        <View style={styles.inlineDropdownRow}>
          <View style={styles.inlineDropdownItem}>
            <Text variant="label" style={styles.sectionLabel}>
              Category
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setIsCategoryDropdownOpen(true)}
              style={styles.dropdownButton}
            >
              <Text
                variant="caption"
                style={styles.dropdownButtonText}
                numberOfLines={1}
              >
                {selectedCategoryLabel}
              </Text>
              <Text variant="caption" style={styles.dropdownChevron}>
                ▾
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inlineDropdownItem}>
            <Text variant="label" style={styles.sectionLabel}>
              Course
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setIsCourseDropdownOpen(true)}
              style={styles.dropdownButton}
            >
              <Text
                variant="caption"
                style={styles.dropdownButtonText}
                numberOfLines={1}
              >
                {selectedCourseLabel}
              </Text>
              <Text variant="caption" style={styles.dropdownChevron}>
                ▾
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text variant="label" style={styles.sectionLabel}>
          Completion
        </Text>
        <View style={styles.completionFilterRow}>
          {COMPLETION_FILTERS.map((filter) => {
            const isActive = completionFilter === filter.id;
            return (
              <TouchableOpacity
                key={filter.id}
                activeOpacity={0.85}
                onPress={() => setCompletionFilter(filter.id)}
                style={[
                  styles.filterChip,
                  isActive ? styles.filterChipActive : null,
                ]}
              >
                <Text
                  variant="caption"
                  style={[
                    styles.filterChipText,
                    isActive ? styles.filterChipTextActive : null,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FlatList
        data={filteredRows}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text variant="caption" style={styles.emptyText}>
            {isLoading
              ? "Loading student progress..."
              : "No students match this course/completion filter."}
          </Text>
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          filteredRows.length > 0 ? (
            <View style={styles.tableHeaderRow}>
              <Text variant="caption" style={[styles.tableHeaderText, styles.studentColumn]}>
                Student
              </Text>
              <Text variant="caption" style={[styles.tableHeaderText, styles.progressColumn]}>
                Progress
              </Text>
              <Text variant="caption" style={[styles.tableHeaderText, styles.statusColumn]}>
                Status
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const studentId = String(item?.userId ?? "");
          const studentName = studentNamesById?.[studentId] || studentId || "Unknown";
          const completed = Number(item?.completedContentCount ?? 0) || 0;
          const total = Number(item?.totalContentCount ?? 0) || 0;
          const progressPercent = Number(item?.progressPercent ?? 0) || 0;
          const statusLabel =
            progressPercent <= 0
              ? "Not Started"
              : progressPercent >= 100
              ? "Completed"
              : "In Progress";

          return (
            <View style={styles.tableRow}>
              <Text
                variant="caption"
                numberOfLines={1}
                style={[styles.tableCellText, styles.studentColumn]}
              >
                {studentName}
              </Text>
              <Text variant="caption" style={[styles.tableCellText, styles.progressColumn]}>
                {formatPercent(progressPercent)} ({completed}/{total})
              </Text>
              <Text variant="caption" style={[styles.tableCellText, styles.statusColumn]}>
                {statusLabel}
              </Text>
            </View>
          );
        }}
      />

      <Modal
        transparent
        visible={isCategoryDropdownOpen}
        animationType="fade"
        onRequestClose={() => setIsCategoryDropdownOpen(false)}
      >
        <Pressable
          style={styles.dropdownBackdrop}
          onPress={() => setIsCategoryDropdownOpen(false)}
        >
          <Pressable style={styles.dropdownPanel}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setSelectedCategoryId("all");
                setSelectedCourseId("all");
                setIsCategoryDropdownOpen(false);
              }}
              style={styles.dropdownOption}
            >
              <Text variant="caption" style={styles.dropdownOptionText}>
                All Categories
              </Text>
            </TouchableOpacity>
            {selectableCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                activeOpacity={0.85}
                onPress={() => {
                  setSelectedCategoryId(category.id);
                  setSelectedCourseId("all");
                  setIsCategoryDropdownOpen(false);
                }}
                style={styles.dropdownOption}
              >
                <Text variant="caption" style={styles.dropdownOptionText}>
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        transparent
        visible={isCourseDropdownOpen}
        animationType="fade"
        onRequestClose={() => setIsCourseDropdownOpen(false)}
      >
        <Pressable
          style={styles.dropdownBackdrop}
          onPress={() => setIsCourseDropdownOpen(false)}
        >
          <Pressable style={styles.dropdownPanel}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setSelectedCourseId("all");
                setIsCourseDropdownOpen(false);
              }}
              style={styles.dropdownOption}
            >
              <Text variant="caption" style={styles.dropdownOptionText}>
                All Courses
              </Text>
            </TouchableOpacity>
            {selectableCourses.map((course) => (
              <TouchableOpacity
                key={course.id}
                activeOpacity={0.85}
                onPress={() => {
                  setSelectedCourseId(course.id);
                  setIsCourseDropdownOpen(false);
                }}
                style={styles.dropdownOption}
              >
                <Text variant="caption" style={styles.dropdownOptionText}>
                  {course.title}
                </Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F6FBFF",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    color: "#1e4565",
    marginBottom: 6,
  },
  subtitle: {
    color: "#4b6780",
  },
  refreshButton: {
    backgroundColor: "#E5F0FB",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#D7E6F3",
  },
  refreshButtonText: {
    color: "#31628A",
  },
  filtersWrap: {
    marginBottom: 10,
  },
  inlineDropdownRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 2,
  },
  inlineDropdownItem: {
    flex: 1,
  },
  sectionLabel: {
    color: "#1f4d72",
    marginBottom: 8,
  },
  dropdownButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D7E6F3",
    borderRadius: 10,
    minHeight: 42,
    paddingHorizontal: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownButtonText: {
    color: "#2D5675",
    flex: 1,
    marginRight: 10,
  },
  dropdownChevron: {
    color: "#5E7F99",
    fontSize: 14,
  },
  completionFilterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#E5F0FB",
  },
  filterChipActive: {
    backgroundColor: "#4F9FE2",
  },
  filterChipText: {
    color: "#31628A",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  errorText: {
    color: "#b53b3b",
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  emptyText: {
    color: "#526f86",
    marginTop: 12,
  },
  tableHeaderRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#D7E6F3",
    backgroundColor: "#EDF6FF",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tableHeaderText: {
    color: "#29516f",
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E3EEF8",
    backgroundColor: "#FFFFFF",
  },
  tableCellText: {
    color: "#355971",
  },
  studentColumn: {
    flex: 1.4,
    marginRight: 8,
  },
  progressColumn: {
    flex: 1.2,
    marginRight: 8,
  },
  statusColumn: {
    flex: 1,
  },
  dropdownBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.28)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  dropdownPanel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    maxHeight: "70%",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D7E6F3",
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF3F9",
  },
  dropdownOptionText: {
    color: "#2D5675",
  },
});
