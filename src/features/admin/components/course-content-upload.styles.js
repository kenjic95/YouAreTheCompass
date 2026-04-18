import styled from "styled-components/native";

export const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: #f6fbff;
`;

export const Content = styled.ScrollView`
  flex: 1;
`;

export const Inner = styled.View`
  padding: 20px 18px 28px;
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

export const DraftCard = styled.View`
  margin-top: 14px;
  border-radius: 12px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #d7e6f3;
  padding: 12px;
`;

export const DraftText = styled.Text`
  margin-top: 2px;
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 13px;
  color: #355971;
`;

export const Label = styled.Text`
  margin-top: 16px;
  margin-bottom: 8px;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 14px;
  color: #2b4f6d;
`;

export const TextInput = styled.TextInput`
  border-radius: 12px;
  padding: 12px 14px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #d7e6f3;
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 15px;
  color: #173851;
`;

export const UploadButtonsRow = styled.View`
  margin-top: 12px;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const UploadButton = styled.TouchableOpacity`
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 10px;
  padding: 10px 12px;
  background-color: #e5f0fb;
`;

export const UploadButtonText = styled.Text`
  color: #31628a;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 13px;
`;

export const SelectedFileCard = styled.View`
  margin-top: 8px;
  border-radius: 10px;
  padding: 10px 12px;
  background-color: #edf6ff;
  border-width: 1px;
  border-color: #d4e8fb;
`;

export const SelectedFileText = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 13px;
  color: #284d67;
`;

export const PrimaryButton = styled.TouchableOpacity`
  margin-top: 16px;
  border-radius: 14px;
  padding: 14px;
  align-items: center;
  background-color: #4f9fe2;
`;

export const PrimaryButtonText = styled.Text`
  color: #ffffff;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 16px;
`;

export const UploadCourseButton = styled.TouchableOpacity`
  margin-top: 18px;
  border-radius: 14px;
  padding: 14px;
  align-items: center;
  background-color: ${(props) => (props.disabled ? "#aab7c3" : "#2f7fc2")};
`;

export const UploadCourseButtonText = styled.Text`
  color: #ffffff;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 16px;
`;

export const SectionTitle = styled.Text`
  margin-top: 24px;
  margin-bottom: 10px;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 16px;
  color: #264761;
`;

export const PartCard = styled.View`
  margin-bottom: 10px;
  border-radius: 12px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #d7e6f3;
  padding: 12px;
`;

export const PartHeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ContentIdBadge = styled.View`
  border-radius: 8px;
  padding: 4px 8px;
  background-color: #e8f3ff;
`;

export const ContentIdBadgeText = styled.Text`
  color: #24557a;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 12px;
`;

export const PartTitle = styled.Text`
  margin-top: 8px;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 14px;
  color: #173851;
`;

export const PartMeta = styled.Text`
  margin-top: 4px;
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 13px;
  color: #4b6780;
`;

export const DeleteButton = styled.TouchableOpacity`
  border-radius: 10px;
  padding: 8px 14px;
  background-color: #c73a3a;
`;

export const DeleteButtonText = styled.Text`
  color: #ffffff;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 13px;
`;
