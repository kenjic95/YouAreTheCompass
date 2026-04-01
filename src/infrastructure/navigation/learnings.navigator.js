import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { LearningsScreen } from "../../features/learnings/screens/learnings.screen";
import { CoursesScreen } from "../../features/learnings/screens/courses.screen";
import { CoursePreviewScreen } from "../../features/learnings/screens/course-preview.screen";
import { CourseCheckoutScreen } from "../../features/learnings/screens/course-checkout.screen";

const LearningsStack = createStackNavigator();

export const LearningsNavigator = () => {
  return (
    <LearningsStack.Navigator headerMode="none">
      <LearningsStack.Screen name="Create" component={LearningsScreen} />
      <LearningsStack.Screen name="Courses" component={CoursesScreen} />
      <LearningsStack.Screen name="Course" component={CoursePreviewScreen} />
      <LearningsStack.Screen name="Checkout" component={CourseCheckoutScreen} />
    </LearningsStack.Navigator>
  );
};
