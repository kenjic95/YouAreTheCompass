import React from "react";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { Spacer } from "../../../components/spacer/spacer.component";
import { SafeArea } from "../../../components/utility/safe-area.component";
import {
  HomeInfoCard,
  HomeListHeader,
  homeData,
} from "../components/home-info-card.components";
import { HomeList } from "../components/home-info-card.styles";

export const HomeScreen = () => (
  <SafeAreaProvider>
    <SafeArea>
      <HomeList
        data={homeData}
        ListHeaderComponent={HomeListHeader}
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
