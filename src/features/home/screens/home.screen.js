import React from "react";
import styled from "styled-components/native";

import { TabHeader } from "../../../components/utility/tab-header.component";
import { useUserProfile } from "../../../services/auth/user-profile.context";
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

const DEV_FORCE_CREATOR_UI =
  String(process.env.EXPO_PUBLIC_DEV_FORCE_CREATOR_UI ?? "").toLowerCase() ===
  "true";

export const HomeScreen = ({ navigation }) => {
  const { role } = useUserProfile();
  const canManageTrips = DEV_FORCE_CREATOR_UI || role === "admin";

  return (
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
              <HomeInfoCard
                home={item}
                navigation={navigation}
                canManageTrips={canManageTrips}
              />
            </HomeCardWrapper>
          )}
          keyExtractor={(item) => item.id}
        />
      </Screen>
    </Screen>
  );
};
