import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SettingsScreen from "../../features/settings/screens/settings.screen";
import PremiumScreen from "../../features/settings/screens/premium.screen";

const Stack = createStackNavigator();

export const SettingsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="Premium" component={PremiumScreen} />
    </Stack.Navigator>
  );
};
