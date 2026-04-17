import React from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeNavigator } from "./home.navigator";
import { PodcastNavigator } from "./podcast.navigator";
import { LearningsNavigator } from "./learnings.navigator";
import { TripLogsNavigator } from "./triplogs.navigator";
import { SettingsNavigator } from "./settings.navigator";
import { createTabScreenOptions, STUDENT_TAB_ICON } from "./tab-screen-options";

const Tab = createBottomTabNavigator();

export const MainTabNavigator = () => (
  <Tab.Navigator screenOptions={createTabScreenOptions(STUDENT_TAB_ICON)}>
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
      options={({ route }) => {
        const nestedRouteName = getFocusedRouteNameFromRoute(route) ?? "Create";
        const shouldHideTabBar = nestedRouteName === "CoursePlayer";

        return {
          headerShown: false,
          tabBarStyle: shouldHideTabBar ? { display: "none" } : undefined,
        };
      }}
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
