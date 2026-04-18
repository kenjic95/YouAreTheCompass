import React from "react";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { Text } from "../../../components/typography/text.component";

const CompactImage = styled.Image`
  border-radius: 10px;
  width: 120px;
  height: 100px;
`;

const ImageWrap = styled.View`
  position: relative;
`;

const CompletedBadge = styled.View`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border-radius: 11px;
  background-color: #2f9e5a;
  align-items: center;
  justify-content: center;
`;

const Item = styled.View`
  padding: 10px;
  max-width: 120px;
  align-items: center;
`;

const CourseTitle = styled(Text)`
  text-align: center;
`;

export const CompactCourseInfo = ({ course, isCompleted = false }) => {
  const courseTitle = course?.courseTitle ?? "Course";
  const coursePhoto = Array.isArray(course?.coursePhoto)
    ? course.coursePhoto[0]
    : course?.coursePhoto;

  return (
    <Item>
      <ImageWrap>
        <CompactImage source={{ uri: coursePhoto }} />
        {isCompleted ? (
          <CompletedBadge>
            <Ionicons name="checkmark" size={14} color="#fff" />
          </CompletedBadge>
        ) : null}
      </ImageWrap>
      <CourseTitle variant="caption" numberOfLines={3}>
        {courseTitle}
      </CourseTitle>
    </Item>
  );
};
