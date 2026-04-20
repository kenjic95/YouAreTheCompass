import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { AlbumScreen } from "../../features/podcast/screens/podcast.screen";
import { PodcastPlayerScreen } from "../../features/podcast/screens/podcast.player.screen";

const PodcastStack = createStackNavigator();

export const PodcastNavigator = () => {
  return (
    <PodcastStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <PodcastStack.Screen name="Podcast" component={AlbumScreen} />
      <PodcastStack.Screen
        name="PodcastPlayer"
        component={PodcastPlayerScreen}
      />
    </PodcastStack.Navigator>
  );
};
