import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React from "react";
import { ThemeProvider } from "styled-components/native";
import { theme } from "./src/infrastracture/theme";
import { PodcastScreen } from "./src/features/podcasts/screens/podcasts.screen";

export default function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <PodcastScreen />
      </ThemeProvider>
      <ExpoStatusBar style="auto" />
    </>
  );
}
