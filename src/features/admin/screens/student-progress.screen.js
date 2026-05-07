import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TextInput,
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
  const [courseQuery, setCourseQuery] = useState("");
  const [studentQuery, setStudentQuery] = useState("");
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

  const filteredRows = useMemo(() => {
    const normalizedCourseQuery = courseQuery.trim().toLowerCase();
    const normalizedStudentQuery = studentQuery.trim().toLowerCase();

    return (progressRows ?? []).filter((item) => {
      const courseId = String(item?.courseId ?? "");
      const course = courseById?.[courseId];
      const courseTitle = String(course?.courseTitle ?? "").toLowerCase();
      const studentId = String(item?.userId ?? "");
      const studentName = String(
        studentNamesById?.[studentId] || studentId
      ).toLowerCase();
      const progressPercent = Number(item?.progressPercent ?? 0) || 0;

      const matchesCourse = normalizedCourseQuery
        ? courseTitle.includes(normalizedCourseQuery)
        : true;
      const matchesStudent = normalizedStudentQuery
        ? studentName.includes(normalizedStudentQuery)
        : true;

      let matchesCompletion = true;
      if (completionFilter === "not-started") {
        matchesCompletion = progressPercent <= 0;
      } else if (completionFilter === "in-progress") {
        matchesCompletion = progressPercent > 0 && progressPercent < 100;
      } else if (completionFilter === "completed") {
        matchesCompletion = progressPercent >= 100;
      }

      return matchesCourse && matchesStudent && matchesCompletion;
    });
  }, [
    completionFilter,
    courseById,
    courseQuery,
    progressRows,
    studentNamesById,
    studentQuery,
  ]);

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
        <TextInput
          value={courseQuery}
          onChangeText={setCourseQuery}
          placeholder="Filter by course title"
          placeholderTextColor="#8BA0B2"
          style={styles.filterInput}
          autoCapitalize="none"
        />
        <TextInput
          value={studentQuery}
          onChangeText={setStudentQuery}
          placeholder="Filter by student name"
          placeholderTextColor="#8BA0B2"
          style={styles.filterInput}
          autoCapitalize="none"
        />
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
              : "No progress records match your filters."}
          </Text>
        }
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const courseId = String(item?.courseId ?? "");
          const course = courseById?.[courseId];
          const studentId = String(item?.userId ?? "");
          const studentName = studentNamesById?.[studentId] || studentId || "Unknown";
          const completed = Number(item?.completedContentCount ?? 0) || 0;
          const total = Number(item?.totalContentCount ?? 0) || 0;
          const progressPercent = Number(item?.progressPercent ?? 0) || 0;

          return (
            <View style={styles.card}>
              <Text variant="label" style={styles.courseTitle}>
                {course?.courseTitle || `Course: ${courseId}`}
              </Text>
              <Text variant="caption" style={styles.metaText}>
                Student: {studentName}
              </Text>
              <Text variant="caption" style={styles.metaText}>
                Progress: {formatPercent(progressPercent)}
              </Text>
              <Text variant="caption" style={styles.metaText}>
                Completed: {completed}/{total} items
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
  filterInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D7E6F3",
    color: "#173851",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
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
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#D7E6F3",
  },
  courseTitle: {
    color: "#173851",
    marginBottom: 6,
  },
  metaText: {
    color: "#4b6780",
    marginTop: 2,
  },
});
