import styled from "styled-components/native";
import { SafeArea } from "../../../components/utility/safe-area.component";

export const CheckoutSafeArea = styled(SafeArea)`
  background-color: ${(props) => props.theme.colors.brand.muted};
`;

export const Container = styled.View`
  flex: 1;
  padding-horizontal: ${(props) => props.theme.space[3]};
  padding-top: ${(props) => props.theme.space[2]};
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${(props) => props.theme.space[4]};
`;

export const HeaderTitle = styled.Text`
  font-family: ${(props) => props.theme.fonts.title};
  font-size: ${(props) => props.theme.fontSizes.h5};
  color: ${(props) => props.theme.colors.text.primary};
`;

export const SummaryCard = styled.View`
  background-color: ${(props) => props.theme.colors.ui.quaternary};
  border-radius: 24px;
  padding-horizontal: ${(props) => props.theme.space[3]};
  padding-vertical: ${(props) => props.theme.space[3]};
  shadow-color: #000000;
  shadow-opacity: 0.08;
  shadow-radius: 6px;
  elevation: 4;
`;

export const SectionLabel = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.caption};
  color: ${(props) => props.theme.colors.text.tertiary};
  margin-bottom: ${(props) => props.theme.space[2]};
`;

export const CourseTitle = styled.Text`
  font-family: ${(props) => props.theme.fonts.title};
  font-size: ${(props) => props.theme.fontSizes.title};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.space[1]};
`;

export const CourseMeta = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.body};
  color: ${(props) => props.theme.colors.ui.secondary};
  margin-bottom: ${(props) => props.theme.space[3]};
`;

export const MetaRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const MetaLabel = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.body};
  color: ${(props) => props.theme.colors.text.tertiary};
`;

export const MetaValue = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.body};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  color: ${(props) => props.theme.colors.text.primary};
`;

export const PriceValue = styled.Text`
  font-family: ${(props) => props.theme.fonts.title};
  font-size: ${(props) => props.theme.fontSizes.title};
  color: ${(props) => props.theme.colors.text.secondary};
`;

export const InfoBox = styled.View`
  margin-top: ${(props) => props.theme.space[4]};
  padding-horizontal: ${(props) => props.theme.space[3]};
  padding-vertical: ${(props) => props.theme.space[2]};
  border-radius: 16px;
  background-color: ${(props) => props.theme.colors.brand.tertiary};
  flex-direction: row;
  align-items: center;
`;

export const InfoText = styled.Text`
  flex: 1;
  margin-left: ${(props) => props.theme.space[2]};
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.button};
  color: ${(props) => props.theme.colors.text.tertiary};
  line-height: ${(props) => props.theme.lineHeights.copy};
`;

export const PlaceOrderButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.85,
})`
  margin-top: auto;
  margin-bottom: ${(props) => props.theme.space[3]};
  height: 58px;
  border-radius: 29px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.bgColor ?? props.theme.colors.brand.primary};
`;

export const PlaceOrderText = styled.Text`
  color: ${(props) => props.theme.colors.text.inverse};
  font-family: ${(props) => props.theme.fonts.title};
  font-size: 18px;
  letter-spacing: 0.4px;
`;
