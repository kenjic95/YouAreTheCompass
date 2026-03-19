import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { TripLogsScreen } from "../../features/triplogs/screens/triplogs.screen";

const TripLogsStack = createStackNavigator();

export const TripLogsNavigator = () => {
  return (
    <TripLogsStack.Navigator headerMode="none">
      <TripLogsStack.Screen name="TripLogsMain" component={TripLogsScreen} />
    </TripLogsStack.Navigator>
  );
};
