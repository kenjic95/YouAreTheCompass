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
  flex: 1;
  min-height: 50px;
  background-color: #4f9fe2;
  border-radius: 16px;
  padding: 14px;
  align-items: center;
  justify-content: center;
`;

export const UploadButtonText = styled.Text`
  color: #ffffff;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 16px;
`;

export const ControlsContainer = styled.View`
  padding-top: 8px;
`;

export const TopActionsRow = styled.View`
  margin: 8px 18px 16px;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const CategoryChip = styled.TouchableOpacity`
  margin-right: 8px;
  border-radius: 20px;
  min-height: 38px;
  padding-vertical: 8px;
  padding-horizontal: 12px;
  background-color: ${(props) => (props.isActive ? "#4f9fe2" : "#e5f0fb")};
  justify-content: center;
  flex-direction: row;
  align-items: center;
  align-self: center;
`;

export const CategoryChipText = styled.Text`
  color: ${(props) => (props.isActive ? "#ffffff" : "#31628a")};
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 13px;
`;

export const CategoryDeleteButton = styled.TouchableOpacity`
  margin-left: 8px;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${(props) => (props.isActive ? "#ffffff" : "#31628a")};
  align-items: center;
  justify-content: center;
`;

export const CategoryDeleteButtonText = styled.Text`
  color: ${(props) => (props.isActive ? "#4f9fe2" : "#ffffff")};
  font-size: 15px;
  line-height: 15px;
  font-weight: 700;
  margin-top: 0px;
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

export const AddCategoryPhotoButton = styled.TouchableOpacity`
  margin: 0 18px 8px;
  border-radius: 10px;
  padding: 10px 12px;
  background-color: #e5f0fb;
  align-items: center;
`;

export const AddCategoryPhotoButtonText = styled.Text`
  color: #31628a;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 13px;
`;

export const AddCategoryPhotoPreview = styled.Image`
  margin: 0 18px 8px;
  width: 100%;
  max-width: 220px;
  height: 120px;
  border-radius: 10px;
  align-self: flex-start;
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
  shadow-color: #0f2f4a;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.12;
  shadow-radius: 8px;
  elevation: 4;
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
  flex-wrap: wrap;
`;

export const Action = styled.TouchableOpacity`
  margin-right: 10px;
  border-radius: 10px;
  padding: 9px 12px;
  background-color: ${(props) =>
    props.variant === "danger" ? "#fee8e8" : "#e5f0fb"};
`;

export const ActionText = styled.Text`
  color: ${(props) => (props.variant === "danger" ? "#b53b3b" : "#31628a")};
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 12px;
`;
