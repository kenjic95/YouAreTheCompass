import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";

import { HomeNavigator } from "./home.navigator";
import { PodcastNavigator } from "./podcast.navigator";
import { colors } from "../theme/colors";

import { SafeArea } from "../../components/utility/safe-area.component";

const Tab = createBottomTabNavigator();

const TAB_ICON = {
  Home: "home",
  Podcast: "headset",
  Learning: "bulb",
  "Travel Logs": "map",
  Settings: "ellipsis-horizontal",
};

const Learning = () => (
  <SafeArea>
    <Text>Learning</Text>
  </SafeArea>
);
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
  <NavigationContainer>
    <Tab.Navigator
      screenOptions={createScreenOptions}
    >
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
      <Tab.Screen name="Learning" component={Learning} />
      <Tab.Screen name="Travel Logs" component={TravelLogs} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  </NavigationContainer>
);
