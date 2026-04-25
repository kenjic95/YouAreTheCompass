import React, { useMemo } from "react";
import { Alert } from "react-native";

import { useUserProfile } from "../../../services/auth/user-profile.context";
import { ManageCoursesContent } from "../components/manage-courses-content.component";
import { useCourseCatalog } from "../../../services/learnings/course-catalog.context";
import { useCategoryCatalog } from "../../../services/learnings/category-catalog.context";

const DEV_FORCE_CREATOR_UI =
  String(process.env.EXPO_PUBLIC_DEV_FORCE_CREATOR_UI ?? "").toLowerCase() ===
  "true";

export const ManageCoursesScreen = ({ navigation }) => {
  const { categories, addCategory, deleteCategory } = useCategoryCatalog();
  const { courses, deleteCourse } = useCourseCatalog();
  const { authUser, role, isCreator } = useUserProfile();
  const currentUserId = authUser?.uid;
  const canAccessCreator = DEV_FORCE_CREATOR_UI || isCreator;
  const canManageCategories = DEV_FORCE_CREATOR_UI || role === "admin";

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
    const countsByCategoryId = visibleCourses.reduce((accumulator, course) => {
      const categoryId = course?.categoryId;
      if (!categoryId) {
        return accumulator;
      }

      const currentCount = accumulator.get(categoryId) ?? 0;
      accumulator.set(categoryId, currentCount + 1);
      return accumulator;
    }, new Map());

    return (categories ?? [])
      .map((category) => ({
        id: category?.id,
        title: category?.categoryTitle ?? `Category ${category?.id}`,
        count: countsByCategoryId.get(category?.id) ?? 0,
      }))
      .sort((a, b) => String(a.title).localeCompare(String(b.title)));
  }, [categories, visibleCourses]);

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

  const emptyMessage =
    role === "teacher"
      ? "No courses assigned to this teacher account yet."
      : "No courses found.";

  const handleEditCourse = (course) => {
    if (!course?.id) {
      return;
    }

    navigation.navigate("CreateCourse", {
      editCourseId: course.id,
    });
  };

  const handleDeleteCourse = (course) => {
    if (!course?.id) {
      return;
    }

    Alert.alert(
      "Delete course",
      `Delete "${course.courseTitle}"? This will remove it from student course lists.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const didDelete = await deleteCourse(course.id);
            if (!didDelete) {
              Alert.alert(
                "Delete failed",
                "Unable to delete this course right now."
              );
            }
          },
        },
      ]
    );
  };

  const handleEditCourseContent = (course) => {
    if (!course?.id) {
      return;
    }

    navigation.navigate("CourseContentUpload", {
      editCourseId: course.id,
    });
  };

  const handleDeleteCategory = (category) => {
    if (!category?.id) {
      return;
    }

    if (Number(category?.count) > 0) {
      Alert.alert(
        "Category in use",
        `You can't delete "${category.title}" while it has ${category.count} course(s).`
      );
      return;
    }

    Alert.alert(
      "Delete category",
      `Delete "${category.title}" from categories?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const didDelete = await deleteCategory(category.id);
            if (!didDelete) {
              Alert.alert(
                "Delete failed",
                "Unable to delete this category right now."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <ManageCoursesContent
      canAccessCreator={canAccessCreator}
      canManageCategories={canManageCategories}
      emptyMessage={emptyMessage}
      visibleCourses={visibleCourses}
      categoryGroups={categoryGroups}
      onUploadPress={handleUploadPress}
      onAddCategory={async (title, photoUri) => {
        if (!canManageCategories) {
          Alert.alert(
            "Access denied",
            "Only admin accounts can add categories."
          );
          return false;
        }
        const createdCategory = await addCategory(title, photoUri);
        if (!createdCategory) {
          Alert.alert(
            "Category not added",
            "Unable to create category. It may already exist or your Firestore rules blocked this action."
          );
          return false;
        }
        return true;
      }}
      onEditPress={handleEditCourse}
      onEditContentPress={handleEditCourseContent}
      onDeletePress={handleDeleteCourse}
      onDeleteCategory={(category) => {
        if (!canManageCategories) {
          Alert.alert(
            "Access denied",
            "Only admin accounts can delete categories."
          );
          return;
        }
        handleDeleteCategory(category);
      }}
    />
  );
};
