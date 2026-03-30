import React from "react";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { SafeArea } from "../../../components/utility/safe-area.component";
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

export const HomeScreen = () => (
  <SafeAreaProvider>
    <SafeArea>
      <HomeList
        data={homeData}
        ListHeaderComponent={HomeListHeader}
        numColumns={2}
        columnWrapperStyle={homeListColumnStyle}
        renderItem={({ item }) => (
          <HomeCardWrapper>
            <HomeInfoCard home={item} />
          </HomeCardWrapper>
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeArea>
  </SafeAreaProvider>
);
