import React from "react";
import { Alert, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";

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

const UploadAction = styled.TouchableOpacity`
  margin: 14px 14px 12px;
  background-color: #3479ac;
  border-radius: 16px;
  padding: 13px;
  align-items: center;
`;

const UploadActionText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
`;

const TripsList = styled(FlatList).attrs({
  contentContainerStyle: {
    paddingBottom: 24,
  },
  showsVerticalScrollIndicator: false,
})``;

const TripCard = styled.View`
  margin-horizontal: 14px;
  margin-bottom: 14px;
  border-radius: 16px;
  overflow: hidden;
  background-color: #ffffff;
`;

const TripImage = styled.Image`
  width: 100%;
  height: 170px;
`;

const TripContent = styled.View`
  padding: 14px;
`;

const TripTitle = styled.Text`
  color: #173e60;
  font-size: 18px;
  font-weight: 700;
`;

const TripMeta = styled.Text`
  margin-top: 6px;
  color: #4f6980;
  font-size: 14px;
`;

const TripDescription = styled.Text`
  margin-top: 10px;
  color: #3f5569;
  font-size: 14px;
  line-height: 21px;
`;

const Row = styled.View`
  margin-top: 12px;
  flex-direction: row;
`;

const ActionButton = styled.TouchableOpacity`
  margin-right: 10px;
  border-radius: 10px;
  padding-vertical: 8px;
  padding-horizontal: 18px;
  background-color: ${(props) =>
    props.variant === "danger" ? "#fee7e7" : "#e3eef8"};
`;

const ActionButtonText = styled.Text`
  color: ${(props) =>
    props.variant === "danger" ? "#b23d3d" : "#2f638e"};
  font-size: 13px;
  font-weight: 700;
`;

const EmptyState = styled.Text`
  margin: 18px 16px;
  color: #224a6d;
  font-size: 16px;
`;

const placeholderImage =
  "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=900&q=80";

export const ManageTripsScreen = ({ navigation }) => {
  const { trips, deleteTrip } = useTripCatalog();

  const handleDelete = (trip) => {
    if (!trip?.id) {
      return;
    }

    Alert.alert("Delete trip", `Delete \"${trip?.title || "this trip"}\"?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteTrip(trip.id);
        },
      },
    ]);
  };

  return (
    <Screen>
      <HeaderSafeArea>
        <Header>
          <BackButton onPress={() => navigation.goBack()}>
            <BackIcon />
          </BackButton>
          <HeaderTitle>Manage Trips</HeaderTitle>
        </Header>
      </HeaderSafeArea>

      <UploadAction onPress={() => navigation.navigate("UploadTrip")}>
        <UploadActionText>Upload New Trip</UploadActionText>
      </UploadAction>

      <TripsList
        data={trips}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <EmptyState>No trips yet. Upload one to get started.</EmptyState>
        }
        renderItem={({ item }) => (
          <TripCard>
            <TripImage source={{ uri: item.image || placeholderImage }} />
            <TripContent>
              <TripTitle>{item.title}</TripTitle>
              <TripMeta>
                {item.location}
                {item.duration ? ` • ${item.duration}` : ""}
              </TripMeta>
              <TripMeta>
  Travel Date: {item.travelDate?.day}/{item.travelDate?.month}/{item.travelDate?.year}
</TripMeta>
              <TripDescription numberOfLines={4}>
                {item.description}
              </TripDescription>
              <TripMeta>{item.price}</TripMeta>
              <Row>
                <ActionButton
                  onPress={() =>
                    navigation.navigate("UploadTrip", { tripId: item.id })
                  }
                >
                  <ActionButtonText>Edit</ActionButtonText>
                </ActionButton>
                <ActionButton variant="danger" onPress={() => handleDelete(item)}>
                  <ActionButtonText variant="danger">Delete</ActionButtonText>
                </ActionButton>
              </Row>
            </TripContent>
          </TripCard>
        )}
      />
    </Screen>
  );
};
