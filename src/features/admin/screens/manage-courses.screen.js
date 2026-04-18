import React, { useMemo } from "react";
import { Alert } from "react-native";

import { courseContentMockContext } from "../../../services/learnings/course-content.mock";
import { useUserProfile } from "../../../services/auth/user-profile.context";
import { ManageCoursesContent } from "../components/manage-courses-content.component";

const DEV_FORCE_CREATOR_UI =
  String(process.env.EXPO_PUBLIC_DEV_FORCE_CREATOR_UI ?? "").toLowerCase() ===
  "true";

export const ManageCoursesScreen = ({ navigation }) => {
  const { courses } = courseContentMockContext;
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
      onUploadPress={handleUploadPress}
      onEditPress={() => showSoon("Course edit flow will be connected next.")}
      onViewAnalyticsPress={() =>
        showSoon("Course analytics dashboard will be connected next.")
      }
    />
  );
};
