import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SettingsScreen from "../../features/settings/screens/settings.screen";
import PremiumScreen from "../../features/settings/screens/premium.screen";

const SettingsStack = createStackNavigator();

export const SettingsNavigator = () => {
  return (
    <SettingsStack.Navigator headerMode="none">
      <SettingsStack.Screen
        name="General Settings"
        component={SettingsScreen}
      />
      <SettingsStack.Screen name="Premium" component={PremiumScreen} />
    </SettingsStack.Navigator>
  );
};
