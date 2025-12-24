import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React from "react";
import { PodcastScreen } from "./src/features/podcasts/screens/podcasts.screen";

export default function App() {
  return (
    <>
      <ExpoStatusBar style="auto" />
      <PodcastScreen />
    </>
  );
}
