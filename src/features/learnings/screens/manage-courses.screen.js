import React, { useMemo } from "react";
import { Alert, FlatList, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

import { courseContentMockContext } from "../../../services/learnings/course-content.mock";
import { useUserProfile } from "../../../services/auth/user-profile.context";

const DEV_FORCE_CREATOR_UI =
  String(process.env.EXPO_PUBLIC_DEV_FORCE_CREATOR_UI ?? "").toLowerCase() ===
  "true";

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: #f6fbff;
`;

const Header = styled.View`
  padding: 20px 18px 14px;
`;

const Title = styled.Text`
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 24px;
  color: #1e4565;
`;

const Subtitle = styled.Text`
  margin-top: 6px;
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 14px;
  color: #4b6780;
`;

const UploadButton = styled.TouchableOpacity`
  margin: 8px 18px 16px;
  background-color: #4f9fe2;
  border-radius: 16px;
  padding: 14px;
  align-items: center;
`;

const UploadButtonText = styled.Text`
  color: #ffffff;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 16px;
`;

const CourseCard = styled.View`
  margin: 0 18px 12px;
  padding: 14px;
  border-radius: 14px;
  background-color: #ffffff;
`;

const CourseTitle = styled.Text`
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 16px;
  color: #183852;
`;

const CourseMeta = styled.Text`
  margin-top: 4px;
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 13px;
  color: #526f86;
`;

const Row = styled.View`
  margin-top: 12px;
  flex-direction: row;
`;

const Action = styled(TouchableOpacity)`
  margin-right: 10px;
  border-radius: 10px;
  padding: 9px 12px;
  background-color: #e5f0fb;
`;

const ActionText = styled.Text`
  color: #31628a;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 12px;
`;

export const ManageCoursesScreen = () => {
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

    showSoon();
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

      <UploadButton onPress={handleUploadPress}>
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
              <Action
                onPress={() =>
                  showSoon("Course edit flow will be connected next.")
                }
              >
                <ActionText>Edit</ActionText>
              </Action>
              <Action
                onPress={() =>
                  showSoon("Course analytics dashboard will be connected next.")
                }
              >
                <ActionText>View Analytics</ActionText>
              </Action>
            </Row>
          </CourseCard>
        )}
      />
    </Screen>
  );
};
