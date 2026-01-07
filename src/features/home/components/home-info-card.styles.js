import styled from "styled-components/native";
import { Card } from "react-native-paper";

export const HomeCard = styled(Card)`
  background-color: ${(props) => props.theme.colors.bg.primary};
`;

export const HomeCardCover = styled(Card.Cover)`
  padding: ${(props) => props.theme.space[3]};
  background-color: ${(props) => props.theme.colors.bg.primary};
`;

export const Description = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.caption};
`;

export const Info = styled.View`
  padding: ${(props) => props.theme.space[3]};
`;
