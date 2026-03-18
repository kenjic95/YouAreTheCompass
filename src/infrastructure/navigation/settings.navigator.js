import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SettingsScreen from "../../features/settings/screens/settings.screen";
import PremiumScreen from "../../features/settings/screens/premium.screen";

const SettingsStack = createNativeStackNavigator();

export const SettingsNavigator = () => {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} />
      <SettingsStack.Screen name="Premium" component={PremiumScreen} />
    </SettingsStack.Navigator>
  );
};
