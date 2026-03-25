import React from "react";
import styled from "styled-components/native";
import { Card } from "react-native-paper";

const CategoryCard = styled(Card)`
  position: relative;
  aspect-ratio: 1;
  border-radius: 20px;
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.ui.quaternary};
`;

const CategoryCardCover = styled(Card.Cover)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: ${(props) => props.theme.space[4]};
  background-color: ${(props) => props.theme.colors.ui.quaternary};
`;

const Title = styled.Text`
  margin-bottom: ${(props) => props.theme.space[0]};
  color: ${(props) => props.theme.colors.text.primary};
  font-family: ${(props) => props.theme.fonts.heading};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  font-size: ${(props) => props.theme.fontSizes.body};
`;

const CardOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: ${(props) => props.theme.space[3]};
`;

const CourseText = styled.Text`
  color: ${(props) => props.theme.colors.text.disabled};
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.button};
`;

export const CategoryInfo = ({ category } = {}) => {
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
    <CategoryCard elevation={5}>
      <CategoryCardCover source={{ uri: coverPhoto }} resizeMode="contain" />
      <CardOverlay>
        <Title>{categoryTitle}</Title>
        <CourseText>{noOfCourses}</CourseText>
      </CardOverlay>
    </CategoryCard>
  );
};
