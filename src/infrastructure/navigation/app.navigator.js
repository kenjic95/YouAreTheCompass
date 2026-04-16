import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { HomeNavigator } from "./home.navigator";
import { PodcastNavigator } from "./podcast.navigator";
import { LearningsNavigator } from "./learnings.navigator";
import { TripLogsNavigator } from "./triplogs.navigator";
import { SettingsNavigator } from "./settings.navigator";
import { ManageCoursesScreen } from "../../features/learnings/screens/manage-courses.screen";
import { WelcomeScreen } from "../../features/welcome/screens/welcome.screen";
import { CreateAccountScreen } from "../../features/welcome/screens/create-account.screen";
import { SignInScreen } from "../../features/welcome/screens/sign-in.screen";
import { useUserProfile } from "../../services/auth/user-profile.context";

import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const DEV_FORCE_CREATOR_UI =
  String(process.env.EXPO_PUBLIC_DEV_FORCE_CREATOR_UI ?? "").toLowerCase() ===
  "true";
const DEV_FORCE_AUTH_USER =
  String(process.env.EXPO_PUBLIC_DEV_FORCE_AUTH_USER ?? "").toLowerCase() ===
  "true";

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg.primary,
  },
};

const STUDENT_TAB_ICON = {
  Home: "home",
  Podcast: "headset",
  Create: "bulb",
  "Trip Logs": "map",
  Settings: "ellipsis-horizontal",
};

const CREATOR_TAB_ICON = {
  Home: "home",
  "Manage Courses": "cloud-upload",
  Settings: "ellipsis-horizontal",
};

const createScreenOptions =
  (iconMap) =>
  ({ route }) => {
    const iconName = iconMap[route.name];
    return {
      tabBarIcon: ({ size, color }) => (
        <Ionicons name={iconName} size={size} color={color} />
      ),
      tabBarActiveTintColor: colors.brand.primary,
      tabBarInactiveTintColor: colors.ui.secondary,
    };
  };

const MainTabNavigator = () => (
  <Tab.Navigator screenOptions={createScreenOptions(STUDENT_TAB_ICON)}>
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

const CreatorTabNavigator = () => (
  <Tab.Navigator screenOptions={createScreenOptions(CREATOR_TAB_ICON)}>
    <Tab.Screen
      name="Home"
      component={HomeNavigator}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Manage Courses"
      component={ManageCoursesScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsNavigator}
      options={{ headerShown: false }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg.primary,
  },
});

export const AppNavigator = () => {
  const { hasAuthenticatedUser, isCreator, isLoading } = useUserProfile();
  const shouldTreatAsAuthenticated =
    DEV_FORCE_AUTH_USER || hasAuthenticatedUser;
  const shouldShowCreatorUI = DEV_FORCE_CREATOR_UI || isCreator;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {shouldTreatAsAuthenticated ? (
          <>
            <RootStack.Screen
              name="MainTabs"
              component={
                shouldShowCreatorUI ? CreatorTabNavigator : MainTabNavigator
              }
            />
          </>
        ) : (
          <>
            <RootStack.Screen name="Welcome" component={WelcomeScreen} />
            <RootStack.Screen
              name="CreateAccount"
              component={CreateAccountScreen}
            />
            <RootStack.Screen name="SignIn" component={SignInScreen} />
            <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
