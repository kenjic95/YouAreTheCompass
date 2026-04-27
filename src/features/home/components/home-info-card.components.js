import React from "react";
import { Linking } from "react-native";

import { Spacer } from "../../../components/spacer/spacer.component";
import { Text } from "../../../components/typography/text.component";
import {
  HomeCard,
  HomeCardCover,
  Info,
  WelcomeContainer,
  WelcomeImage,
  WelcomeMessage,
} from "./home-info-card.styles";

const headerLogo = require("../../../../assets/logo-transparentBG.png");

export const homeData = [
  {
    id: "connect",
    name: "You Are the Compass - Connect",
    description: "Sample description for the connect card.",
    photos: [
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "subscribe",
    name: "Subscribe to You Are the Compass YouTube Channel",
    description: "Sample description for the YouTube channel card.",
    link: "https://www.youtube.com/@YouAreTheCompass",
    photos: [
      "https://static.wixstatic.com/media/8db060_d933c741882041a188cfe2a445e325a8~mv2.jpg/v1/fill/w_924,h_1232,fp_0.63_0.52,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG-20251104-WA0008.jpg",
    ],
  },
  {
    id: "website",
    name: "Visit our Official Website",
    description: "Sample description for the official website card.",
    link: "https://www.youarethecompass.com/",
    photos: [
      "https://static.wixstatic.com/media/8db060_f0df3c1c2c2a43c999c53376355313c7~mv2.jpeg/v1/fill/w_1196,h_1080,fp_0.61_0.50,q_85,enc_avif,quality_auto/Untitled%20(7).jpeg",
    ],
  },
];

export const HomeListHeader = () => (
  <WelcomeContainer>
    <WelcomeImage source={headerLogo} />
    <Spacer position="top" size="small">
      <WelcomeMessage>{"Create\nConnect\nInspire"}</WelcomeMessage>
    </Spacer>
  </WelcomeContainer>
);

export const HomeInfoCard = ({ home, navigation, canManageTrips = false }) => {
  const { id, name, photos, link, appLink } = home;

  const handlePress = async () => {
    if (id === "connect") {
      navigation.navigate(canManageTrips ? "ManageTrips" : "ConnectTrips");
      return;
    }

    if (!link) {
      return;
    }

    if (appLink) {
      const canOpenAppLink = await Linking.canOpenURL(appLink).catch(
        () => false,
      );
      if (canOpenAppLink) {
        Linking.openURL(appLink).catch(() => {});
        return;
      }
    }

    Linking.openURL(link).catch(() => {});
  };

  return (
    <HomeCard
      elevation={5}
      onPress={id === "connect" || link ? handlePress : undefined}
      accessibilityRole={id === "connect" || link ? "button" : undefined}
    >
      <HomeCardCover key={name} source={{ uri: photos[0] }} />
      <Info>
        <Text variant="label">{name}</Text>
      </Info>
    </HomeCard>
  );
};
