import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React from "react";
import { ThemeProvider } from "styled-components/native";

import {
  useFonts as useOswald,
  Oswald_400Regular,
} from "@expo-google-fonts/oswald";
import { useFonts as useLato, Lato_400Regular } from "@expo-google-fonts/lato";
import { useFonts } from "expo-font";
import { theme } from "./src/infrastructure/theme";
import { Navigation } from "./src/infrastructure/navigation";

export default function App() {
  const [oswaldLoaded] = useOswald({
    Oswald_400Regular,
  });
  const [latoLoaded] = useLato({
    Lato_400Regular,
  });
  const [customLoaded] = useFonts({
    Avenir_Regular: require("./src/infrastructure/theme/customFont/Avenir-Regular.ttf"),
  });

  const [customheavyLoaded] = useFonts({
    Avenir_Regular: require("./src/infrastructure/theme/customFont/Avenir-Heavy.ttf"),
  });

  if (!oswaldLoaded || !latoLoaded || !customLoaded || !customheavyLoaded) {
    return null;
  }
  return (
    <>
      <ExpoStatusBar style="auto" />
      <ThemeProvider theme={theme}>
        <Navigation />
      </ThemeProvider>
    </>
  );
}
