import { KeyboardAvoidingView } from "react-native";
import styled from "styled-components/native";

export const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: #f6fbff;
`;

export const KeyboardContainer = styled(KeyboardAvoidingView)`
  flex: 1;
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
  margin-bottom: 20px;
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 14px;
  color: #4b6780;
`;

export const Label = styled.Text`
  margin-top: 14px;
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

export const PhotoPickerButton = styled.TouchableOpacity`
  border-radius: 12px;
  padding: 12px 14px;
  background-color: #e5f0fb;
  align-items: center;
`;

export const PhotoPickerButtonText = styled.Text`
  color: #31628a;
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 14px;
`;

export const PhotoPreviewCard = styled.View`
  margin-top: 10px;
  border-radius: 12px;
  border-width: 1px;
  border-color: #d7e6f3;
  background-color: #ffffff;
  padding: 10px;
`;

export const PhotoPreview = styled.Image`
  width: 100%;
  height: 150px;
  border-radius: 10px;
`;

export const PhotoMeta = styled.Text`
  margin-top: 8px;
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 13px;
  color: #4b6780;
`;

export const TypeSelectorRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const TypeOptionButton = styled.TouchableOpacity`
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 10px;
  padding: 10px 12px;
  background-color: ${(props) => (props.isActive ? "#4f9fe2" : "#e5f0fb")};
`;

export const TypeOptionText = styled.Text`
  color: ${(props) => (props.isActive ? "#ffffff" : "#31628a")};
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 13px;
`;

export const CategoryButton = styled.TouchableOpacity`
  border-radius: 12px;
  padding: 12px 14px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #d7e6f3;
`;

export const CategoryButtonText = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 15px;
  color: ${(props) => (props.isPlaceholder ? "#6d8295" : "#173851")};
`;

export const CategorySection = styled.View`
  margin-bottom: ${(props) => (props.isOpen ? "8px" : "0px")};
`;

export const CategoryList = styled.View`
  margin-top: 10px;
  border-radius: 12px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #d7e6f3;
  overflow: hidden;
`;

export const CategoryRow = styled.TouchableOpacity`
  padding: 12px 14px;
  border-bottom-width: ${(props) => (props.hasDivider ? "1px" : "0px")};
  border-bottom-color: #edf3f8;
`;

export const CategoryRowText = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 14px;
  color: #23455f;
`;

export const PrimaryButton = styled.TouchableOpacity`
  margin-top: 26px;
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
