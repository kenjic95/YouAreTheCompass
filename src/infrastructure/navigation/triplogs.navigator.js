import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { TripLogsScreen } from "../../features/triplogs/screens/triplogs.screen";
import { CreateJournalScreen } from "../../features/triplogs/screens/create-journal.screen";
import { TripLogsProvider } from "../../services/triplogs/journals.context";

const TripLogsStack = createStackNavigator();

export const TripLogsNavigator = () => {
  return (
    <TripLogsProvider>
      <TripLogsStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <TripLogsStack.Screen name="TripLogsMain" component={TripLogsScreen} />
        <TripLogsStack.Screen
          name="CreateJournal"
          component={CreateJournalScreen}
        />
      </TripLogsStack.Navigator>
    </TripLogsProvider>
  );
};
