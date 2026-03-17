import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { LearningsScreen } from "../../features/learnings/screens/learnings.screen";

const LearningsStack = createStackNavigator();

export const LearningsNavigator = () => {
  return (
    <LearningsStack.Navigator headerMode="none">
      <LearningsStack.Screen name="LearningsHome" component={LearningsScreen} />
    </LearningsStack.Navigator>
  );
};
