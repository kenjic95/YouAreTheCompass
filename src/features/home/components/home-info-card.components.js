import React from "react";
import { Text } from "../../../components/typography/text.component";

import {
  HomeCard,
  HomeCardCover,
  Info,
  Description,
} from "./home-info-card.styles";

export const HomeInfoCard = ({ home = {} }) => {
  const {
    name = "Title",
    photos = [
      "https://www.foodiesfeed.com/wp-content/uploads/2019/06/top-view-for-box-of-2-burgers-home-made-600x899.jpg",
    ],
    description = "lorepsum 1234",
  } = home;

  return (
    <HomeCard elevation={5}>
      <HomeCardCover key={name} source={{ uri: photos[0] }} />
      <Info>
        <Text variant="label">{name}</Text>
        <Description>{description}</Description>
      </Info>
    </HomeCard>
  );
};
