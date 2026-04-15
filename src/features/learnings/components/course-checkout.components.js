import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";
import {
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
  originalPrice,
  discountLabel,
  buyButtonColor,
  onPlaceOrder,
}) => {
  const theme = useTheme();

  return (
    <Container>
      <HeaderRow>
        <HeaderTitle>Review Checkout</HeaderTitle>
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
        {discountLabel ? (
          <MetaRow>
            <MetaLabel>{discountLabel}</MetaLabel>
            <MetaValue>{originalPrice}</MetaValue>
          </MetaRow>
        ) : null}
      </SummaryCard>

      <InfoBox>
        <Ionicons
          name="information-circle-outline"
          size={18}
          color={theme.colors.text.tertiary}
        />
        <InfoText>price in mock data</InfoText>
      </InfoBox>

      <PlaceOrderButton bgColor={buyButtonColor} onPress={onPlaceOrder}>
        <PlaceOrderText>PLACE ORDER</PlaceOrderText>
      </PlaceOrderButton>
    </Container>
  );
};
