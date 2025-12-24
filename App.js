import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React from "react";
import { PodcastsScreen } from "./src/features/podcasts/screens/podcasts.screen";

export default function App() {
  return (
    <>
      <PodcastsScreen />
      <ExpoStatusBar style="auto" />
    </>
  );
}
