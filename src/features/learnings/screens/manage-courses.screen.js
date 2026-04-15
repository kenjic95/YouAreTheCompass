import React from "react";
import { Alert, FlatList, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

import { courseContentMockContext } from "../../../services/learnings/course-content.mock";

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

  const showSoon = () => {
    Alert.alert("Coming soon", "Upload and edit flow will be connected next.");
  };

  return (
    <Screen>
      <Header>
        <Title>Course Creator</Title>
        <Subtitle>
          Teacher/Admin workspace for uploading and managing courses.
        </Subtitle>
      </Header>

      <UploadButton onPress={showSoon}>
        <UploadButtonText>Upload New Course</UploadButtonText>
      </UploadButton>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CourseCard>
            <CourseTitle>{item.courseTitle}</CourseTitle>
            <CourseMeta>{item.author}</CourseMeta>
            <CourseMeta>{item.priceValue}</CourseMeta>
            <Row>
              <Action onPress={showSoon}>
                <ActionText>Edit</ActionText>
              </Action>
              <Action onPress={showSoon}>
                <ActionText>View Analytics</ActionText>
              </Action>
            </Row>
          </CourseCard>
        )}
      />
    </Screen>
  );
};
