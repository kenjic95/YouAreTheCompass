import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { CourseInfo } from "../components/course-card.components";
import { usePurchasedCourses } from "../../../services/learnings/purchased-courses.context";
import { useCourseCatalog } from "../../../services/learnings/course-catalog.context";
import {
  CoursePreviewActionBar,
  CoursePreviewBottomSheet,
} from "../components/course-preview.components";
import { styles } from "../components/course-preview.styles";
import { normalizeCoursePreviewType } from "../../../services/learnings/course-preview.mock";

const COURSE_PROGRESS_KEY_PREFIX = "learnings-progress";

export const CoursePreviewScreen = ({ route }) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const routeCourse = route?.params?.course;
  const selectedCategory = route?.params?.category;
  const { courses } = useCourseCatalog();
  const { purchasedCourses, cartCourses, addToCart } = usePurchasedCourses();
  const [screenHeight, setScreenHeight] = useState(0);
  const [isPrerequisiteComplete, setIsPrerequisiteComplete] = useState(null);
  const panelTop = useRef(new Animated.Value(0)).current;
  const collapsedTop = Math.max(0, screenHeight / 3);
  const course = useMemo(() => {
    const routeCourseId = routeCourse?.id;
    if (!routeCourseId) {
      return routeCourse;
    }

    const canonicalCourse = courses.find((item) => item?.id === routeCourseId);
    return canonicalCourse ?? routeCourse;
  }, [courses, routeCourse]);

  const isPurchased = purchasedCourses.some(
    (purchasedCourse) => purchasedCourse.id === course?.id
  );
  const prerequisiteCourseId = course?.prerequisiteCourseId;
  const isPrerequisitePurchased = purchasedCourses.some(
    (purchasedCourse) => purchasedCourse.id === prerequisiteCourseId
  );
  const isInCart = cartCourses.some(
    (cartCourse) => cartCourse.id === course?.id
  );
  const prerequisiteCourse = useMemo(
    () => courses.find((item) => item?.id === prerequisiteCourseId),
    [courses, prerequisiteCourseId]
  );
  const prerequisiteCourseTitle =
    prerequisiteCourse?.courseTitle ?? "Required prerequisite course";

  useEffect(() => {
    let isActive = true;

    const resolvePrerequisiteCompletion = async () => {
      if (!prerequisiteCourseId) {
        if (isActive) {
          setIsPrerequisiteComplete(true);
        }
        return;
      }

      if (!isPrerequisitePurchased) {
        if (isActive) {
          setIsPrerequisiteComplete(false);
        }
        return;
      }

      setIsPrerequisiteComplete(null);

      const requiredContentIds = (prerequisiteCourse?.courseContent ?? [])
        .map((content) => content?.contentId)
        .filter(Boolean);
      const progressStorageKey = `${COURSE_PROGRESS_KEY_PREFIX}:${prerequisiteCourseId}`;

      try {
        const storedValue = await AsyncStorage.getItem(progressStorageKey);
        const parsedIds = storedValue ? JSON.parse(storedValue) : [];
        const viewedIds = new Set(Array.isArray(parsedIds) ? parsedIds : []);
        const isComplete =
          requiredContentIds.length > 0 &&
          requiredContentIds.every((contentId) => viewedIds.has(contentId));

        if (isActive) {
          setIsPrerequisiteComplete(isComplete);
        }
      } catch {
        if (isActive) {
          setIsPrerequisiteComplete(false);
        }
      }
    };

    resolvePrerequisiteCompletion();

    return () => {
      isActive = false;
    };
  }, [
    isPrerequisitePurchased,
    prerequisiteCourse?.courseContent,
    prerequisiteCourseId,
  ]);

  const isCheckingPrerequisite =
    Boolean(prerequisiteCourseId) && isPrerequisiteComplete === null;
  const isLockedByPrerequisite =
    Boolean(prerequisiteCourseId) &&
    !isCheckingPrerequisite &&
    !isPrerequisiteComplete;
  const isCheckoutLocked = isCheckingPrerequisite || isLockedByPrerequisite;
  const isContentLocked =
    !isPurchased || isCheckingPrerequisite || isLockedByPrerequisite;
  const prerequisiteLockMessage = isCheckingPrerequisite
    ? "Checking prerequisite course progress..."
    : `Finish "${prerequisiteCourseTitle}" to unlock and buy this course.`;
  const contentLockMessage =
    isCheckingPrerequisite || isLockedByPrerequisite
      ? prerequisiteLockMessage
      : !isPurchased
      ? "Buy this course to access its content."
      : "";

  const handleLayout = ({ nativeEvent }) => {
    const nextHeight = nativeEvent.layout.height;
    setScreenHeight(nextHeight);
    panelTop.setValue(Math.max(0, nextHeight / 3));
  };

  return (
    <SafeAreaProvider>
      <SafeArea onLayout={handleLayout}>
        <View style={styles.container}>
          <CourseInfo
            course={course}
            isPurchased={isPurchased}
            isInCart={isInCart}
          />

          {screenHeight > 0 ? (
            <CoursePreviewBottomSheet
              course={course}
              panelTop={panelTop}
              backgroundColor={theme.colors.brand.secondary}
              screenHeight={screenHeight}
              collapsedTop={collapsedTop}
              isContentLocked={isContentLocked}
              lockMessage={contentLockMessage}
              onContentPress={(item) => {
                const contentType = normalizeCoursePreviewType(
                  item?.contentType ?? item?.fileFormat
                );

                if (contentType === "video") {
                  navigation.navigate("CoursePlayer", {
                    course,
                    contentItem: item,
                  });
                  return;
                }

                if (contentType === "image") {
                  navigation.navigate("CourseImageViewer", {
                    course,
                    contentItem: item,
                  });
                  return;
                }

                if (contentType === "pdf") {
                  navigation.navigate("CoursePdfViewer", {
                    course,
                    contentItem: item,
                  });
                }
              }}
            />
          ) : null}

          <CoursePreviewActionBar
            containerColor={theme.colors.brand.tertiary}
            buyButtonColor={theme.colors.brand.primary}
            buyTextColor={theme.colors.text.inverse}
            isPurchased={isPurchased}
            isInCart={isInCart}
            isLocked={isCheckoutLocked}
            onAddToCart={() =>
              !isPurchased && !isCheckoutLocked && addToCart(course)
            }
            onBuyNow={() =>
              !isPurchased &&
              !isCheckoutLocked &&
              navigation.navigate("Checkout", {
                course,
                category: selectedCategory,
              })
            }
          />
        </View>
      </SafeArea>
    </SafeAreaProvider>
  );
};
