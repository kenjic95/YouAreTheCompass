import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";

import { HomeNavigator } from "./home.navigator";
import { PodcastNavigator } from "./podcast.navigator";
import { LearningsNavigator } from "./learnings.navigator";
import { TripLogsNavigator } from "./triplogs.navigator";
import { SettingsNavigator } from "./settings.navigator";
import { WelcomeScreen } from "../../features/welcome/screens/welcome.screen";
import { CreateAccountScreen } from "../../features/welcome/screens/create-account.screen";
import { SignInScreen } from "../../features/welcome/screens/sign-in.screen";
import { auth, isFirebaseConfigured } from "../../services/auth/firebase";

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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg.primary,
  },
});

export const AppNavigator = () => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [hasAuthenticatedUser, setHasAuthenticatedUser] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setHasAuthenticatedUser(false);
      setIsAuthReady(true);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setHasAuthenticatedUser(Boolean(user));
      setIsAuthReady(true);
    });

    return unsubscribe;
  }, []);

  if (!isAuthReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootStack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={hasAuthenticatedUser ? "MainTabs" : "Welcome"}
      >
        <RootStack.Screen name="Welcome" component={WelcomeScreen} />
        <RootStack.Screen
          name="CreateAccount"
          component={CreateAccountScreen}
        />
        <RootStack.Screen name="SignIn" component={SignInScreen} />
        <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
