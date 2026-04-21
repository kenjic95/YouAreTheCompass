import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppNavigator } from "./app.navigator";
import { UserProfileProvider } from "../../services/auth/user-profile.context";
import { CourseCatalogProvider } from "../../services/learnings/course-catalog.context";
import { CategoryCatalogProvider } from "../../services/learnings/category-catalog.context";
import { TripCatalogProvider } from "../../services/trips/trip-catalog.context";

export const Navigation = () => (
  <SafeAreaProvider>
    <TripCatalogProvider>
      <CategoryCatalogProvider>
        <CourseCatalogProvider>
          <UserProfileProvider>
            <AppNavigator />
          </UserProfileProvider>
        </CourseCatalogProvider>
      </CategoryCatalogProvider>
    </TripCatalogProvider>
  </SafeAreaProvider>
);
