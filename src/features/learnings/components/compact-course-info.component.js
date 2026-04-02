import React from "react";
import styled from "styled-components/native";
import { Text } from "../../../components/typography/text.component";

const CompactImage = styled.Image`
  border-radius: 10px;
  width: 120px;
  height: 100px;
`;

const Item = styled.View`
  padding: 10px;
  max-width: 120px;
  align-items: center;
`;

const CourseTitle = styled(Text)`
  text-align: center;
`;

export const CompactCourseInfo = ({ course }) => {
  const courseTitle = course?.courseTitle ?? "Course";
  const coursePhoto = Array.isArray(course?.coursePhoto)
    ? course.coursePhoto[0]
    : course?.coursePhoto;

  return (
    <Item>
      <CompactImage source={{ uri: coursePhoto }} />
      <CourseTitle variant="caption" numberOfLines={3}>
        {courseTitle}
      </CourseTitle>
    </Item>
  );
};
