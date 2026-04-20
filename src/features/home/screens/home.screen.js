import React from "react";
import styled from "styled-components/native";

import { TabHeader } from "../../../components/utility/tab-header.component";
import {
  HomeInfoCard,
  HomeListHeader,
  homeData,
} from "../components/home-info-card.components";
import {
  HomeCardWrapper,
  HomeList,
  homeListColumnStyle,
} from "../components/home-info-card.styles";

const Screen = styled.View`
  flex: 1;
  background-color: #69aee6;
`;

export const HomeScreen = ({ navigation }) => (
  <Screen>
    <TabHeader title="Home" />
    <Screen>
      <HomeList
        data={homeData}
        ListHeaderComponent={HomeListHeader}
        numColumns={2}
        columnWrapperStyle={homeListColumnStyle}
        renderItem={({ item }) => (
          <HomeCardWrapper>
            <HomeInfoCard home={item} navigation={navigation} />
          </HomeCardWrapper>
        )}
        keyExtractor={(item) => item.id}
      />
    </Screen>
  </Screen>
);
