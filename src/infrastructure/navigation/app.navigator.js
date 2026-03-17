import React from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";

import { HomeNavigator } from "./home.navigator";
import { PodcastNavigator } from "./podcast.navigator";
import { LearningsNavigator } from "./learnings.navigator";
import SettingsScreen from "../../features/settings/screens/settings.screen";

import { colors } from "../theme/colors";

import { SafeArea } from "../../components/utility/safe-area.component";

const Tab = createBottomTabNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg.primary,
  },
};

const TAB_ICON = {
  Home: "home",
  Podcast: "headset",
  Learning: "bulb",
  "Travel Logs": "map",
  Settings: "ellipsis-horizontal",
};

const TravelLogs = () => (
  <SafeArea>
    <Text>Travel Logs</Text>
  </SafeArea>
);

const Settings = () => (
  <SafeArea>
    <Text>Settings</Text>
  </SafeArea>
);
const createScreenOptions = ({ route }) => {
  const iconName = TAB_ICON[route.name];
  return {
    tabBarIcon: ({ size, color }) => (
      <Ionicons name={iconName} size={size} color={color} />
    ),
    tabBarActiveTintColor: colors.brand.primary,
    tabBarInactiveTintColor: colors.ui.secondary,
  };
};

export const AppNavigator = () => (
  <NavigationContainer theme={navigationTheme}>
    <Tab.Navigator screenOptions={createScreenOptions}>
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Podcast"
        component={PodcastNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Learning"
        component={LearningsNavigator}
        options={{ headerShown: false }}
      />

      <Tab.Screen name="Travel Logs" component={TravelLogs} />
      <Tab.Screen name="Settings" 
      component={SettingsScreen}
      option={createScreenOptions} />
    </Tab.Navigator>
  </NavigationContainer>
);
