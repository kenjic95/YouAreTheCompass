import styled from "styled-components/native";
import { Card } from "react-native-paper";

export const HomeCard = styled(Card)`
  background-color: ${(props) => props.theme.colors.bg.secondary};
`;

export const HomeCardCover = styled(Card.Cover)`
  padding: ${(props) => props.theme.space[3]};
  background-color: ${(props) => props.theme.colors.bg.secondary};
`;

export const Description = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.caption};
`;

export const Info = styled.View`
  padding-top: ${(props) => props.theme.space[0]};
  padding-right: ${(props) => props.theme.space[3]};
  padding-bottom: ${(props) => props.theme.space[3]};
  padding-left: ${(props) => props.theme.space[3]};
`;
