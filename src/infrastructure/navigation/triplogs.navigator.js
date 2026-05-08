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
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#ffffff",
            shadowColor: "transparent",
            elevation: 0,
          },
          headerTintColor: "#2f2f2f",
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontSize: 17,
            fontWeight: "700",
            color: "#2f2f2f",
          },
        }}
      >
        <TripLogsStack.Screen
          name="TripLogsMain"
          component={TripLogsScreen}
          options={{ headerShown: false }}
        />
        <TripLogsStack.Screen
          name="CreateJournal"
          component={CreateJournalScreen}
          options={({ route }) => ({
            title: route?.params?.journalId ? "Edit Journal" : "Create Journal",
          })}
        />
      </TripLogsStack.Navigator>
    </TripLogsProvider>
  );
};
