import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styled from "styled-components/native";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Text } from "../../../components/typography/text.component";
import { CompactCourseInfo } from "./compact-course-info.component";

const COURSE_PROGRESS_KEY_PREFIX = "learnings-progress";

const MyCoursesWrapper = styled.View`
  padding: 0px 16px 8px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CartCourseCardWrapper = styled.View`
  position: relative;
`;

const RemoveFromCartButton = styled.TouchableOpacity`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: #d94b4b;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const MyCoursesTitle = styled.Text`
  font-family: ${(props) => props.theme.fonts.title};
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  color: ${(props) => props.theme.colors.text.primary};
`;

export const MyCoursesToggleButton = ({ isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.iconButton}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Ionicons
        name={isActive ? "school" : "school-outline"}
        size={22}
        color="#757575"
      />
    </TouchableOpacity>
  );
};

export const AddToCartToggleButton = ({ isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.iconButton}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Ionicons
        name={isActive ? "cart" : "cart-outline"}
        size={22}
        color="#757575"
      />
    </TouchableOpacity>
  );
};

export const MyCoursesBar = ({ courses, onNavigateCourse }) => {
  const [completedByCourseId, setCompletedByCourseId] = useState({});

  useEffect(() => {
    let isActive = true;

    const loadCompletionMap = async () => {
      const entries = await Promise.all(
        (courses ?? []).map(async (course) => {
          const courseId = course?.id;
          const contentIds = (course?.courseContent ?? [])
            .map((item) => item?.contentId)
            .filter(Boolean);

          if (!courseId || contentIds.length === 0) {
            return [courseId, false];
          }

          const progressKey = `${COURSE_PROGRESS_KEY_PREFIX}:${courseId}`;
          try {
            const storedValue = await AsyncStorage.getItem(progressKey);
            const parsedIds = storedValue ? JSON.parse(storedValue) : [];
            const viewedIds = new Set(
              Array.isArray(parsedIds) ? parsedIds : []
            );
            const isCompleted = contentIds.every((id) => viewedIds.has(id));
            return [courseId, isCompleted];
          } catch {
            return [courseId, false];
          }
        })
      );

      if (!isActive) {
        return;
      }

      const nextMap = {};
      entries.forEach(([courseId, isCompleted]) => {
        if (courseId) {
          nextMap[courseId] = isCompleted;
        }
      });
      setCompletedByCourseId(nextMap);
    };

    loadCompletionMap();

    return () => {
      isActive = false;
    };
  }, [courses]);

  return (
    <MyCoursesWrapper>
      <MyCoursesTitle>My Courses</MyCoursesTitle>
      <Spacer position="top" size="small">
        {courses?.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {courses.map((course) => (
              <Spacer key={course.id} position="right" size="small">
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => onNavigateCourse?.(course)}
                >
                  <CompactCourseInfo
                    course={course}
                    isCompleted={Boolean(completedByCourseId?.[course?.id])}
                  />
                </TouchableOpacity>
              </Spacer>
            ))}
          </ScrollView>
        ) : (
          <Text variant="caption">No courses yet. Buy a course to add it.</Text>
        )}
      </Spacer>
    </MyCoursesWrapper>
  );
};

export const AddToCartBar = ({ courses, onNavigateCourse, onRemoveCourse }) => {
  const [activeRemoveCourseId, setActiveRemoveCourseId] = useState(null);

  return (
    <MyCoursesWrapper>
      <MyCoursesTitle>Add to Cart</MyCoursesTitle>
      <Spacer position="top" size="small">
        {courses?.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {courses.map((course) => (
              <Spacer key={course.id} position="right" size="small">
                <CartCourseCardWrapper>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onLongPress={() => setActiveRemoveCourseId(course?.id)}
                    delayLongPress={260}
                    onPress={() => {
                      if (activeRemoveCourseId === course?.id) {
                        setActiveRemoveCourseId(null);
                        return;
                      }

                      onNavigateCourse?.(course);
                    }}
                  >
                    <CompactCourseInfo course={course} />
                  </TouchableOpacity>
                  {activeRemoveCourseId === course?.id ? (
                    <RemoveFromCartButton
                      activeOpacity={0.85}
                      onPress={() => {
                        onRemoveCourse?.(course);
                        setActiveRemoveCourseId(null);
                      }}
                    >
                      <Ionicons name="close" size={14} color="#fff" />
                    </RemoveFromCartButton>
                  ) : null}
                </CartCourseCardWrapper>
              </Spacer>
            ))}
          </ScrollView>
        ) : (
          <Text variant="caption">
            No courses in cart yet. Add one to see it here.
          </Text>
        )}
      </Spacer>
    </MyCoursesWrapper>
  );
};

export const LearningsSearchRow = ({ children }) => {
  return <Row>{children}</Row>;
};

const styles = StyleSheet.create({
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EAF2F8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
});
