import React from "react";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";

const HeaderSafeArea = styled(SafeAreaView).attrs({
  edges: ["top"],
})`
  background-color: #ffffff;
`;

const HeaderContent = styled.View`
  min-height: 56px;
  justify-content: center;
  padding-horizontal: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #e8edf2;
  align-items: center;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #2f2f2f;
  text-align: center;
`;

export const TabHeader = ({ title }) => (
  <HeaderSafeArea>
    <HeaderContent>
      <HeaderTitle>{title}</HeaderTitle>
    </HeaderContent>
  </HeaderSafeArea>
);
