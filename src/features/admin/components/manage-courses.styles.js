import styled from "styled-components/native";

export const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: #f6fbff;
`;

export const AccessMessage = styled.Text`
  margin: 20px;
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 14px;
  color: #4b6780;
`;

export const Header = styled.View`
  padding: 20px 18px 14px;
`;

export const Title = styled.Text`
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 24px;
  color: #1e4565;
`;

export const Subtitle = styled.Text`
  margin-top: 6px;
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 14px;
  color: #4b6780;
`;

export const UploadButton = styled.TouchableOpacity`
  margin: 8px 18px 22px;
  background-color: #4f9fe2;
  border-radius: 16px;
  padding: 14px;
  align-items: center;
`;

export const UploadButtonText = styled.Text`
  color: #ffffff;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 16px;
`;

export const CategoryChip = styled.TouchableOpacity`
  margin-right: 8px;
  border-radius: 20px;
  min-height: 38px;
  padding-vertical: 8px;
  padding-horizontal: 12px;
  background-color: ${(props) => (props.isActive ? "#4f9fe2" : "#e5f0fb")};
  justify-content: center;
  align-self: center;
`;

export const CategoryChipText = styled.Text`
  color: ${(props) => (props.isActive ? "#ffffff" : "#31628a")};
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 13px;
`;

export const AddCategoryChip = styled.TouchableOpacity`
  margin-right: 8px;
  border-radius: 20px;
  min-height: 38px;
  min-width: 38px;
  padding-horizontal: 12px;
  background-color: #2f7fc2;
  justify-content: center;
  align-items: center;
  align-self: center;
`;

export const AddCategoryChipText = styled.Text`
  color: #ffffff;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 18px;
  line-height: 18px;
`;

export const AddCategoryRow = styled.View`
  margin: 0 18px 10px;
  flex-direction: row;
  align-items: center;
`;

export const AddCategoryInput = styled.TextInput`
  flex: 1;
  border-radius: 12px;
  padding: 10px 12px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #d7e6f3;
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 14px;
  color: #173851;
`;

export const AddCategoryAction = styled.TouchableOpacity`
  margin-left: 8px;
  border-radius: 10px;
  padding: 10px 12px;
  background-color: ${(props) =>
    props.variant === "cancel" ? "#e9eff5" : "#4f9fe2"};
`;

export const AddCategoryActionText = styled.Text`
  color: ${(props) => (props.variant === "cancel" ? "#3b6080" : "#ffffff")};
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 13px;
`;

export const CourseListHeading = styled.Text`
  margin: 0 18px 10px;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 16px;
  color: #1f4d72;
`;

export const CourseCard = styled.View`
  margin: 0 18px 12px;
  padding: 14px;
  border-radius: 14px;
  background-color: #ffffff;
`;

export const CourseTitle = styled.Text`
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 16px;
  color: #183852;
`;

export const CourseMeta = styled.Text`
  margin-top: 4px;
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 13px;
  color: #526f86;
`;

export const Row = styled.View`
  margin-top: 12px;
  flex-direction: row;
`;

export const Action = styled.TouchableOpacity`
  margin-right: 10px;
  border-radius: 10px;
  padding: 9px 12px;
  background-color: #e5f0fb;
`;

export const ActionText = styled.Text`
  color: #31628a;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 12px;
`;
