import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppNavigator } from "./app.navigator";
import { UserProfileProvider } from "../../services/auth/user-profile.context";
import { CourseCatalogProvider } from "../../services/learnings/course-catalog.context";
import { CategoryCatalogProvider } from "../../services/learnings/category-catalog.context";
import { TripCatalogProvider } from "../../services/connect-trips/trip-catalog.context";
import { LanguagePreferenceProvider } from "../../services/settings/language.context";

export const Navigation = () => (
  <SafeAreaProvider>
    <TripCatalogProvider>
      <CategoryCatalogProvider>
        <CourseCatalogProvider>
          <UserProfileProvider>
            <LanguagePreferenceProvider>
              <AppNavigator />
            </LanguagePreferenceProvider>
          </UserProfileProvider>
        </CourseCatalogProvider>
      </CategoryCatalogProvider>
    </TripCatalogProvider>
  </SafeAreaProvider>
);
