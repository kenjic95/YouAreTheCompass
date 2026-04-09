import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { AlbumScreen } from "../../features/podcast/screens/podcast.screen";

const PodcastStack = createStackNavigator();

export const PodcastNavigator = () => {
  return (
    <PodcastStack.Navigator headerMode="none">
      <PodcastStack.Screen name="Podcast" component={AlbumScreen} />
    </PodcastStack.Navigator>
  );
};
