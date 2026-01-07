import React from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";

import { SafeArea } from "../../../components/utility/safe-area.component";
import {
  HomeInfoCard,
  homeData,
} from "../components/home-info-card.components";
import { Spacer } from "../../../components/spacer/spacer.component";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text } from "../../../components/typography/text.component";

const HomeList = styled(FlatList).attrs({
  contentContainerStyle: {
    padding: 16,
  },
})``;

const WelcomeContainer = styled.View`
  padding-bottom: ${(props) => props.theme.space[3]};
`;

const WelcomeMessage = styled(Text).attrs({
  variant: "body",
})`
  font-size: ${(props) => props.theme.fontSizes.h4};
  font-family: ${(props) => props.theme.fonts.monospace};
`;

export const HomeScreen = () => (
  <SafeAreaProvider>
    <SafeArea>
      <HomeList
        data={homeData}
        ListHeaderComponent={() => (
          <WelcomeContainer>
            <WelcomeMessage>
              Find your direction. Rediscover purpose through voice, journey and
              connection
            </WelcomeMessage>
          </WelcomeContainer>
        )}
        renderItem={({ item }) => (
          <Spacer position="bottom" size="large">
            <HomeInfoCard home={item} />
          </Spacer>
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeArea>
  </SafeAreaProvider>
);
