import React from "react";
import { FlatList } from "react-native";
import {
  Action,
  ActionText,
  CourseCard,
  CourseMeta,
  CourseTitle,
  Header,
  Row,
  Screen,
  Subtitle,
  Title,
  UploadButton,
  UploadButtonText,
} from "./manage-courses.styles";

export const ManageCoursesContent = ({
  canAccessCreator,
  subtitle,
  emptyMessage,
  visibleCourses,
  onUploadPress,
  onEditPress,
  onViewAnalyticsPress,
}) => {
  if (!canAccessCreator) {
    return (
      <Screen>
        <Header>
          <Title>Course Creator</Title>
          <Subtitle>
            Access denied. This area is only for teacher/admin accounts.
          </Subtitle>
        </Header>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header>
        <Title>Course Creator</Title>
        <Subtitle>{subtitle}</Subtitle>
      </Header>

      <UploadButton onPress={onUploadPress}>
        <UploadButtonText>Upload New Course</UploadButtonText>
      </UploadButton>

      <FlatList
        data={visibleCourses}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<CourseMeta>{emptyMessage}</CourseMeta>}
        renderItem={({ item }) => (
          <CourseCard>
            <CourseTitle>{item.courseTitle}</CourseTitle>
            <CourseMeta>{item.author}</CourseMeta>
            <CourseMeta>Owner ID: {item.ownerId}</CourseMeta>
            <CourseMeta>{item.priceValue}</CourseMeta>
            <Row>
              <Action onPress={onEditPress}>
                <ActionText>Edit</ActionText>
              </Action>
              <Action onPress={onViewAnalyticsPress}>
                <ActionText>View Analytics</ActionText>
              </Action>
            </Row>
          </CourseCard>
        )}
      />
    </Screen>
  );
};
