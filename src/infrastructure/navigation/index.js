import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppNavigator } from "./app.navigator";
import { UserProfileProvider } from "../../services/auth/user-profile.context";

export const Navigation = () => (
  <SafeAreaProvider>
    <UserProfileProvider>
      <AppNavigator />
    </UserProfileProvider>
  </SafeAreaProvider>
);
