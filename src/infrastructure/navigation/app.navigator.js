import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MainTabNavigator } from "./main-tabs.navigator";
import { CreatorTabNavigator } from "./creator-tabs.navigator";
import { navigationTheme } from "./navigation-theme";
import { WelcomeScreen } from "../../features/welcome/screens/welcome.screen";
import { CreateAccountScreen } from "../../features/welcome/screens/create-account.screen";
import { SignInScreen } from "../../features/welcome/screens/sign-in.screen";
import { useUserProfile } from "../../services/auth/user-profile.context";

import { colors } from "../theme/colors";

const RootStack = createNativeStackNavigator();
const DEV_FORCE_CREATOR_UI =
  String(process.env.EXPO_PUBLIC_DEV_FORCE_CREATOR_UI ?? "").toLowerCase() ===
  "true";
const DEV_FORCE_AUTH_USER =
  String(process.env.EXPO_PUBLIC_DEV_FORCE_AUTH_USER ?? "").toLowerCase() ===
  "true";

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg.primary,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg.primary,
    paddingHorizontal: 24,
  },
  errorTitle: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  errorMessage: {
    color: colors.text.primary,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
});

export const AppNavigator = () => {
  const { hasAuthenticatedUser, isCreator, isLoading, role, profileError } =
    useUserProfile();
  const shouldTreatAsAuthenticated =
    DEV_FORCE_AUTH_USER || hasAuthenticatedUser;
  const normalizedRole = String(role ?? "").toLowerCase();
  const shouldShowCreatorUI =
    DEV_FORCE_CREATOR_UI ||
    isCreator ||
    normalizedRole === "admin" ||
    normalizedRole === "teacher";

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

  if (shouldTreatAsAuthenticated && profileError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Unable to Load Account Role</Text>
        <Text style={styles.errorMessage}>
          Firestore blocked reading your user profile. Check Firestore rules for
          `users/{"{uid}"}` and allow authenticated users to read their own
          document.
        </Text>
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
            <RootStack.Screen name="GuestTabs" component={MainTabNavigator} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
