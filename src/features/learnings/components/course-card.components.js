import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";

import {
  CourseCard,
  CourseCardCover,
  Description,
  Info,
  StatItem,
  StatText,
  StatsRow,
} from "./course-card.styles";

export const CourseInfo = ({ course } = {}) => {
  const theme = useTheme();

  const {
    courseTitle = "Mindfulness and Meditation",
    author = "John Doe",
    courseDuration = "2hr 46min",
    price = "$20",
    watchers = "18k",
    rating = "4.8",
    coursePhoto = [
      "https://media.istockphoto.com/id/1459130410/vector/healthy-kids.jpg?s=612x612&w=0&k=20&c=3nLz49a_U4bB_ob6HziTBbsiJTrqYdGxUlLytRASdZs=",
    ],
  } = course ?? {};

  const coverPhoto = Array.isArray(coursePhoto) ? coursePhoto[0] : coursePhoto;

  return (
    <CourseCard elevation={5}>
      <CourseCardCover source={{ uri: coverPhoto }} />
      <Info>
        <Description>{courseTitle}</Description>
        <Description>By: {author}</Description>
        <Description>Class Duration: {courseDuration}</Description>
        <Description>{price}</Description>
        <StatsRow>
          <StatItem>
            <Ionicons
              name="people"
              size={14}
              color={theme.colors.text.primary}
            />
            <StatText>{watchers}</StatText>
          </StatItem>
          <StatItem>
            <Ionicons
              name="star"
              size={14}
              color={theme.colors.text.primary}
            />
            <StatText>{rating}</StatText>
          </StatItem>
        </StatsRow>
      </Info>
    </CourseCard>
  );
};
