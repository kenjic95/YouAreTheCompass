import styled from "styled-components/native";
import { Card } from "react-native-paper";

export const AlbumCard = styled(Card)`
  background-color: ${(props) => props.theme.colors.bg.secondary};
`;

export const AlbumCardCover = styled(Card.Cover)`
  padding: ${(props) => props.theme.space[3]};
  background-color: ${(props) => props.theme.colors.bg.secondary};
`;
export const CoverContainer = styled.View`
  position: relative;
`;
export const LockIcon = styled.View`
  position: absolute;
  top: ${(props) => props.theme.space[2]};
  right: ${(props) => props.theme.space[2]};
  padding-right: ${(props) => props.theme.space[1]};
`;
export const Title = styled.Text`
  font-family: ${(props) => props.theme.fonts.title};
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  color: ${(props) => props.theme.colors.ui.primary};
`;
export const Info = styled.View`
  padding: ${(props) => props.theme.space[3]};
`;

export const Description = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.caption};
`;
