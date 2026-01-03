import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React from "react";
import { Text } from "react-native";
import { ThemeProvider } from "styled-components/native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  useFonts as useOswald,
  Oswald_400Regular,
} from "@expo-google-fonts/oswald";
import { useFonts as useLato, Lato_400Regular } from "@expo-google-fonts/lato";
import { useFonts } from "expo-font";
import { theme } from "./src/infrastracture/theme";
import { AlbumScreen } from "./src/features/albums/screens/album.screen";
import { SafeArea } from "./src/components/utility/safe-area.component";

const Tab = createBottomTabNavigator();

const Home = () => (
  <SafeArea>
    <Text>Home</Text>
  </SafeArea>
);

const Learning = () => (
  <SafeArea>
    <Text>Learning</Text>
  </SafeArea>
);
const TravelLogs = () => (
  <SafeArea>
    <Text>Travel Logs</Text>
  </SafeArea>
);

const Settings = () => (
  <SafeArea>
    <Text>Settings</Text>
  </SafeArea>
);

export default function App() {
  const [oswaldLoaded] = useOswald({
    Oswald_400Regular,
  });
  const [latoLoaded] = useLato({
    Lato_400Regular,
  });
  const [customLoaded] = useFonts({
    Avenir_Regular: require("./src/infrastracture/theme/customFont/Avenir-Regular.ttf"),
  });

  const [customheavyLoaded] = useFonts({
    Avenir_Regular: require("./src/infrastracture/theme/customFont/Avenir-Heavy.ttf"),
  });

  if (!oswaldLoaded || !latoLoaded || !customLoaded || !customheavyLoaded) {
    return null;
  }
  return (
    <>
      <ExpoStatusBar style="auto" />
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Podcast" component={AlbumScreen} />
            <Tab.Screen name="Learning" component={Learning} />
            <Tab.Screen name="Travel Logs" component={TravelLogs} />
            <Tab.Screen name="Settings" component={Settings} />
          </Tab.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </>
  );
}
