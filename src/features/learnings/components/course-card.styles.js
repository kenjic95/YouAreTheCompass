import styled from "styled-components/native";
import { Card } from "react-native-paper";

export const CourseCard = styled(Card)`
  background-color: ${(props) => props.theme.colors.ui.quaternary};
`;

export const CourseCardLayout = styled.View`
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  min-height: 220px;
  padding: ${(props) => props.theme.space[3]};
`;

export const CourseCardImage = styled.Image`
  width: 52%;
  align-self: stretch;
  margin-left: ${(props) => props.theme.space[1]};
  border-radius: 24px;
  background-color: ${(props) => props.theme.colors.ui.tertiary};
`;

export const CourseTitle = styled.Text`
  font-family: ${(props) => props.theme.fonts.title};
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.space[1]};
`;

export const AuthorText = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.button};
  color: ${(props) => props.theme.colors.ui.secondary};
  margin-bottom: ${(props) => props.theme.space[1]};
`;

export const DurationText = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.button};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.space[1]};
`;

export const DurationValueText = styled.Text`
  color: ${(props) => props.theme.colors.ui.secondary};
`;

export const PriceValue = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.h4};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.space[1]};
`;

export const Info = styled.View`
  flex: 1;
  align-items: flex-start;
  padding-right: ${(props) => props.theme.space[2]};
  background-color: transparent;
`;

export const StatsRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${(props) => props.theme.space[1]};
`;

export const StatItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: ${(props) => props.theme.space[3]};
`;

export const StatText = styled.Text`
  margin-left: ${(props) => props.theme.space[1]};
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.caption};
  color: ${(props) => props.theme.colors.ui.secondary};
`;
