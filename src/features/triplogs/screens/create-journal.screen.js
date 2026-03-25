import React from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const Container = styled(ScrollView).attrs({
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
  background-color: #72b2e3;
  padding: 24px;
`;

const BackButton = styled.TouchableOpacity`
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Header = styled.Text`
  font-size: 34px;
  color: white;
  text-align: center;
  margin-bottom: 40px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const InputBox = styled.TouchableOpacity`
  background-color: ${(props) => (props.dark ? "#3f77a1" : "#d7e6f1")};
  width: 48%;
  padding: 24px 20px;
  border-radius: 30px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const InputText = styled.Text`
  font-size: 18px;
  color: ${(props) => (props.dark ? "white" : "#3a6e97")};
  text-align: center;
`;

const SectionLabel = styled.Text`
  font-size: 18px;
  color: white;
  margin-bottom: 14px;
`;

const ChecklistButton = styled.TouchableOpacity`
  background-color: #b9d9f2;
  width: 210px;
  padding: 16px 20px;
  border-radius: 25px;
  margin-bottom: 14px;
  flex-direction: row;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const ChecklistText = styled.Text`
  color: #3a6e97;
  font-size: 16px;
  margin-left: 8px;
`;

const ReflectionTitle = styled.Text`
  font-size: 34px;
  color: white;
  margin-top: 30px;
`;

const Divider = styled.View`
  height: 2px;
  background-color: white;
  margin-top: 6px;
  margin-bottom: 25px;
`;

const ReflectionBox = styled.View`
  background-color: #f2f2f2;
  min-height: 220px;
  border-radius: 35px;
  padding: 24px;
  margin-bottom: 30px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const ReflectionLabel = styled.Text`
  font-size: 18px;
  color: #3a6e97;
`;

export const CreateJournalScreen = ({ navigation }) => {
  return (
    <Container>
      <BackButton onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={34} color="#6b6b6b" />
      </BackButton>

      <Header>Create Journal</Header>

      <Row>
        <InputBox>
          <InputText>Add a Title</InputText>
        </InputBox>

        <InputBox dark>
          <InputText dark>Add a Date</InputText>
        </InputBox>
      </Row>

      <SectionLabel>Check list for this trip</SectionLabel>

      <ChecklistButton>
        <Ionicons name="add-circle-outline" size={22} color="#3a6e97" />
        <ChecklistText>Add an item</ChecklistText>
      </ChecklistButton>

      <ChecklistButton>
        <Ionicons name="add-circle-outline" size={22} color="#3a6e97" />
        <ChecklistText>Add an item</ChecklistText>
      </ChecklistButton>

      <ReflectionTitle>Reflection</ReflectionTitle>
      <Divider />

      <ReflectionBox>
        <ReflectionLabel>Before the Trip</ReflectionLabel>
      </ReflectionBox>

      <ReflectionBox>
        <ReflectionLabel>After the Trip</ReflectionLabel>
      </ReflectionBox>
    </Container>
  );
};