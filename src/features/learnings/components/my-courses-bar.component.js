import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Text } from "../../../components/typography/text.component";
import { CompactCourseInfo } from "./compact-course-info.component";

const MyCoursesWrapper = styled.View`
  padding: 10px 16px 8px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
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

export const MyCoursesBar = ({ courses, onNavigateCourse }) => {
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
                  <CompactCourseInfo course={course} />
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
