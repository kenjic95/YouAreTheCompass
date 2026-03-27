import React from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { HomeNavigator } from "./home.navigator";
import { PodcastNavigator } from "./podcast.navigator";
import { LearningsNavigator } from "./learnings.navigator";
import { TripLogsNavigator } from "./triplogs.navigator";
import { SettingsNavigator } from "./settings.navigator";
import { WelcomeScreen } from "../../features/welcome/screens/welcome.screen";
import { CreateAccountScreen } from "../../features/welcome/screens/create-account.screen";
import { SignInScreen } from "../../features/welcome/screens/sign-in.screen";

import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

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
  Create: "bulb",
  "Trip Logs": "map",
  Settings: "ellipsis-horizontal",
};

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

const MainTabNavigator = () => (
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
      name="Create"
      component={LearningsNavigator}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Trip Logs"
      component={TripLogsNavigator}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsNavigator}
      options={{ headerShown: false }}
    />
  </Tab.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer theme={navigationTheme}>
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Welcome" component={WelcomeScreen} />
      <RootStack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <RootStack.Screen name="SignIn" component={SignInScreen} />
      <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
    </RootStack.Navigator>
  </NavigationContainer>
);
