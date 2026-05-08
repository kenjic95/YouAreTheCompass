import React from "react";
import { FlatList, Linking, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "../../../components/typography/text.component";
import { useTripCatalog } from "../../../services/connect-trips/trip-catalog.context";

const Screen = styled.View`
  flex: 1;
  background-color: #72b4e8;
`;

const HeaderSafeArea = styled(SafeAreaView).attrs({
  edges: ["top"],
})`
  background-color: #ffffff;
`;

const Header = styled.View`
  min-height: 56px;
  border-bottom-width: 1px;
  border-bottom-color: #e8edf2;
  background-color: #ffffff;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-horizontal: 20px;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 8px;
  padding: 8px;
`;

const BackIcon = styled(MaterialIcons).attrs({
  name: "chevron-left",
  size: 28,
})`
  color: #2f2f2f;
`;

const HeaderTitle = styled.Text`
  font-size: 17px;
  line-height: 22px;
  color: #2f2f2f;
  font-weight: 700;
  text-align: center;
`;

const ScreenContainer = styled.View`
  flex: 1;
  padding: 20px 20px 0px;
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
  background-color: #1c5d8f;
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

export const ConnectTripsScreen = ({ navigation }) => {
  const { trips } = useTripCatalog();

  const openTripLink = async (url) => {
    const supported = await Linking.canOpenURL(url).catch(() => false);
    if (supported) {
      Linking.openURL(url).catch(() => {});
    }
  };

  const renderTrip = ({ item }) => (
    <TripCard>
      <TripImage
        source={{
          uri:
            item.image ||
            "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=900&q=80",
        }}
      />
      <TripContent>
        <TripTitle>{item.title}</TripTitle>
        <TripDetails>
          {item.location} • {item.duration}
        </TripDetails>
        <TripDetails>
  Travel Date: {item.travelDate?.day}/{item.travelDate?.month}/{item.travelDate?.year}
</TripDetails>
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
    <Screen>
      <HeaderSafeArea>
        <Header>
          <BackButton onPress={() => navigation.goBack()}>
            <BackIcon />
          </BackButton>
          <HeaderTitle>Trips</HeaderTitle>
        </Header>
      </HeaderSafeArea>
      <ScreenContainer>
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={renderTrip}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </ScreenContainer>
    </Screen>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 12,
  },
});
