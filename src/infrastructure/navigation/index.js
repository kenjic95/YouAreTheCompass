import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppNavigator } from "./app.navigator";
import { UserProfileProvider } from "../../services/auth/user-profile.context";
import { CourseCatalogProvider } from "../../services/learnings/course-catalog.context";

export const Navigation = () => (
  <SafeAreaProvider>
    <CourseCatalogProvider>
      <UserProfileProvider>
        <AppNavigator />
      </UserProfileProvider>
    </CourseCatalogProvider>
  </SafeAreaProvider>
);
