import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { LearningsScreen } from "../../features/learnings/screens/learnings.screen";
import { CoursesScreen } from "../../features/learnings/screens/courses.screen";

const LearningsStack = createStackNavigator();

export const LearningsNavigator = () => {
  return (
    <LearningsStack.Navigator headerMode="none">
      <LearningsStack.Screen name="Create" component={LearningsScreen} />
      <LearningsStack.Screen name="Courses" component={CoursesScreen} />
    </LearningsStack.Navigator>
  );
};
