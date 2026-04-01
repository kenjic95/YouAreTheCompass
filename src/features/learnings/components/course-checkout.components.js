import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";
import {
  BackButton,
  Container,
  CourseMeta,
  CourseTitle,
  HeaderRow,
  HeaderTitle,
  InfoBox,
  InfoText,
  MetaLabel,
  MetaRow,
  MetaValue,
  PlaceOrderButton,
  PlaceOrderText,
  PriceValue,
  SectionLabel,
  SummaryCard,
} from "./course-checkout.styles";

export const CourseCheckoutContent = ({
  courseTitle,
  author,
  classDuration,
  rating,
  price,
  buyButtonColor,
  onGoBack,
  onPlaceOrder,
}) => {
  const theme = useTheme();

  return (
    <Container>
      <HeaderRow>
        <BackButton onPress={onGoBack}>
          <Ionicons
            name="arrow-back"
            size={22}
            color={theme.colors.text.primary}
          />
        </BackButton>
        <HeaderTitle>Checkout</HeaderTitle>
      </HeaderRow>

      <SummaryCard>
        <SectionLabel>Course Summary</SectionLabel>
        <CourseTitle>{courseTitle}</CourseTitle>
        <CourseMeta>By {author}</CourseMeta>

        <MetaRow>
          <MetaLabel>Duration</MetaLabel>
          <MetaValue>{classDuration}</MetaValue>
        </MetaRow>
        <MetaRow>
          <MetaLabel>Rating</MetaLabel>
          <MetaValue>{rating}</MetaValue>
        </MetaRow>
        <MetaRow>
          <MetaLabel>Price</MetaLabel>
          <PriceValue>{price}</PriceValue>
        </MetaRow>
      </SummaryCard>

      <InfoBox>
        <Ionicons
          name="information-circle-outline"
          size={18}
          color={theme.colors.text.tertiary}
        />
        <InfoText>
          This is a UI checkout flow. Payment and database will be connected
          later.
        </InfoText>
      </InfoBox>

      <PlaceOrderButton bgColor={buyButtonColor} onPress={onPlaceOrder}>
        <PlaceOrderText>PLACE ORDER</PlaceOrderText>
      </PlaceOrderButton>
    </Container>
  );
};
