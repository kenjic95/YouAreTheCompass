import React from "react";

import {
  CardOverlay,
  CategoryCard,
  CategoryCardCover,
  CourseText,
  Title,
} from "./category-card.styles";

export const CategoryInfo = ({ category, onPress } = {}) => {
  const {
    categoryTitle = "Health & Wellness",
    noOfCourses = "17 Courses",
    categoryPhoto = [
      "https://media.istockphoto.com/id/1459130410/vector/healthy-kids.jpg?s=612x612&w=0&k=20&c=3nLz49a_U4bB_ob6HziTBbsiJTrqYdGxUlLytRASdZs=",
    ],
  } = category ?? {};

  const coverPhoto = Array.isArray(categoryPhoto)
    ? categoryPhoto[0]
    : categoryPhoto;

  return (
    <CategoryCard elevation={5} onPress={onPress}>
      <CategoryCardCover source={{ uri: coverPhoto }} resizeMode="contain" />
      <CardOverlay>
        <Title>{categoryTitle}</Title>
        <CourseText>{noOfCourses}</CourseText>
      </CardOverlay>
    </CategoryCard>
  );
};
