import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen } from "../../features/home/screens/home.screen";

const HomeStack = createStackNavigator();

export const HomeNavigator = () => {
  return (
    <HomeStack.Navigator headerMode="none">
      <HomeStack.Screen name="Home 1" component={HomeScreen} />
    </HomeStack.Navigator>
  );
};
