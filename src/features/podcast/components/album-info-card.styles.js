import styled from "styled-components/native";
import { Card } from "react-native-paper";

export const AlbumCard = styled(Card)`
  background-color: ${(props) => props.theme.colors.bg.secondary};
  border-radius: 20px;
  overflow: hidden;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

export const AlbumCardCover = styled(Card.Cover)`
  height: 200px;
  background-color: ${(props) => props.theme.colors.bg.secondary};
`;

export const CoverContainer = styled.View`
  position: relative;
`;

export const PremiumBadge = styled.View`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 16px;
  padding: 8px 12px;
  flex-direction: row;
  align-items: center;
`;

export const PremiumText = styled.Text`
  color: ${(props) => props.theme.colors.text.inverse};
  font-size: ${(props) => props.theme.fontSizes.caption};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  margin-left: 4px;
`;

export const Info = styled.View`
  padding: 12px;
`;

export const Title = styled.Text`
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 20px;
  font-weight: ${(props) => props.theme.fontWeights.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 6px;
`;

export const Description = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.body};
  color: ${(props) => props.theme.colors.text.secondary};
  line-height: 22px;
`;
