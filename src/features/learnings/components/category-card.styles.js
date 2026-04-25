import styled from "styled-components/native";

export const CategoryCard = styled.TouchableOpacity`
  position: relative;
  aspect-ratio: 1;
  min-height: 160px;
  border-radius: 20px;
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.ui.quaternary};
`;

export const CategoryCardCover = styled.Image`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.ui.quaternary};
`;

export const CardOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: ${(props) => props.theme.space[3]};
`;

export const Title = styled.Text`
  margin-bottom: ${(props) => props.theme.space[0]};
  color: ${(props) => props.theme.colors.text.primary};
  font-family: ${(props) => props.theme.fonts.heading};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  font-size: ${(props) => props.theme.fontSizes.button};
  line-height: 19px;
`;

export const CourseText = styled.Text`
  color: ${(props) => props.theme.colors.text.disabled};
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.caption};
`;
