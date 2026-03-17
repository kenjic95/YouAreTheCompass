import React from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const ScreenContainer = styled.View`
  flex: 1;
  background-color: #ddd9d9;
  padding: 20px;
`;

const CreateButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #d7e6f1;
  width: 290px;
  padding: 18px 20px;
  border-radius: 35px;
  margin-top: 30px;
  margin-bottom: 35px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const CreateButtonText = styled.Text`
  font-size: 18px;
  color: #3a6e97;
  margin-left: 14px;
`;

const Title = styled.Text`
  font-size: 32px;
  color: #3a6e97;
  margin-bottom: 10px;
`;

const Divider = styled.View`
  height: 4px;
  background-color: #9dd0f4;
  margin-bottom: 30px;
`;

const JournalCard = styled.TouchableOpacity`
  background-color: ${(props) => (props.light ? "#d7e6f1" : "#97c9ef")};
  padding: 28px 30px;
  border-radius: 35px;
  margin-bottom: 25px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const JournalText = styled.Text`
  font-size: 18px;
  color: #3a6e97;
`;

const journals = [
  { id: "1", title: "Hiking in Blue Mountains" },
  { id: "2", title: "Scuba Diving in Cairns" },
  { id: "3", title: "Camping in Cokatoo Island" },
  { id: "4", title: "Coastal Walk in coogee", light: true },
];

export const TripLogsScreen = () => {
  return (
    <ScreenContainer>
      <CreateButton>
        <Ionicons name="add-circle-outline" size={38} color="#3a6e97" />
        <CreateButtonText>Create a journal</CreateButtonText>
      </CreateButton>

      <Title>My journal</Title>
      <Divider />

      <FlatList
        data={journals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JournalCard light={item.light}>
            <JournalText>{item.title}</JournalText>
          </JournalCard>
        )}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
};