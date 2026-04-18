import React, { useMemo } from "react";
import { Alert } from "react-native";

import { useUserProfile } from "../../../services/auth/user-profile.context";
import { ManageCoursesContent } from "../components/manage-courses-content.component";
import { useCourseCatalog } from "../../../services/learnings/course-catalog.context";
import { categoriesMockContext } from "../../../services/learnings/categories.mock";

const DEV_FORCE_CREATOR_UI =
  String(process.env.EXPO_PUBLIC_DEV_FORCE_CREATOR_UI ?? "").toLowerCase() ===
  "true";

export const ManageCoursesScreen = ({ navigation }) => {
  const { categories } = categoriesMockContext;
  const { courses } = useCourseCatalog();
  const { authUser, role, isCreator } = useUserProfile();
  const currentUserId = authUser?.uid;
  const canAccessCreator = DEV_FORCE_CREATOR_UI || isCreator;

  const visibleCourses = useMemo(() => {
    if (DEV_FORCE_CREATOR_UI) {
      return courses;
    }

    if (role === "admin") {
      return courses;
    }

    if (role === "teacher") {
      return courses.filter((course) => course?.ownerId === currentUserId);
    }

    return [];
  }, [courses, currentUserId, role]);

  const categoryGroups = useMemo(() => {
    const categoryTitleById = new Map(
      (categories ?? []).map((category) => [
        category?.id,
        category?.categoryTitle,
      ])
    );

    const countsByCategoryId = visibleCourses.reduce((accumulator, course) => {
      const categoryId = course?.categoryId;
      if (!categoryId) {
        return accumulator;
      }

      const currentCount = accumulator.get(categoryId) ?? 0;
      accumulator.set(categoryId, currentCount + 1);
      return accumulator;
    }, new Map());

    return Array.from(countsByCategoryId.entries())
      .map(([categoryId, courseCount]) => ({
        id: categoryId,
        title: categoryTitleById.get(categoryId) ?? `Category ${categoryId}`,
        count: courseCount,
      }))
      .sort((a, b) => String(a.title).localeCompare(String(b.title)));
  }, [categories, visibleCourses]);

  const showSoon = (
    message = "Upload and edit flow will be connected next."
  ) => {
    Alert.alert("Coming soon", message);
  };

  const handleUploadPress = () => {
    if (!canAccessCreator) {
      Alert.alert(
        "Access denied",
        "Only admin or teacher accounts can upload."
      );
      return;
    }

    navigation.navigate("CreateCourse");
  };

  const subtitle =
    role === "admin"
      ? "Admin workspace with access to all courses."
      : role === "teacher"
      ? "Teacher workspace with access to your own courses only."
      : DEV_FORCE_CREATOR_UI
      ? "Creator workspace preview (dev override enabled)."
      : "Teacher workspace with access to your own courses only.";

  const emptyMessage =
    role === "teacher"
      ? "No courses assigned to this teacher account yet."
      : "No courses found.";

  return (
    <ManageCoursesContent
      canAccessCreator={canAccessCreator}
      subtitle={subtitle}
      emptyMessage={emptyMessage}
      visibleCourses={visibleCourses}
      categoryGroups={categoryGroups}
      onUploadPress={handleUploadPress}
      onEditPress={() => showSoon("Course edit flow will be connected next.")}
      onViewAnalyticsPress={() =>
        showSoon("Course analytics dashboard will be connected next.")
      }
    />
  );
};
