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

const welcomeImage = require("../../../../assets/mountain.png");

const HomeList = styled(FlatList).attrs({
  contentContainerStyle: {
    padding: 16,
  },
})``;

const WelcomeContainer = styled.View`
  padding-top: ${(props) => props.theme.space[5]};
  padding-bottom: ${(props) => props.theme.space[1]};
  padding-left: ${(props) => props.theme.space[1]};
  padding-right: ${(props) => props.theme.space[1]};
`;
const OpenMessage = styled(Text).attrs({
  variant: "body",
})`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-family: ${(props) => props.theme.fonts.body};
  text-align: center;
`;
const WelcomeMessage = styled(Text).attrs({
  variant: "body",
})`
  font-size: ${(props) => props.theme.fontSizes.h4};
  font-family: ${(props) => props.theme.fonts.monospace};
  text-align: center;
`;
const WelcomeImage = styled.Image.attrs({
  resizeMode: "contain",
})`
  width: 100%;
  height: 220px;
  margin-top: ${(props) => props.theme.space[4]};
`;

export const HomeScreen = () => (
  <SafeAreaProvider>
    <SafeArea>
      <HomeList
        data={homeData}
        // eslint-disable-next-line react/no-unstable-nested-components
        ListHeaderComponent={() => (
          <WelcomeContainer>
            <OpenMessage>Find your direction</OpenMessage>
            <Spacer position="top" size="small">
              <WelcomeMessage>
                Rediscover purpose through voice, journey and connection
              </WelcomeMessage>
            </Spacer>
            <WelcomeImage source={welcomeImage} />
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
