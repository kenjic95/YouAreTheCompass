import React from "react";
import { FlatList, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { Text } from "../../../components/typography/text.component";

const ScreenSafeArea = styled(SafeAreaView)`
  flex: 1;
  background-color: #f4f8fb;
`;

const ScreenContainer = styled.View`
  flex: 1;
  padding: 20px;
`;

const TripCard = styled.View`
  background-color: white;
  border-radius: 20px;
  margin-bottom: 18px;
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.12;
  shadow-radius: 12px;
  elevation: 5;
`;

const TripImage = styled.Image`
  width: 100%;
  height: 180px;
`;

const TripContent = styled.View`
  padding: 18px;
`;

const TripTitle = styled(Text)`
  font-size: 20px;
  color: #1f4a7f;
  font-weight: bold;
  margin-bottom: 10px;
`;

const TripDetails = styled(Text)`
  font-size: 14px;
  color: #6d7c96;
  margin-bottom: 12px;
`;

const TripDescription = styled(Text)`
  font-size: 15px;
  color: #475569;
  line-height: 22px;
  margin-bottom: 18px;
`;

const ActionRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const OpenLinkButton = styled.TouchableOpacity`
  background-color: #3a6e97;
  padding: 12px 18px;
  border-radius: 16px;
`;

const OpenLinkText = styled(Text)`
  color: white;
  font-size: 15px;
`;

const TripLinkLabel = styled(Text)`
  color: #3a6e97;
  font-size: 13px;
`;

const tripLinks = [
  {
    id: "kili-adventure",
    title: "Climb Atop the Roof of Africa - Tanzania Adventure Trip",
    location: "Tanzania",
    description:
      "Climb Mount Kilimanjaro with local guides and experience the highest peak in Africa. Includes full logistics, acclimatization days, and photo-worthy summit views.",
    link: "https://www.joinmytrip.com/en/trips/climb-atop-the-roof-of-africa--tanzania-adventure-trip-UgpH",
    duration: "9 days",
    price: "$2,900",
  },
  {
    id: "blue-mountains",
    title: "Blue Mountains Wilderness Expedition",
    location: "Australia",
    description:
      "Explore scenic trails, waterfalls, and ridge top views while staying in comfortable mountain lodges. Perfect for hikers and nature lovers.",
    link: "https://www.joinmytrip.com/en/trips/blue-mountains-wilderness-expedition-example",
    duration: "6 days",
    price: "$1,450",
  },
];

export const ConnectTripsScreen = () => {
  const openTripLink = async (url) => {
    const supported = await Linking.canOpenURL(url).catch(() => false);
    if (supported) {
      Linking.openURL(url).catch(() => {});
    }
  };

  const renderTrip = ({ item }) => (
    <TripCard>
      <TripImage source={{ uri: `https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=900&q=80` }} />
      <TripContent>
        <TripTitle>{item.title}</TripTitle>
        <TripDetails>{item.location} • {item.duration}</TripDetails>
        <TripDescription>{item.description}</TripDescription>
        <ActionRow>
          <TripLinkLabel>Price: {item.price}</TripLinkLabel>
          <OpenLinkButton onPress={() => openTripLink(item.link)}>
            <OpenLinkText>Open link</OpenLinkText>
          </OpenLinkButton>
        </ActionRow>
      </TripContent>
    </TripCard>
  );

  return (
    <ScreenSafeArea>
      <ScreenContainer>
        <FlatList
          data={tripLinks}
          keyExtractor={(item) => item.id}
          renderItem={renderTrip}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      </ScreenContainer>
    </ScreenSafeArea>
  );
};