import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SettingsScreen from "../../features/settings/screens/settings.screen.js";
import PremiumScreen from "../../features/settings/screens/premium.screen.js";
import AccountScreen from "../../features/settings/screens/account.screen.js";
import SettingsDetailScreen from "../../features/settings/screens/settings-detail.screen.js";
import AboutScreen from "../../features/settings/screens/about.screen.js";
import HelpSupportScreen from "../../features/settings/screens/help-support.screen.js";
import FeedbackScreen from "../../features/settings/screens/feedback.screen.js";
import LogoutScreen from "../../features/settings/screens/logout.screen.js";


console.log("SettingsScreen:", SettingsScreen);
console.log("PremiumScreen:", PremiumScreen);
console.log("AccountScreen:", AccountScreen);
console.log("Settings-detailScreen:", SettingsDetailScreen);
console.log("aboutScreen:", AboutScreen);
console.log("Help-supportScreen:", HelpSupportScreen);
console.log("feedback:", FeedbackScreen);
console.log("logout", LogoutScreen);

const SettingsStack = createNativeStackNavigator();

export const SettingsNavigator = () => {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} />
      <SettingsStack.Screen name="Premium" component={PremiumScreen} />
      <SettingsStack.Screen name="Account" component={AccountScreen} />
      <SettingsStack.Screen name="SettingsDetail" component={SettingsDetailScreen} />
      <SettingsStack.Screen name="About" component={AboutScreen} />
      <SettingsStack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <SettingsStack.Screen name="Feedback" component={FeedbackScreen} />
      <SettingsStack.Screen name="Logout" component={LogoutScreen} />
    </SettingsStack.Navigator>
  );
};
