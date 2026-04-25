import React, { useMemo, useState } from "react";

import {
  CardOverlay,
  CategoryCard,
  CategoryCardCover,
  CourseText,
  Title,
} from "./category-card.styles";

const FALLBACK_SOURCE = {
  uri: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
};

export const CategoryInfo = ({ category, onPress } = {}) => {
  const [hasImageError, setHasImageError] = useState(false);
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
  const normalizedCoverPhoto = useMemo(
    () => (typeof coverPhoto === "string" ? coverPhoto.trim() : coverPhoto),
    [coverPhoto]
  );
  const imageSource = useMemo(() => {
    if (hasImageError) {
      return FALLBACK_SOURCE;
    }

    if (typeof normalizedCoverPhoto === "string" && normalizedCoverPhoto) {
      return { uri: normalizedCoverPhoto };
    }

    return normalizedCoverPhoto || FALLBACK_SOURCE;
  }, [hasImageError, normalizedCoverPhoto]);

  return (
    <CategoryCard activeOpacity={0.85} onPress={onPress}>
      <CategoryCardCover
        source={imageSource}
        resizeMode="cover"
        onError={() => setHasImageError(true)}
      />
      <CardOverlay>
        <Title>{categoryTitle}</Title>
        <CourseText>{noOfCourses}</CourseText>
      </CardOverlay>
    </CategoryCard>
  );
};
