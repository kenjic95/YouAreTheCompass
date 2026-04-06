import styled from "styled-components/native";
import { Card } from "react-native-paper";

export const CourseCard = styled(Card)`
  background-color: ${(props) => props.theme.colors.ui.quaternary};
  overflow: hidden;
`;

export const CourseCardLayout = styled.View`
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  height: 230px;
  padding: ${(props) => props.theme.space[3]};
`;

export const CourseCardImage = styled.Image`
  width: 48%;
  height: 100%;
  margin-left: ${(props) => props.theme.space[1]};
  border-radius: 24px;
  background-color: ${(props) => props.theme.colors.ui.tertiary};
`;

export const CourseTitle = styled.Text`
  font-family: ${(props) => props.theme.fonts.title};
  font-size: ${(props) => props.theme.fontSizes.body};
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
`;

export const PriceRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${(props) => props.theme.space[1]};
`;

export const BoughtBadge = styled.View`
  margin-left: ${(props) => props.theme.space[2]};
  padding-horizontal: ${(props) => props.theme.space[2]};
  padding-vertical: ${(props) => props.theme.space[1]};
  border-radius: 12px;
  background-color: #e8f8ee;
  flex-direction: row;
  align-items: center;
`;

export const BoughtText = styled.Text`
  margin-left: ${(props) => props.theme.space[1]};
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.caption};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  color: ${(props) => props.theme.colors.text.success};
`;

export const CartBadge = styled.View`
  margin-left: ${(props) => props.theme.space[2]};
  padding-horizontal: ${(props) => props.theme.space[2]};
  padding-vertical: ${(props) => props.theme.space[1]};
  border-radius: 12px;
  background-color: #e7f1fb;
  flex-direction: row;
  align-items: center;
`;

export const CartText = styled.Text`
  margin-left: ${(props) => props.theme.space[1]};
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.caption};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  color: #2a6da8;
`;

export const Info = styled.View`
  flex: 1;
  align-items: flex-start;
  justify-content: space-between;
  padding-right: ${(props) => props.theme.space[2]};
  padding-bottom: ${(props) => props.theme.space[3]};
  background-color: transparent;
`;

export const StatsRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${(props) => props.theme.space[1]};
  margin-bottom: ${(props) => props.theme.space[1]};
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
