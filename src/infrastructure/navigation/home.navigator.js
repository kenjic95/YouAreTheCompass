import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen } from "../../features/home/screens/home.screen";
import { ConnectTripsScreen } from "../../features/home/screens/connect-trips.screen";

const HomeStack = createStackNavigator();

export const HomeNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="ConnectTrips" component={ConnectTripsScreen} />
    </HomeStack.Navigator>
  );
};
