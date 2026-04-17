import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export const STUDENT_TAB_ICON = {
  Home: "home",
  Podcast: "headset",
  Create: "bulb",
  "Trip Logs": "map",
  Settings: "ellipsis-horizontal",
};

export const CREATOR_TAB_ICON = {
  Home: "home",
  "Manage Courses": "cloud-upload",
  Settings: "ellipsis-horizontal",
};

export const createTabScreenOptions =
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
