import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../../../services/auth/firebase";
import { useUserProfile } from "../../../services/auth/user-profile.context";
import { useCourseCatalog } from "../../../services/learnings/course-catalog.context";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [progressRows, setProgressRows] = useState([]);
  const [studentNamesById, setStudentNamesById] = useState({});
  const [loadError, setLoadError] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const [completionFilter, setCompletionFilter] = useState("all");

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
      .filter((course) => String(course?.ownerId ?? "") === currentUserId)
      .map((course) => String(course?.id ?? ""))
      .filter(Boolean);
  }, [courses, currentUserId, roleLabel]);

  const loadProgress = useCallback(async () => {
    if (!isFirebaseConfigured || !db || !authUser?.uid) {
      setLoadError("Firebase is not configured.");
      setProgressRows([]);
      setStudentNamesById({});
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    setLoadError("");
    const nextRows = [];

    try {
      if (roleLabel === "admin") {
        const snapshot = await getDocs(collection(db, "enrollments"));
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() ?? {};
          nextRows.push({ id: docSnap.id, ...data });
        });
      } else if (roleLabel === "teacher") {
        if (teacherCourseIds.length === 0) {
          setProgressRows([]);
          setStudentNamesById({});
          setIsLoading(false);
          setIsRefreshing(false);
          return;
        }

        const idChunks = chunk(teacherCourseIds, 10);
        for (const courseIds of idChunks) {
          const enrollmentsQuery = query(
            collection(db, "enrollments"),
            where("courseId", "in", courseIds)
          );
          const snapshot = await getDocs(enrollmentsQuery);
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() ?? {};
            nextRows.push({ id: docSnap.id, ...data });
          });
        }
      } else {
        setProgressRows([]);
        setStudentNamesById({});
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      const sortedRows = nextRows.sort((a, b) => {
        const aUpdatedAt = a?.updatedAt?.seconds ?? 0;
        const bUpdatedAt = b?.updatedAt?.seconds ?? 0;
        return bUpdatedAt - aUpdatedAt;
      });
      setProgressRows(sortedRows);

      const studentIds = Array.from(
        new Set(sortedRows.map((row) => String(row?.userId ?? "")).filter(Boolean))
      );
      const nextStudentMap = {};
      for (const studentId of studentIds) {
        const userSnapshot = await getDoc(doc(db, "users", studentId));
        const userData = userSnapshot.exists() ? userSnapshot.data() : {};
        const fullName = [userData?.firstName, userData?.lastName]
          .filter(Boolean)
          .join(" ")
          .trim();
        nextStudentMap[studentId] =
          String(userData?.displayName ?? "").trim() || fullName || studentId;
      }
      setStudentNamesById(nextStudentMap);
    } catch (error) {
      setLoadError(error?.message || "Unable to load student progress.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [authUser?.uid, roleLabel, teacherCourseIds]);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      loadProgress();
    }, [loadProgress])
  );

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadProgress();
  }, [loadProgress]);

  const selectableCourseIds = useMemo(() => {
    if (roleLabel === "admin") {
      return Array.from(
        new Set(
          (progressRows ?? [])
            .map((row) => String(row?.courseId ?? "").trim())
            .filter(Boolean)
        )
      );
    }

    return teacherCourseIds;
  }, [progressRows, roleLabel, teacherCourseIds]);

  const selectableCourses = useMemo(
    () =>
      selectableCourseIds
        .map((courseId) => ({
          id: courseId,
          title: courseById?.[courseId]?.courseTitle || courseId,
        }))
        .sort((a, b) => String(a.title).localeCompare(String(b.title))),
    [courseById, selectableCourseIds]
  );

  const filteredRows = useMemo(() => {
    const scopedRows = (progressRows ?? []).filter((item) => {
      if (selectedCourseId === "all") {
        return true;
      }

      return String(item?.courseId ?? "") === String(selectedCourseId);
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
  }, [completionFilter, progressRows, selectedCourseId]);

  return (
    <View style={styles.screen}>
      <Text variant="title" style={styles.title}>
        Student Progress
      </Text>
      <Text variant="caption" style={styles.subtitle}>
        {roleLabel === "admin"
          ? "Showing all student enrollments and progress."
          : "Showing student progress for your courses."}
      </Text>

      {loadError ? (
        <Text variant="caption" style={styles.errorText}>
          {loadError}
        </Text>
      ) : null}

      <View style={styles.filtersWrap}>
        <Text variant="label" style={styles.sectionLabel}>
          Course
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.courseChipRow}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setSelectedCourseId("all")}
            style={[
              styles.filterChip,
              selectedCourseId === "all" ? styles.filterChipActive : null,
            ]}
          >
            <Text
              variant="caption"
              style={[
                styles.filterChipText,
                selectedCourseId === "all" ? styles.filterChipTextActive : null,
              ]}
            >
              All Courses
            </Text>
          </TouchableOpacity>
          {selectableCourses.map((course) => {
            const isActive = selectedCourseId === course.id;
            return (
              <TouchableOpacity
                key={course.id}
                activeOpacity={0.85}
                onPress={() => setSelectedCourseId(course.id)}
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
                  {course.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

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
  title: {
    color: "#1e4565",
    marginBottom: 6,
  },
  subtitle: {
    color: "#4b6780",
    marginBottom: 12,
  },
  filtersWrap: {
    marginBottom: 10,
  },
  sectionLabel: {
    color: "#1f4d72",
    marginBottom: 8,
  },
  courseChipRow: {
    paddingBottom: 6,
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
});
