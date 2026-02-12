import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppNavigator } from "./app.navigator";

export const Navigation = () => (
  <SafeAreaProvider>
    <AppNavigator />
  </SafeAreaProvider>
);
