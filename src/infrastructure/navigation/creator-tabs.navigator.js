import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeNavigator } from "./home.navigator";
import { SettingsNavigator } from "./settings.navigator";
import { ManageCoursesNavigator } from "./manage-courses.navigator";
import { createTabScreenOptions, CREATOR_TAB_ICON } from "./tab-screen-options";

const Tab = createBottomTabNavigator();

export const CreatorTabNavigator = () => (
  <Tab.Navigator screenOptions={createTabScreenOptions(CREATOR_TAB_ICON)}>
    <Tab.Screen
      name="Home"
      component={HomeNavigator}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Manage Courses"
      component={ManageCoursesNavigator}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsNavigator}
      options={{ headerShown: false }}
    />
  </Tab.Navigator>
);
