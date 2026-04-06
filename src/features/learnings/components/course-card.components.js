import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";

import {
  AuthorText,
  CourseCard,
  CourseCardImage,
  CourseCardLayout,
  CourseTitle,
  DurationText,
  DurationValueText,
  BoughtBadge,
  BoughtText,
  CartBadge,
  CartText,
  PriceValue,
  PriceRow,
  Info,
  StatItem,
  StatText,
  StatsRow,
} from "./course-card.styles";

export const CourseInfo = ({
  course,
  onPress,
  isPurchased = false,
  isInCart = false,
} = {}) => {
  const theme = useTheme();

  const {
    courseTitle = "Mindfulness and Meditation",
    author = "John Doe",
    courseDuration = "2hr 46min",
    priceValue = "$20",
    price,
    watchers = "18k",
    rating = "4.8",
    coursePhoto = [
      "https://media.istockphoto.com/id/1459130410/vector/healthy-kids.jpg?s=612x612&w=0&k=20&c=3nLz49a_U4bB_ob6HziTBbsiJTrqYdGxUlLytRASdZs=",
    ],
  } = course ?? {};

  const coverPhoto = Array.isArray(coursePhoto) ? coursePhoto[0] : coursePhoto;
  const displayPriceValue = priceValue ?? price ?? "$20";

  return (
    <CourseCard elevation={5} onPress={onPress}>
      <CourseCardLayout>
        <Info>
          <CourseTitle>{courseTitle}</CourseTitle>
          <AuthorText>By: {author}</AuthorText>
          <DurationText>
            {"Class Duration\n"}
            <DurationValueText>{courseDuration}</DurationValueText>
          </DurationText>
          <PriceRow>
            <PriceValue>{displayPriceValue}</PriceValue>
            {isPurchased ? (
              <BoughtBadge>
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={theme.colors.text.success}
                />
                <BoughtText>Bought</BoughtText>
              </BoughtBadge>
            ) : isInCart ? (
              <CartBadge>
                <Ionicons name="cart" size={14} color="#2A6DA8" />
                <CartText>In Cart</CartText>
              </CartBadge>
            ) : null}
          </PriceRow>
          <StatsRow>
            <StatItem>
              <Ionicons
                name="people"
                size={14}
                color={theme.colors.ui.secondary}
              />
              <StatText>{watchers}</StatText>
            </StatItem>
            <StatItem>
              <Ionicons
                name="star"
                size={14}
                color={theme.colors.ui.secondary}
              />
              <StatText>{rating}</StatText>
            </StatItem>
          </StatsRow>
        </Info>
        <CourseCardImage source={{ uri: coverPhoto }} resizeMode="cover" />
      </CourseCardLayout>
    </CourseCard>
  );
};
