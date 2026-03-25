import React from "react";

import {
  CardOverlay,
  CategoryCard,
  CategoryCardCover,
  CourseText,
  Title,
} from "./course-card.styles";

export const CourseInfo = ({ course } = {}) => {
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
    <CategoryCard elevation={5}>
      <CategoryCardCover source={{ uri: coverPhoto }} resizeMode="contain" />
      <CardOverlay>
        <Title>{courseTitle}</Title>
        <author>{author}</author>
        <duration>{courseDuration}</duration>
        <price>{price}</price>
        <watchers>{watchers}</watchers>
        <rating>{rating}</rating>
      </CardOverlay>
    </CategoryCard>
  );
};
