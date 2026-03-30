import { FlatList } from "react-native";
import styled from "styled-components/native";
import { Card } from "react-native-paper";

import { Text } from "../../../components/typography/text.component";

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

export const HomeList = styled(FlatList).attrs({
  contentContainerStyle: {
    padding: 16,
  },
})``;

export const WelcomeContainer = styled.View`
  padding-top: ${(props) => props.theme.space[1]};
  padding-bottom: ${(props) => props.theme.space[1]};
  padding-left: ${(props) => props.theme.space[1]};
  padding-right: ${(props) => props.theme.space[1]};
`;

export const OpenMessage = styled(Text).attrs({
  variant: "body",
})`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-family: ${(props) => props.theme.fonts.body};
  text-align: center;
`;

export const WelcomeMessage = styled(Text).attrs({
  variant: "body",
})`
  font-size: ${(props) => props.theme.fontSizes.h3};
  font-family: ${(props) => props.theme.fonts.playball};
  color: ${(props) => props.theme.colors.ui.quaternary};
  text-align: center;
`;

export const WelcomeImage = styled.Image.attrs({
  resizeMode: "contain",
})`
  width: 100%;
  height: 260px;
  margin-top: ${(props) => props.theme.space[1]};
`;
