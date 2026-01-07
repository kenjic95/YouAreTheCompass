import React from "react";
import { Text } from "../../../components/typography/text.component";

import { HomeCard, HomeCardCover, Info } from "./home-info-card.styles";

export const homeData = [
  {
    id: "newsletter",
    name: "You Are the Compass - News Letter",
    description: "Sample description for the newsletter card.",
    photos: [
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "subscribe",
    name: "Subscribe to You Are the Compass YouTube Channel",
    description: "Sample description for the YouTube channel card.",
    photos: [
      "https://static.wixstatic.com/media/8db060_d933c741882041a188cfe2a445e325a8~mv2.jpg/v1/fill/w_924,h_1232,fp_0.63_0.52,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG-20251104-WA0008.jpg",
    ],
  },
  {
    id: "website",
    name: "Visit our Official Website",
    description: "Sample description for the official website card.",
    photos: [
      "https://static.wixstatic.com/media/8db060_f0df3c1c2c2a43c999c53376355313c7~mv2.jpeg/v1/fill/w_1196,h_1080,fp_0.61_0.50,q_85,enc_avif,quality_auto/Untitled%20(7).jpeg",
    ],
  },
];

export const HomeInfoCard = ({ home }) => {
  const { name, photos } = home;

  return (
    <HomeCard elevation={5}>
      <HomeCardCover key={name} source={{ uri: photos[0] }} />
      <Info>
        <Text variant="label">{name}</Text>
      </Info>
    </HomeCard>
  );
};
