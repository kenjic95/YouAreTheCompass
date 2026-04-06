import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { CourseInfo } from "../components/course-card.components";
import { usePurchasedCourses } from "../../../services/learnings/purchased-courses.context";
import { CoursePreviewBottomSheet } from "../components/course-preview.components";
import { styles } from "../components/course-preview.styles";
import {
  coursePreviewMockContext,
  normalizeCoursePreviewType,
} from "../../../services/learnings/course-preview.mock";
import {
  formatDurationFromSeconds,
  parseDurationLabelToSeconds,
} from "../../../services/learnings/course-duration.utils";

const COURSE_PROGRESS_KEY_PREFIX = "learnings-progress";
const READ_OR_VIEW_DURATION_SECONDS = 2 * 60;

export const MyCoursePreviewScreen = ({ route }) => {
  const theme = useTheme();
  const course = route?.params?.course;
  const { cartCourses } = usePurchasedCourses();
  const [screenHeight, setScreenHeight] = useState(0);
  const [viewedContentIds, setViewedContentIds] = useState([]);
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);
  const panelTop = useRef(new Animated.Value(0)).current;
  const collapsedTop = Math.max(0, screenHeight / 3);
  const isInCart = cartCourses.some((cartCourse) => cartCourse.id === course?.id);
  const { courseContent: fallbackCourseContent } = coursePreviewMockContext;
  const courseContent = course?.courseContent ?? fallbackCourseContent;
  const courseId = course?.id;
  const progressStorageKey = courseId
    ? `${COURSE_PROGRESS_KEY_PREFIX}:${courseId}`
    : null;

  useEffect(() => {
    let isActive = true;

    const loadProgress = async () => {
      setHasLoadedProgress(false);

      if (!progressStorageKey) {
        if (isActive) {
          setViewedContentIds([]);
          setHasLoadedProgress(true);
        }
        return;
      }

      try {
        const storedValue = await AsyncStorage.getItem(progressStorageKey);
        const parsedIds = storedValue ? JSON.parse(storedValue) : [];
        const allowedIds = new Set(
          (courseContent ?? []).map((content) => content?.contentId)
        );
        const sanitizedIds = Array.isArray(parsedIds)
          ? parsedIds.filter((id) => allowedIds.has(id))
          : [];

        if (isActive) {
          setViewedContentIds(sanitizedIds);
        }
      } catch {
        if (isActive) {
          setViewedContentIds([]);
        }
      } finally {
        if (isActive) {
          setHasLoadedProgress(true);
        }
      }
    };

    loadProgress();

    return () => {
      isActive = false;
    };
  }, [courseContent, progressStorageKey]);

  useEffect(() => {
    if (!hasLoadedProgress || !progressStorageKey) {
      return;
    }

    AsyncStorage.setItem(progressStorageKey, JSON.stringify(viewedContentIds)).catch(
      () => {}
    );
  }, [hasLoadedProgress, progressStorageKey, viewedContentIds]);

  const progress = useMemo(() => {
    const normalizedContent = courseContent ?? [];
    const viewedIdsSet = new Set(viewedContentIds);
    const getContentDurationSeconds = (contentItem) => {
      const contentType = normalizeCoursePreviewType(
        contentItem?.contentType ?? contentItem?.fileFormat
      );

      if (contentType === "video") {
        return parseDurationLabelToSeconds(contentItem?.contentDuration);
      }

      if (contentType === "image" || contentType === "pdf") {
        return READ_OR_VIEW_DURATION_SECONDS;
      }

      return 0;
    };

    const totalDurationFromContentSeconds = normalizedContent.reduce(
      (total, contentItem) => total + getContentDurationSeconds(contentItem),
      0
    );
    const watchedDurationSecondsFromViewedContent = normalizedContent.reduce(
      (total, contentItem) => {
        if (!viewedIdsSet.has(contentItem?.contentId)) {
          return total;
        }

        return total + getContentDurationSeconds(contentItem);
      },
      0
    );
    const fallbackDurationSeconds = parseDurationLabelToSeconds(
      course?.courseDuration
    );
    const totalDurationSeconds =
      totalDurationFromContentSeconds > 0
        ? totalDurationFromContentSeconds
        : fallbackDurationSeconds;
    const watchedDurationSeconds =
      totalDurationFromContentSeconds > 0
        ? watchedDurationSecondsFromViewedContent
        : 0;
    const remainingDurationSeconds = Math.max(
      0,
      totalDurationSeconds - watchedDurationSeconds
    );
    const percent = totalDurationSeconds
      ? (watchedDurationSeconds / totalDurationSeconds) * 100
      : 0;

    return {
      percent,
      totalDurationLabel: formatDurationFromSeconds(totalDurationSeconds),
      watchedDurationLabel: formatDurationFromSeconds(watchedDurationSeconds),
      remainingDurationLabel: formatDurationFromSeconds(remainingDurationSeconds),
    };
  }, [course?.courseDuration, courseContent, viewedContentIds]);

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
            isPurchased={true}
            isInCart={isInCart}
            progress={progress}
            showDuration={false}
            showStats={false}
          />

          {screenHeight > 0 ? (
            <CoursePreviewBottomSheet
              course={course}
              panelTop={panelTop}
              backgroundColor={theme.colors.brand.secondary}
              screenHeight={screenHeight}
              collapsedTop={collapsedTop}
              viewedContentIds={viewedContentIds}
              onContentPress={(item) => {
                const contentId = item?.contentId;
                if (!contentId) {
                  return;
                }
                setViewedContentIds((previousIds) =>
                  previousIds.includes(contentId)
                    ? previousIds
                    : [...previousIds, contentId]
                );
              }}
            />
          ) : null}
        </View>
      </SafeArea>
    </SafeAreaProvider>
  );
};
